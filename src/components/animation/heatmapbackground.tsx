// HeatmapBackground.tsx
import React from "react";
import { Group } from "@visx/group";
import genBins, { Bin, Bins } from "@visx/mock-data/lib/generators/genBins";
import { scaleLinear } from "@visx/scale";
import { HeatmapCircle } from "@visx/heatmap";
import { getSeededRandom } from "@visx/mock-data";

const hot1 = "#77312f";
const hot2 = "#f33d15";

// 데이터 생성
const seededRandom = getSeededRandom(0.41);
const binData = genBins(
  16, // columns
  16, // rows
  (idx) => 150 * idx,
  (i, number) => 25 * i * seededRandom()
);

// 유틸 함수
function max<Datum>(data: Datum[], value: (d: Datum) => number): number {
  return Math.max(...data.map(value));
}

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

export type HeatmapProps = {
  events?: boolean;
};

export default function HeatmapBackground({ events = false }: HeatmapProps) {
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
              rows.map((bin) => (
                <circle
                  key={`circle-${bin.row}-${bin.column}`}
                  cx={bin.cx}
                  cy={bin.cy}
                  r={bin.r}
                  fill={bin.color}
                  fillOpacity={bin.opacity}
                  onClick={() => {
                    if (!events) return;
                    alert(JSON.stringify({ row: bin.row, column: bin.column, bin: bin.bin }));
                  }}
                />
              ))
            )
          }
        </HeatmapCircle>
      </Group>
    </svg>
  );
}
