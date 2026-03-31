#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"; // 注意这里引入路径变了
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 1. 初始化新版 McpServer
const server = new McpServer({
  name: "test-mcp-server",
  version: "1.0.0",
});

// 2. 极其优雅的工具注册方式：server.tool(名字, 描述, 校验规则, 执行函数)
server.tool(
  "test_mcp_connection",
  "Test if Copilot can successfully call an MCP tool without crashing.",
  {}, // 如果不需要传参数，就给个空对象
  async () => {
    return {
      content: [
        {
          type: "text",
          text: "✅ 恭喜！管道完全畅通！新版 McpServer 通信极其稳定！",
        },
      ],
    };
  },
);
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Modern MCP Server running on stdio");
