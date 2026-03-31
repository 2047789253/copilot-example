---
name: remotion
description: 'Build and render videos programmatically with React. Use when creating dynamic video content, animations, data visualizations, or procedural video generation. Covers project setup, component composition, animations, rendering, and deployment.'
argument-hint: 'Describe your video requirement: "3-second countdown timer", "animated chart", "intro with voiceover", etc.'
user-invocable: true
---

# Remotion Video Framework

Create videos programmatically using React components. Remotion combines browser rendering with ffmpeg to turn React code into video files.

## When to Use

- Generate videos from data or templates
- Create animated intros, outros, transitions
- Build data visualization videos
- Automate video production workflows
- Render dynamic content to video files

## Quick Start

### 1. Initialize a New Project

```bash
npx create-remotion-app my-video
cd my-video
npm start
```

### 2. Create Your First Composition

Edit `src/Root.tsx`:

```tsx
import { Composition } from 'remotion';
import { MyVideo } from './MyVideo';

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyVideo"
      component={MyVideo}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

### 3. Build Your Video Component

Create `src/MyVideo.tsx`:

```tsx
import { useVideoFrame } from 'remotion';

export const MyVideo = () => {
  const frame = useVideoFrame();
  
  return (
    <div style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ color: '#fff', fontSize: 72 }}>
        Frame: {frame}
      </h1>
    </div>
  );
};
```

## Core Concepts

### Frames & Duration
- All timing is **frame-based**, not seconds
- `durationInFrames`: Total number of frames
- `fps` (frames per second): Usually 30 or 60
- **Seconds to frames**: `seconds * fps` (e.g., 5 seconds @ 30fps = 150 frames)

### Key Hooks

| Hook | Purpose |
|------|---------|
| `useFrame({ frame })` | Get current frame number |
| `useVideoFrame()` | Shorter version of above |
| `useCurrentFrame()` | Alias for above |
| `useAbsoluteFrame()` | Frame number within overall timeline |
| `useVideoConfig()` | Get fps, width, height, durationInFrames |

### Animation Helpers

```tsx
import { interpolate, Easing } from 'remotion';

// Smooth value changes over time
const opacity = interpolate(
  frame,
  [0, 30],           // frame range
  [0, 1],            // value range
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
);

// Easing functions
const scale = interpolate(
  frame,
  [0, 60],
  [0.5, 1],
  { easing: Easing.bezier(0.25, 0.1, 0.25, 1) }
);
```

### Common Animation Patterns

```tsx
// Fade in effect
const opacity = interpolate(frame, [0, 30], [0, 1]);

// Slide animation
const x = interpolate(frame, [0, 60], [-100, 0]);

// Scale + rotate combo
const scale = interpolate(frame, [0, 30, 60], [0, 1.1, 1]);
const rotation = interpolate(frame, [0, 60], [0, 360]);
```

## Project Structure

```
my-video/
├── src/
│   ├── Root.tsx              # Composition definitions
│   ├── MyVideo.tsx           # Main video component
│   ├── components/           # Reusable components
│   │   ├── Title.tsx
│   │   ├── Scene.tsx
│   │   └── Transition.tsx
│   └── styles/               # Global styles
├── public/                   # Static assets (images, fonts, audio)
├── remotion.config.ts        # Rendering config
└── package.json
```

## Rendering to File

### Using the CLI

```bash
# Preview (development)
npm start

# Render to MP4
npx remotion render src/Root.tsx MyVideo output.mp4

# Render with options
npx remotion render src/Root.tsx MyVideo output.mp4 \
  --codec h264 \
  --quality 100 \
  --width 1920 \
  --height 1080
```

### Programmatic Rendering

```tsx
import { bundle } from '@remotion/bundler';
import { renderMedia } from '@remotion/renderer';

await bundle();
await renderMedia({
  composition: 'MyVideo',
  serveUrl: 'http://localhost:3000',
  codec: 'h264',
  outputLocation: 'output.mp4',
});
```

## Common Patterns

### Multi-Scene Video

```tsx
export const MultiScene = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  
  const scene1Start = 0;
  const scene1End = 3 * fps;  // 3 seconds
  const scene2End = 6 * fps;  // 3 more seconds
  
  if (frame < scene1End) {
    return <Scene1 />;
  } else if (frame < scene2End) {
    return <Scene2 />;
  }
  return <Scene3 />;
};
```

### Text Animation

```tsx
export const AnimatedText = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = interpolate(frame, [0, 30], [0.8, 1]);
  
  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      fontSize: 48,
      color: '#fff'
    }}>
      Hello, Remotion!
    </div>
  );
};
```

### With Audio/Video Assets

```tsx
import { Audio, Video, useVideoFrame } from 'remotion';

export const WithMedia = () => {
  return (
    <>
      <Video src="/my-video.mp4" startFrom={0} />
      <Audio src="/my-audio.mp3" />
    </>
  );
};
```

## Configuration File

Create `remotion.config.ts`:

```tsx
import { Config } from 'remotion';

Config.setCodecH264({ preset: 'ultrafast' });
Config.setFrameRange([0, 150]);
Config.setDimensions({ width: 1920, height: 1080 });
```

## Troubleshooting

### "Can't find composition" Error
- Check composition `id` matches the render command
- Ensure component is exported from `Root.tsx`
- Restart the dev server

### Black/blank video output
- Check `durationInFrames` > 0
- Verify component renders correctly in preview
- Check `fps` matches expected timing

### Audio out of sync
- Use `from` and `duration` props on `<Audio />` instead of relying on auto-positioning
- Explicitly specify `durationInFrames` in composition

### Performance Issues
- Reduce initial render dimensions, scale up in post
- Lazy-load heavy components
- Use web workers for heavy computations
- Profile with React DevTools in preview

## Deployment Options

- **Render locally**: Complete control, no cost
- **Google Cloud Run**: Scalable serverless rendering
- **AWS Lambda**: Per-function rendering
- **Remotion Lambda**: Official serverless solution (requires account)

## Useful Resources

- Official docs: https://remotion.dev
- GitHub: https://github.com/remotion-dev/remotion
- Discord community: Very active, great for help
- Examples repo: See `packages/examples/` in GitHub

