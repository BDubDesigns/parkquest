"use client";

import { useId } from "react";

interface ParkQuestStampProps {
  topText: string;
  bottomText: string;
  centerText: string;
  date: string;
  serialNumber: string;
  color: string;
  size?: number;
  rotation?: number;
  className?: string;
}

export default function ParkQuestStamp({
  topText,
  bottomText,
  centerText,
  date,
  serialNumber,
  color,
  size = 280,
  rotation = 0,
  className = "",
}: ParkQuestStampProps) {
  const uniqueId = useId();
  const noiseFilterId = `stamp-noise-${uniqueId}`;
  const roughEdgeFilterId = `stamp-rough-${uniqueId}`;
  const topTextPathId = `stamp-top-${uniqueId}`;
  const bottomTextPathId = `stamp-bottom-${uniqueId}`;

  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = size * 0.42;
  const innerRadius = size * 0.34;
  const scallops = 28;

  let scallopPath = "";
  for (let i = 0; i < scallops; i++) {
    const startAngle = (i * 2 * Math.PI) / scallops;
    const midAngle = ((i + 0.5) * 2 * Math.PI) / scallops;
    const endAngle = ((i + 1) * 2 * Math.PI) / scallops;

    const sx = cx + innerRadius * Math.cos(startAngle);
    const sy = cy + innerRadius * Math.sin(startAngle);
    const mx = cx + outerRadius * Math.cos(midAngle);
    const my = cy + outerRadius * Math.sin(midAngle);
    const ex = cx + innerRadius * Math.cos(endAngle);
    const ey = cy + innerRadius * Math.sin(endAngle);

    if (i === 0) {
      scallopPath += `M ${sx.toFixed(2)} ${sy.toFixed(2)}`;
    }
    scallopPath += ` Q ${mx.toFixed(2)} ${my.toFixed(2)} ${ex.toFixed(2)} ${ey.toFixed(2)}`;
  }
  scallopPath += " Z";

  const textRadius = innerRadius - 10;
  const topPathD = `M ${cx - textRadius},${cy} A ${textRadius} ${textRadius} 0 0 1 ${cx + textRadius},${cy}`;
  const bottomPathD = `M ${cx + textRadius},${cy} A ${textRadius} ${textRadius} 0 0 1 ${cx - textRadius},${cy}`;

  const centerFontSize =
    centerText.length > 20
      ? size * 0.04
      : centerText.length > 12
        ? size * 0.052
        : size * 0.064;

  const centerTextProps =
    centerText.length > 16
      ? ({
          textLength: innerRadius * 1.55,
          lengthAdjust: "spacingAndGlyphs",
        } as const)
      : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      role="img"
      aria-label={`Passport stamp for ${centerText}`}
    >
      <defs>
        <filter
          id={roughEdgeFilterId}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={size * 0.01}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id={noiseFilterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"
            in="noise"
            result="coloredNoise"
          />
          <feComposite
            operator="in"
            in="coloredNoise"
            in2="SourceGraphic"
            result="composite"
          />
        </filter>
      </defs>

      {/* Ink group: rough-edged border, rings, and text */}
      <g fill={color} stroke={color} filter={`url(#${roughEdgeFilterId})`}>
        {/* Outer scalloped border */}
        <path
          d={scallopPath}
          fill="none"
          strokeWidth={size * 0.012}
          strokeOpacity="0.92"
        />

        {/* Inner ring */}
        <circle
          cx={cx}
          cy={cy}
          r={innerRadius - 8}
          fill="none"
          strokeWidth={size * 0.008}
          strokeOpacity="0.8"
        />

        {/* Curved text paths */}
        <path id={topTextPathId} d={topPathD} fill="none" stroke="none" />
        <path id={bottomTextPathId} d={bottomPathD} fill="none" stroke="none" />

        <text
          fill={color}
          stroke="none"
          fontSize={size * 0.05}
          fontWeight="700"
          letterSpacing={size * 0.01}
        >
          <textPath
            href={`#${topTextPathId}`}
            startOffset="50%"
            textAnchor="middle"
          >
            {topText.toUpperCase()}
          </textPath>
        </text>

        <text
          fill={color}
          stroke="none"
          fontSize={size * 0.036}
          fontWeight="600"
          letterSpacing={size * 0.007}
        >
          <textPath
            href={`#${bottomTextPathId}`}
            startOffset="50%"
            textAnchor="middle"
          >
            {bottomText.toUpperCase()}
          </textPath>
        </text>

        {/* Center content */}
        <text
          x={cx}
          y={cy - size * 0.04}
          textAnchor="middle"
          fill={color}
          stroke="none"
          fontSize={centerFontSize}
          fontWeight="800"
          letterSpacing="-0.5"
          {...centerTextProps}
        >
          {centerText}
        </text>

        <line
          x1={cx - innerRadius * 0.5}
          y1={cy + size * 0.01}
          x2={cx + innerRadius * 0.5}
          y2={cy + size * 0.01}
          strokeWidth={size * 0.005}
          strokeOpacity="0.75"
        />

        <text
          x={cx}
          y={cy + size * 0.06}
          textAnchor="middle"
          fill={color}
          stroke="none"
          fontSize={size * 0.04}
          fontWeight="600"
        >
          {date}
        </text>

        <text
          x={cx}
          y={cy + size * 0.1}
          textAnchor="middle"
          fill={color}
          stroke="none"
          fontSize={size * 0.032}
          fontFamily="monospace"
          letterSpacing="1"
        >
          {serialNumber}
        </text>
      </g>

      {/* Grunge speckle overlay */}
      <path
        d={scallopPath}
        fill={color}
        fillOpacity="0.12"
        filter={`url(#${noiseFilterId})`}
        style={{ mixBlendMode: "multiply" }}
      />
    </svg>
  );
}
