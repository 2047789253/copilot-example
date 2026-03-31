import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";

const TAU = Math.PI * 2;

const graphWidth = 900;
const graphHeight = 520;
const graphX = 850;
const graphY = 180;

const axisColor = "rgba(255,255,255,0.4)";
const labelColor = "rgba(255,255,255,0.85)";

type TrigName = "sin" | "cos" | "tan";

const colorByTrig: Record<TrigName, string> = {
  sin: "#ff7f50",
  cos: "#6ec1ff",
  tan: "#ffdd57",
};

const clampTan = (value: number): number => {
  const limit = 2.4;
  return Math.max(-limit, Math.min(limit, value));
};

const makePath = (
  fn: (x: number) => number,
  samples: number,
  xToPx: (x: number) => number,
  yToPx: (y: number) => number,
): string => {
  let path = "";

  for (let i = 0; i <= samples; i++) {
    const x = (i / samples) * TAU;
    const y = fn(x);
    const px = xToPx(x);
    const py = yToPx(y);
    path += `${i === 0 ? "M" : "L"}${px.toFixed(2)},${py.toFixed(2)} `;
  }

  return path.trim();
};

const makeTanPath = (
  samples: number,
  xToPx: (x: number) => number,
  yToPx: (y: number) => number,
): string => {
  let path = "";
  let drawing = false;
  let previousY = 0;

  for (let i = 0; i <= samples; i++) {
    const x = (i / samples) * TAU;
    const yRaw = Math.tan(x);
    const y = clampTan(yRaw);

    const shouldBreak =
      i > 0 &&
      (Math.abs(yRaw) > 2.4 ||
        Math.abs(previousY - y) > 1.2 ||
        !Number.isFinite(yRaw));

    if (shouldBreak) {
      drawing = false;
    }

    const px = xToPx(x);
    const py = yToPx(y);

    if (!drawing) {
      path += `M${px.toFixed(2)},${py.toFixed(2)} `;
      drawing = true;
    } else {
      path += `L${px.toFixed(2)},${py.toFixed(2)} `;
    }

    previousY = y;
  }

  return path.trim();
};

const functionAt = (name: TrigName, x: number): number => {
  if (name === "sin") return Math.sin(x);
  if (name === "cos") return Math.cos(x);
  return clampTan(Math.tan(x));
};

export const TrigFunctionsDemo = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const intro = interpolate(frame, [0, 22], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const phase = interpolate(frame, [0, durationInFrames - 1], [0, TAU], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const unitRadius = 200;
  const circleCx = 360;
  const circleCy = 440;

  const xToPx = (x: number) => graphX + (x / TAU) * graphWidth;
  const yToPx = (y: number) =>
    graphY + graphHeight / 2 - y * (graphHeight * 0.38);

  const sinPath = useMemo(
    () => makePath(Math.sin, 480, xToPx, yToPx),
    [xToPx, yToPx],
  );
  const cosPath = useMemo(
    () => makePath(Math.cos, 480, xToPx, yToPx),
    [xToPx, yToPx],
  );
  const tanPath = useMemo(() => makeTanPath(600, xToPx, yToPx), [xToPx, yToPx]);

  const pointX = circleCx + Math.cos(phase) * unitRadius;
  const pointY = circleCy - Math.sin(phase) * unitRadius;

  const activeX = xToPx(phase);

  const activeValues: Array<{ name: TrigName; value: number }> = [
    { name: "sin", value: functionAt("sin", phase) },
    { name: "cos", value: functionAt("cos", phase) },
    { name: "tan", value: functionAt("tan", phase) },
  ];

  const phaseText = `${phase.toFixed(2)} rad (${(
    (phase / Math.PI) *
    180
  ).toFixed(1)} deg)`;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        background:
          "radial-gradient(circle at 15% 15%, #1f2f6b 0%, #0f1938 45%, #090d1d 100%)",
        color: "white",
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
      }}
    >
      <svg width={1920} height={1080} style={{ opacity: intro }}>
        <text x={110} y={95} fill={labelColor} fontSize={52} fontWeight={700}>
          Trigonometric Functions Demo
        </text>
        <text x={112} y={138} fill="rgba(255,255,255,0.65)" fontSize={28}>
          Unit circle + synchronized sin / cos / tan curves
        </text>

        <circle
          cx={circleCx}
          cy={circleCy}
          r={unitRadius}
          fill="none"
          stroke={axisColor}
          strokeWidth={2}
        />
        <line
          x1={circleCx - 260}
          y1={circleCy}
          x2={circleCx + 260}
          y2={circleCy}
          stroke={axisColor}
          strokeWidth={1.5}
        />
        <line
          x1={circleCx}
          y1={circleCy - 260}
          x2={circleCx}
          y2={circleCy + 260}
          stroke={axisColor}
          strokeWidth={1.5}
        />

        <line
          x1={circleCx}
          y1={circleCy}
          x2={pointX}
          y2={pointY}
          stroke="#9ec5ff"
          strokeWidth={4}
        />
        <line
          x1={pointX}
          y1={pointY}
          x2={pointX}
          y2={circleCy}
          stroke={colorByTrig.sin}
          strokeWidth={3}
          strokeDasharray="8 8"
        />
        <line
          x1={pointX}
          y1={pointY}
          x2={circleCx}
          y2={pointY}
          stroke={colorByTrig.cos}
          strokeWidth={3}
          strokeDasharray="8 8"
        />

        <circle cx={pointX} cy={pointY} r={11} fill="#ffffff" />

        <rect
          x={graphX}
          y={graphY}
          width={graphWidth}
          height={graphHeight}
          fill="rgba(255,255,255,0.03)"
          rx={14}
        />
        <line
          x1={graphX}
          y1={graphY + graphHeight / 2}
          x2={graphX + graphWidth}
          y2={graphY + graphHeight / 2}
          stroke={axisColor}
          strokeWidth={2}
        />
        <line
          x1={graphX}
          y1={graphY}
          x2={graphX}
          y2={graphY + graphHeight}
          stroke={axisColor}
          strokeWidth={2}
        />

        {[0, 0.5, 1, 1.5, 2].map((k) => {
          const x = xToPx(k * Math.PI);
          return (
            <g key={k}>
              <line
                x1={x}
                y1={graphY + graphHeight / 2 - 8}
                x2={x}
                y2={graphY + graphHeight / 2 + 8}
                stroke="rgba(255,255,255,0.55)"
                strokeWidth={1.5}
              />
              <text
                x={x - 18}
                y={graphY + graphHeight + 36}
                fill="rgba(255,255,255,0.65)"
                fontSize={22}
              >
                {k === 0 ? "0" : k === 1 ? "pi" : k === 2 ? "2pi" : `${k}pi`}
              </text>
            </g>
          );
        })}

        <path
          d={sinPath}
          fill="none"
          stroke={colorByTrig.sin}
          strokeWidth={4}
        />
        <path
          d={cosPath}
          fill="none"
          stroke={colorByTrig.cos}
          strokeWidth={4}
        />
        <path
          d={tanPath}
          fill="none"
          stroke={colorByTrig.tan}
          strokeWidth={3}
          opacity={0.9}
        />

        <line
          x1={activeX}
          y1={graphY}
          x2={activeX}
          y2={graphY + graphHeight}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={2}
          strokeDasharray="7 10"
        />

        {activeValues.map(({ name, value }, index) => {
          const y = yToPx(value);
          return (
            <g key={name}>
              <circle cx={activeX} cy={y} r={8} fill={colorByTrig[name]} />
              <text
                x={130}
                y={760 + index * 58}
                fill={colorByTrig[name]}
                fontSize={38}
                fontWeight={700}
              >
                {name}(x) = {value.toFixed(3)}
              </text>
            </g>
          );
        })}

        <text
          x={graphX + 20}
          y={graphY + 38}
          fill="rgba(255,255,255,0.7)"
          fontSize={24}
        >
          x in [0, 2π]
        </text>

        <text x={130} y={700} fill="rgba(255,255,255,0.78)" fontSize={30}>
          phase = {phaseText}
        </text>
      </svg>
    </div>
  );
};
