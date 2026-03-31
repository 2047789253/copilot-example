# MCP 与 Remotion 集成指南

## 概述

本项目现在有一个完整的 **MCP (Model Context Protocol) 服务器**，能让 Copilot 直接调用 Remotion 的工具。这意味着你可以让 Copilot：

- 🎬 **渲染视频** — 直接生成 MP4、WebM 等
- 👀 **启动预览服务** — 快速测试视频
- 📋 **列表查询** — 看所有可用的 compositions
- ✅ **验证配置** — 检查 composition 是否正确

## 架构

```
Copilot Chat
    ↓
.vscode/mcp.json
    ↓
remotion-mcp 服务器（Node.js）
    ↓
你的 Remotion 项目 + npm
    ↓
输出：完整的视频文件
```

## 安装步骤

### 1. 安装 MCP 服务器依赖

```bash
cd .github/mcp-servers/remotion-mcp
npm install
```

### 2. 安装 Remotion（如果还没有）

在你的项目根目录：

```bash
npm install remotion
```

### 3. 重启 VS Code

Copilot 会自动加载新的 MCP 配置。

## 使用方法

### 方式 1：选择 Remotion Video Builder Agent

```
1. 在 Copilot Chat 中打开代理选择器
2. 选择 "remotion-video-builder" agent
3. 描述你的需求："创建一个 5 秒的倒计时视频"
4. 我会：
   - 写 React 代码
   - 调用 remotion_render 工具实际渲染
   - 给你完整的 MP4 输出
```

### 方式 2：直接使用 Skill

继续使用现有的 `/remotion` skill 来学习和获取指导。

### 方式 3：编程方式

你的代码可以直接调用 MCP 工具（如果在 VS Code 扩展中）。

## 可用的 MCP 工具

### remotion_render

**功能**：将 Remotion composition 渲染为视频文件

```
输入：
- composition_id: "MyVideo" (必需)
- output_path: "output.mp4" (必需)
- codec: "h264" | "h265" | "vp8" | "vp9" | "prores"
- quality: 0-100 (可选, 默认 80)
- fps: 帧率 (可选, 使用 composition 的默认值)

输出：
- 完整的视频文件
- 渲染日志
```

### remotion_preview

**功能**：启动本地开发预览服务器

```
输入：
- port: 3000 (可选)

输出：
- 预览服务器地址
- 热重载说明
```

### remotion_list_compositions

**功能**：列出项目中所有可用的 compositions

```
输入：
- src: "src/Root.tsx" (composition 定义文件)

输出：
- 所有 composition ID、帧率、分辨率
```

### remotion_validate

**功能**：验证 composition 配置

```
输入：
- composition_id: "MyVideo"

输出：
- 配置检查结果
- 常见问题警告
```

## 实际例子

### 例 1：创建和渲染视频

```
你：选择 remotion-video-builder agent
你：我想要一个 3 秒的文字淡入动画，背景蓝色，字白色

我的步骤：
1. 写 React 组件代码
2. 创建 Composition 配置
3. 调用 remotion_render 工具
4. 给你完整的 output.mp4
```

### 例 2：列表和验证

```
你：使用 code-reviewer agent
你：检查我的 Remotion 配置是否正确

我的步骤：
1. 调用 remotion_list_compositions
2. 调用 remotion_validate
3. 给出建议和修复
```

## 配置文件

### .vscode/mcp.json

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

这告诉 Copilot：

- 启动一个名为 `remotion-mcp` 的 MCP 服务器
- 使用 Node.js 运行 `index.js`
- 通过 stdio 连接

## 限制与已知问题

✅ **工作良好**：

- 渲染到 MP4、WebM、ProRes
- 小视频（< 30 秒）
- 静态资源（图片、字体）

⚠️ **需要手动干预**：

- 大型视频（> 1 分钟）可能需要分段渲染
- 实时预览需要你在终端运行 `npm run start`
- 外部 API 调用需要代理配置

❌ **不支持**：

- 实时流媒体输出
- GPU 加速（取决于你的系统）
- 某些编码器（硬件相关）

## 故障排除

### "Command not found: node"

- 安装 Node.js (16 或更高版本)
- 重启 VS Code

### "Remotion not found"

- 运行 `npm install remotion`
- 确保在项目根目录

### MCP 服务器不启动

- 检查 package.json dependencies
- 运行 `npm install` 在 remotion-mcp 文件夹
- 查看 VS Code 输出面板的错误信息

### 渲染失败

- 检查 src/Root.tsx 是否有效
- 确保 composition 配置正确
- 查看渲染输出中的错误信息

## 下一步

1. **安装依赖** — `npm install` 在 .github/mcp-servers/remotion-mcp/
2. **测试 MCP** — 创建一个简单的 Remotion 项目
3. **使用 Agent** — 选择 `remotion-video-builder` agent
4. **扩展工具** — 根据需要添加更多 MCP 工具

## 资源

- [MCP 规范](https://spec.modelcontextprotocol.io/)
- [Remotion 官方文档](https://remotion.dev)
- [本项目 Remotion Skill](.github/skills/remotion/SKILL.md)
- [Video Builder Agent](.github/agents/remotion-video-builder.agent.md)
