import { useCurrentFrame, interpolate, Easing } from "remotion";

export const WelcomeVideo = () => {
  const frame = useCurrentFrame();

  // Text slide-in animation
  const textX = interpolate(frame, [0, 30], [-200, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });

  // Text opacity
  const textOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Background color shift
  const bgColor1 = interpolate(frame, [0, 45], [255, 200]);
  const bgColor2 = interpolate(frame, [0, 45], [100, 150]);
  const bgColor3 = interpolate(frame, [0, 45], [200, 255]);

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: `rgb(${bgColor1}, ${bgColor2}, ${bgColor3})`,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        padding: 40,
      }}
    >
      <div
        style={{
          transform: `translateX(${textX}px)`,
          opacity: textOpacity,
          fontSize: 72,
          fontWeight: "bold",
          color: "#fff",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          textShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        Welcome to Copilot!
      </div>
      <div
        style={{
          transform: `translateX(${textX}px)`,
          opacity: textOpacity,
          fontSize: 32,
          color: "rgba(255, 255, 255, 0.9)",
          marginTop: 30,
          fontFamily: "Arial, sans-serif",
        }}
      >
        Powered by Remotion & MCP
      </div>
    </div>
  );
};
