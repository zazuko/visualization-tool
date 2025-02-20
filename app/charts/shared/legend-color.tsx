import React, { memo } from "react";

import { AreasState } from "@/charts/area/areas-state";
import { GroupedBarsState } from "@/charts/bar/bars-grouped-state";
import { BarsState } from "@/charts/bar/bars-state";
import { GroupedColumnsState } from "@/charts/column/columns-grouped-state";
import { StackedColumnsState } from "@/charts/column/columns-stacked-state";
import { ColumnsState } from "@/charts/column/columns-state";
import { LinesState } from "@/charts/line/lines-state";
import { PieState } from "@/charts/pie/pie-state";
import { ScatterplotState } from "@/charts/scatterplot/scatterplot-state";
import {
  ColorsChartState,
  useChartState,
} from "@/charts/shared/use-chart-state";
import { useInteractiveFilters } from "@/charts/shared/use-interactive-filters";
import Flex from "@/components/flex";
import { Checkbox } from "@/components/form";

type LegendSymbol = "square" | "line" | "circle";

export const InteractiveLegendColor = () => {
  const [state, dispatch] = useInteractiveFilters();
  const { categories } = state;
  const activeInteractiveFilters = Object.keys(categories);
  const { colors } = useChartState() as
    | BarsState
    | GroupedBarsState
    | ColumnsState
    | StackedColumnsState
    | GroupedColumnsState
    | LinesState
    | AreasState
    | ScatterplotState
    | PieState;

  const setFilter = (item: string) => {
    if (activeInteractiveFilters.includes(item)) {
      dispatch({
        type: "REMOVE_INTERACTIVE_FILTER",
        value: item,
      });
    } else {
      dispatch({
        type: "ADD_INTERACTIVE_FILTER",
        value: item,
      });
    }
  };
  return (
    <Flex
      sx={{
        position: "relative",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexWrap: "wrap",
        minHeight: "20px",
      }}
    >
      {colors.domain().map((item, i) => (
        <Checkbox
          label={item}
          name={item}
          value={item}
          checked={!activeInteractiveFilters.includes(item)}
          onChange={() => setFilter(item)}
          key={i}
          color={colors(item)}
        />
      ))}
    </Flex>
  );
};

export const LegendColor = memo(function LegendColor({
  symbol,
}: {
  symbol: LegendSymbol;
}) {
  // @ts-ignore
  const { colors, getSegmentLabel } = useChartState() as ColorsChartState;

  return (
    <Flex
      sx={{
        position: "relative",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexWrap: "wrap",
        minHeight: "20px",
      }}
    >
      {colors.domain().map((item, i) => (
        <LegendItem
          key={i}
          item={getSegmentLabel(item)}
          color={colors(item)}
          symbol={symbol}
        />
      ))}
    </Flex>
  );
});

export const LegendItem = ({
  item,
  color,
  symbol,
}: {
  item: string;
  color: string;
  symbol: LegendSymbol;
}) => (
  <Flex
    sx={{
      position: "relative",
      mt: 1,
      mr: 4,
      justifyContent: "flex-start",
      alignItems: "center",
      pl: 2,

      lineHeight: ["1rem", "1.125rem", "1.125rem"],
      fontWeight: "regular",
      fontSize: ["0.625rem", "0.75rem", "0.75rem"],
      color: "grey.700",

      "&::before": {
        content: "''",
        position: "relative",
        display: "block",
        left: -2,
        width: ".5rem",
        height: symbol === "square" || symbol === "circle" ? `.5rem` : 2,
        borderRadius: symbol === "circle" ? "50%" : 0,
        backgroundColor: color,
      },
    }}
  >
    {item}
  </Flex>
);
