import React from "react";
import { extent, max } from "@visx/vendor/d3-array";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { scaleTime, scaleLinear } from "@visx/scale";
import generateDateValue, { DateValue } from "@visx/mock-data/lib/generators/genDateValue";

type RandomLinesProps = {
  width?: number;
  height?: number;
  lineCount?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
  backgroundColor?: string;
};

export default function RandomLines({
  width = 100,
  height = 100,
  lineCount = 10,
  strokeColor = "#000",
  strokeOpacity = 1,
  strokeWidth = 3,
  backgroundColor = "transparent",
}: RandomLinesProps) {
  const lineHeight = height / lineCount;

  const series: DateValue[][] = Array.from({ length: lineCount }, (_, i) =>
    generateDateValue(25, i / (Math.random() * 10 + 70)).sort((a, b) => a.date.getTime() - b.date.getTime())
  );
  const allData = series.flat();

  // Data accessors
  const getX = (d: DateValue) => d.date;
  const getY = (d: DateValue) => d.value;

  // Scales
  const xScale = scaleTime<number>({
    domain: extent(allData, getX) as [Date, Date],
    range: [0, width],
  });
  const yScale = scaleLinear<number>({
    domain: [0, max(allData, getY) ?? 0],
    range: [lineHeight - 2, 0],
  });

  return (
    <svg
      width="100%"
      height="100%"
      className="w-full h-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={width} height={height} fill={backgroundColor} />
      {series.map((lineData, i) => (
        <Group key={`line-${i}`} top={i * lineHeight}>
          <LinePath<DateValue>
            data={lineData}
            x={(d) => xScale(getX(d)) ?? 0}
            y={(d) => yScale(getY(d)) ?? 0}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeOpacity={strokeOpacity}
            shapeRendering="geometricPrecision"
          />
        </Group>
      ))}
    </svg>
  );
}
