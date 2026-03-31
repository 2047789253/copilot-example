# Copilot Customization Example Project

A demonstration of GitHub Copilot's customization capabilities, including:

- 🎨 **Skills** - Specialized workflows (Remotion video creation)
- 📋 **Prompts** - Reusable task templates (unit test generation)
- 🤖 **Custom Agents** - Specialized AI roles (code review, video building)
- 🔗 **MCP Integration** - Direct tool access (Remotion rendering)

## Quick Start

### 1. Install Dependencies

```bash
# Install project dependencies
npm install

# Install MCP server dependencies
cd .github/mcp-servers/remotion-mcp
npm install
cd ../../../
```

### 2. Start Copilot Customization

- Open `.github/copilot-instructions.md` for overview
- Review `.github/MCP_INTEGRATION.md` for MCP setup
- Check `.github/skills/remotion/SKILL.md` for Remotion learning

### 3. Use the Remotion Video Builder Agent

In VS Code Copilot Chat:

1. Select the `remotion-video-builder` agent
2. Say: "Create a 3-second welcome video with animated text"
3. Watch as Copilot:
   - Writes the React component
   - Renders it using MCP tools
   - Gives you the final MP4 file

## Project Structure

```
.
├── .github/                          # All Copilot customization
│   ├── copilot-instructions.md       # Global workspace rules
│   ├── MCP_INTEGRATION.md            # MCP setup guide
│   ├── skills/
│   │   └── remotion/                 # Remotion learning skill
│   ├── prompts/
│   │   └── generate-unit-tests.prompt.md
│   ├── agents/
│   │   ├── code-reviewer.agent.md
│   │   └── remotion-video-builder.agent.md
│   └── mcp-servers/
│       └── remotion-mcp/             # MCP server implementation
├── src/                              # Remotion video components
│   ├── Root.tsx                      # Composition definitions
│   ├── MyVideo.tsx                   # Example video 1
│   └── WelcomeVideo.tsx              # Example video 2
├── public/                           # Static assets
├── package.json                      # Dependencies
├── remotion.config.ts                # Remotion configuration
└── tsconfig.json                     # TypeScript config
```

## Available Commands

```bash
# Start preview server (development)
npm start

# Render videos (local)
npm run render

# Build for production
npm run build
```

## Available Customizations

### Skills

- **Remotion** (`/remotion`) - Learn how to create videos with React

### Prompts

- **Generate Unit Tests** (`/generate-unit-tests`) - Auto-generate test cases

### Custom Agents

- **Code Reviewer** - Strict code analysis with security focus
- **Remotion Video Builder** - Create and render videos with MCP tools

### MCP Tools (via Agent)

- `remotion_render` - Render compositions to MP4/WebM
- `remotion_preview` - Start local preview server
- `remotion_list_compositions` - List available videos
- `remotion_validate` - Validate configurations

## Example Videos

Two example compositions are pre-configured:

1. **MyVideo** (5 seconds) - Animated Remotion logo with rotation
2. **WelcomeVideo** (3 seconds) - Sliding welcome text with color transition

Render them:

```bash
# Using Copilot (select remotion-video-builder agent)
# Say: "Render MyVideo to output.mp4"

# Or manually:
npx remotion render src/Root.tsx MyVideo my-video.mp4
```

## How It Works

### Without MCP

1. You describe a video
2. Copilot generates code
3. You manually run `npm run build` and `npx remotion render`

### With MCP

1. You describe a video
2. Copilot generates code
3. Copilot calls MCP render tool
4. You get the video file directly

## Learning Path

1. **Read the docs** → [copilot-instructions.md](.github/copilot-instructions.md)
2. **Learn Remotion** → Type `/remotion` in chat
3. **See examples** → Check `src/MyVideo.tsx` and `src/WelcomeVideo.tsx`
4. **Create videos** → Use `remotion-video-builder` agent
5. **Get reviews** → Use `code-reviewer` agent
6. **Generate tests** → Type `/generate-unit-tests` in chat

## Next Steps

- [ ] Run `npm install` to install all dependencies
- [ ] Run `cd .github/mcp-servers/remotion-mcp && npm install` for MCP
- [ ] Restart VS Code
- [ ] Select `remotion-video-builder` agent in Copilot Chat
- [ ] Ask: "Create a 3-second countdown video"
- [ ] Watch the magic happen ✨

## Resources

- [Remotion Documentation](https://remotion.dev)
- [GitHub Copilot Customization](https://code.visualstudio.com/docs/copilot/customization)
- [MCP Protocol Spec](https://spec.modelcontextprotocol.io/)

## Troubleshooting

**"npm: command not found"**

- Install Node.js from nodejs.org

**"Remotion not found"**

- Run `npm install remotion`

**MCP server won't start**

- Check `cd .github/mcp-servers/remotion-mcp && npm install`
- Restart VS Code

**Video rendering fails**

- Ensure `src/Root.tsx` is valid
- Check composition ID matches
- Look for error messages in output

---

**Ready to create amazing videos with Copilot!** 🚀
