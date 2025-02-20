import { max } from "d3";
import { useMemo } from "react";

import { getTickNumber } from "@/charts/shared/axis-height-linear";
import { BRUSH_BOTTOM_SPACE } from "@/charts/shared/brush";
import { ChartProps } from "@/charts/shared/use-chart-state";
import { estimateTextWidth } from "@/lib/estimate-text-width";

const computeChartPadding = (
  yScale: d3.ScaleLinear<number, number>,
  width: number,
  aspectRatio: number,
  interactiveFiltersConfig: ChartProps["interactiveFiltersConfig"],
  formatNumber: (n: number) => string,
  bandDomain?: string[]
) => {
  // Fake ticks to compute maximum tick length as
  // we need to take into account n between [0, 1] where numbers
  // with decimals have greater text length than the extremes.
  // Width * aspectRatio is taken as an approximation of chartHeight
  // since we do not have access to chartHeight yet.
  const fakeTicks = yScale.ticks(getTickNumber(width * aspectRatio));
  const left = Math.max(
    ...fakeTicks.map((x) => estimateTextWidth(`${formatNumber(x)}`))
  );

  let bottom = interactiveFiltersConfig?.time.active ? BRUSH_BOTTOM_SPACE : 40;
  if (bandDomain && bandDomain.length) {
    bottom += max(bandDomain, (d) => estimateTextWidth(d) || 70)!;
  }
  return { left, bottom };
};

export const useChartPadding = (
  yScale: d3.ScaleLinear<number, number>,
  width: number,
  aspectRatio: number,
  interactiveFiltersConfig: ChartProps["interactiveFiltersConfig"],
  formatNumber: (n: number) => string,
  bandDomain?: string[]
) => {
  return useMemo(
    () =>
      computeChartPadding(
        yScale,
        width,
        aspectRatio,
        interactiveFiltersConfig,
        formatNumber,
        bandDomain
      ),
    [
      yScale,
      width,
      aspectRatio,
      interactiveFiltersConfig,
      formatNumber,
      bandDomain,
    ]
  );
};
