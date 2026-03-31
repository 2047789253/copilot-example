#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "remotion-mcp-server",
  version: "1.0.0",
});

const workspaceRoot = process.cwd();
const defaultRoot = "src/Root.tsx";

const resolveRootFile = (srcFile = defaultRoot) => {
  return path.resolve(workspaceRoot, srcFile);
};

const getNpxCommand = () => {
  return process.platform === "win32" ? "npx.cmd" : "npx";
};

const runCommand = ({ command, args, timeoutMs = 120000 }) => {
  const result = spawnSync(command, args, {
    cwd: workspaceRoot,
    encoding: "utf-8",
    timeout: timeoutMs,
    maxBuffer: 1024 * 1024 * 10,
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  const stdout = (result.stdout || "").trim();
  const stderr = (result.stderr || "").trim();

  if (result.status !== 0) {
    const details = [
      `Command failed (${result.status ?? "unknown"}): ${command} ${args.join(" ")}`,
      stdout ? `stdout:\n${stdout}` : "",
      stderr ? `stderr:\n${stderr}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
    throw new Error(details);
  }

  return { stdout, stderr };
};

const listCompositionsInternal = (src = defaultRoot) => {
  const npx = getNpxCommand();
  const rootFile = resolveRootFile(src);
  const args = ["remotion", "compositions", rootFile, "--json"];
  const { stdout } = runCommand({ command: npx, args, timeoutMs: 120000 });

  try {
    const parsed = JSON.parse(stdout);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    throw new Error(
      `Failed to parse compositions JSON output. Raw output:\n${stdout}`,
    );
  }
};

server.tool(
  "test_mcp_connection",
  "Test if Copilot can successfully call an MCP tool without crashing.",
  {},
  async () => {
    return {
      content: [
        {
          type: "text",
          text: "MCP connection is healthy.",
        },
      ],
    };
  },
);

server.tool(
  "remotion_list_compositions",
  "List available Remotion compositions.",
  {
    src: z
      .string()
      .default(defaultRoot)
      .describe("Path to Remotion root entry file, default: src/Root.tsx"),
  },
  async ({ src }) => {
    try {
      const compositions = listCompositionsInternal(src);
      const lines = compositions.map((comp) => {
        const fps = comp.fps ?? "n/a";
        const width = comp.width ?? "n/a";
        const height = comp.height ?? "n/a";
        const frames = comp.durationInFrames ?? "n/a";
        return `- ${comp.id}: ${width}x${height}, ${fps}fps, ${frames} frames`;
      });

      return {
        content: [
          {
            type: "text",
            text:
              lines.length > 0
                ? ["Available compositions:", ...lines].join("\n")
                : "No compositions found.",
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to list compositions: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "remotion_validate",
  "Validate whether a composition exists and has sane config.",
  {
    composition_id: z.string().describe("Composition id to validate"),
    src: z
      .string()
      .default(defaultRoot)
      .describe("Path to Remotion root entry file, default: src/Root.tsx"),
  },
  async ({ composition_id, src }) => {
    try {
      const compositions = listCompositionsInternal(src);
      const found = compositions.find((comp) => comp.id === composition_id);

      if (!found) {
        const allIds =
          compositions.map((comp) => comp.id).join(", ") || "(none)";
        return {
          content: [
            {
              type: "text",
              text: `Composition '${composition_id}' not found. Available ids: ${allIds}`,
            },
          ],
        };
      }

      const issues = [];
      if (!(found.durationInFrames > 0)) {
        issues.push("durationInFrames should be > 0");
      }
      if (!(found.fps > 0)) {
        issues.push("fps should be > 0");
      }
      if (!(found.width > 0 && found.height > 0)) {
        issues.push("width/height should be > 0");
      }

      const base = `Validated '${found.id}': ${found.width}x${found.height}, ${found.fps}fps, ${found.durationInFrames} frames.`;
      const status = issues.length
        ? `${base}\nWarnings:\n- ${issues.join("\n- ")}`
        : `${base}\nNo issues detected.`;

      return {
        content: [{ type: "text", text: status }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Validation failed: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "remotion_render",
  "Render a Remotion composition to a media file.",
  {
    composition_id: z.string().describe("Composition id to render"),
    output_path: z.string().describe("Output file path, e.g. out/video.mp4"),
    codec: z
      .enum(["h264", "h265", "vp8", "vp9", "prores"])
      .optional()
      .describe("Video codec"),
    quality: z
      .number()
      .int()
      .min(0)
      .max(100)
      .optional()
      .describe("Render quality 0-100"),
    fps: z.number().positive().optional().describe("Override FPS"),
    src: z
      .string()
      .default(defaultRoot)
      .describe("Path to Remotion root entry file, default: src/Root.tsx"),
  },
  async ({ composition_id, output_path, codec, quality, fps, src }) => {
    try {
      const npx = getNpxCommand();
      const rootFile = resolveRootFile(src);
      const outputFile = path.resolve(workspaceRoot, output_path);

      const args = ["remotion", "render", rootFile, composition_id, outputFile];

      if (codec) args.push("--codec", codec);
      if (typeof quality === "number") args.push("--quality", String(quality));
      if (typeof fps === "number") args.push("--fps", String(fps));

      const { stdout, stderr } = runCommand({
        command: npx,
        args,
        timeoutMs: 1000 * 60 * 30,
      });

      const tail = [stdout, stderr]
        .filter(Boolean)
        .join("\n")
        .split("\n")
        .slice(-20)
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `Render completed.\nOutput: ${outputFile}\n\nRecent logs:\n${tail || "(no logs)"}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Render failed: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "remotion_preview",
  "Start Remotion preview server in background.",
  {
    port: z.number().int().min(1).max(65535).default(3000),
  },
  async ({ port }) => {
    try {
      const command = process.platform === "win32" ? "npm.cmd" : "npm";
      const args = ["run", "start", "--", "--port", String(port)];

      const child = spawn(command, args, {
        cwd: workspaceRoot,
        detached: true,
        stdio: "ignore",
        shell: false,
      });
      child.unref();

      return {
        content: [
          {
            type: "text",
            text: `Preview server starting in background at http://localhost:${port} (pid: ${child.pid ?? "n/a"}).`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to start preview: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Remotion MCP Server running on stdio");
