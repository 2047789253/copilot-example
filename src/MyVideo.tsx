import { useCurrentFrame, interpolate } from "remotion";

export const MyVideo = () => {
  const frame = useCurrentFrame();

  // Fade in animation
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  // Scale animation
  const scale = interpolate(frame, [0, 30, 60], [0.5, 1.1, 1]);

  // Rotation animation
  const rotation = interpolate(frame, [0, 150], [0, 360]);

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          fontSize: 72,
          fontWeight: "bold",
          color: "#fff",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        🎬 Remotion
      </div>
      <p
        style={{
          opacity,
          fontSize: 24,
          color: "rgba(255, 255, 255, 0.8)",
          marginTop: 20,
          fontFamily: "Arial, sans-serif",
        }}
      >
        Make Videos Programmatically
      </p>
    </div>
  );
};
