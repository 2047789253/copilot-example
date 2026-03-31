# Remotion MCP Server

This is a Model Context Protocol (MCP) server that exposes Remotion video rendering tools to Copilot.

## What It Does

Enables Copilot to:

- Render Remotion compositions to video files
- Start preview servers
- List available compositions
- Validate composition configurations

## Installation

```bash
npm install
```

## Running

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Configuration

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "remotion-mcp": {
      "command": "node",
      "args": [".github/mcp-servers/remotion-mcp/index.js"],
      "type": "stdio"
    }
  }
}
```

## Available Tools

### remotion_render

Render a composition to an MP4 or other video format.

**Usage:**

```
Tool: remotion_render
Args: {
  "composition_id": "MyVideo",
  "output_path": "output.mp4",
  "codec": "h264",
  "quality": 80
}
```

### remotion_preview

Start a local preview server for development.

**Usage:**

```
Tool: remotion_preview
Args: {
  "port": 3000
}
```

### remotion_list_compositions

List all available compositions in the project.

**Usage:**

```
Tool: remotion_list_compositions
Args: {
  "src": "src/Root.tsx"
}
```

### remotion_validate

Validate a composition configuration.

**Usage:**

```
Tool: remotion_validate
Args: {
  "composition_id": "MyVideo"
}
```

## Limitations

- Remotion must be installed in your project
- MCP server runs on your local machine
- Preview requires running in development mode
- Large renders may take time

## Troubleshooting

**"Command not found: remotion"**

- Install Remotion: `npm install remotion`

**"Permission denied"**

- Ensure the script has execute permissions

**Server won't start**

- Check Node.js version (requires 14+)
- Verify MCP SDK is installed
