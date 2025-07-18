// HeatmapBackground.tsx
import React from "react";
import { Group } from "@visx/group";
import genBins, { Bin, Bins } from "@visx/mock-data/lib/generators/genBins";
import { scaleLinear } from "@visx/scale";
import { HeatmapCircle } from "@visx/heatmap";
import { getSeededRandom } from "@visx/mock-data";

// 유틸 함수
function max<Datum>(data: Datum[], value: (d: Datum) => number): number {
  return Math.max(...data.map(value));
}

export default function HeatmapBackground({ columns = 20, rows = 20, color = "#f33d15" }: { columns?: number; rows?: number; color?: string }) {
  const hot1 = `${color}70`;
  const hot2 = color;

  // 데이터 생성
  const seededRandom = getSeededRandom(Date.now());
  const binData = genBins(
    columns, // columns
    rows, // rows
    (idx) => 150 * idx,
    (i) => 25 * i * seededRandom()
  );

  const bins = (d: Bins) => d.bins;
  const count = (d: Bin) => d.count;

  const colorMax = max(binData, (d) => max(bins(d), count));
  const bucketSizeMax = max(binData, (d) => bins(d).length);

  // SVG 영역 자동 계산
  const numCols = binData.length;
  const numRows = bucketSizeMax;
  const gap = 0;
  const radius = 10;
  const binWidth = radius * 2 + gap;
  const binHeight = radius * 2 + gap;
  const heatmapWidth = numCols * binWidth;
  const heatmapHeight = numRows * binHeight;

  // 스케일
  const xScale = scaleLinear<number>({
    domain: [0, numCols],
    range: [0, heatmapWidth],
  });
  const yScale = scaleLinear<number>({
    domain: [0, numRows],
    range: [0, heatmapHeight], // y축 반전
  });
  const colorScale = scaleLinear<string>({
    range: [hot1, hot2],
    domain: [0, colorMax],
  });
  const opacityScale = scaleLinear<number>({
    range: [0.1, 1],
    domain: [0, colorMax],
  });

  return (
    <svg width={heatmapWidth} height={heatmapHeight}>
      <Group top={0} left={0}>
        <HeatmapCircle
          data={binData}
          xScale={(d) => xScale(d) ?? 0}
          yScale={(d) => yScale(d) ?? 0}
          colorScale={colorScale}
          opacityScale={opacityScale}
          radius={radius}
          gap={gap}
        >
          {(heatmap) =>
            heatmap.map((rows) =>
              rows.map((bin) => <circle key={`circle-${bin.row}-${bin.column}`} cx={bin.cx} cy={bin.cy} r={bin.r} fill={bin.color} fillOpacity={bin.opacity} />)
            )
          }
        </HeatmapCircle>
      </Group>
    </svg>
  );
}
