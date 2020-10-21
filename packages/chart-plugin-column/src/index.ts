import type { ChartPlugin } from "@visualize-admin/core";

export const chartPlugin: ChartPlugin = {
  name: "column",
  iconName: "column",
  isPossibleChartType: (meta) => true,
  isValidConfig: () => true,
  getInitialConfig: ({ dimensions, measures }) => {
    return {
      chartType: "column",
      filters: {},
      fields: {
        x: {
          componentIri: dimensions[0].iri,
          sorting: { sortingType: "byDimensionLabel", sortingOrder: "asc" },
        },
        y: { componentIri: measures[0].iri },
      },
    };
  },
  configOptions: {
    chartType: "column",
    encodings: [
      { field: "y", optional: false, values: ["Measure"], filters: false },
      {
        field: "x",
        optional: false,
        values: ["TemporalDimension", "NominalDimension", "OrdinalDimension"],
        filters: true,
        sorting: [
          { sortingType: "byMeasure", sortingOrder: ["asc", "desc"] },
          { sortingType: "byDimensionLabel", sortingOrder: ["asc", "desc"] },
        ],
      },
      {
        field: "segment",
        optional: true,
        values: ["TemporalDimension", "NominalDimension", "OrdinalDimension"],
        filters: true,
        sorting: [
          { sortingType: "byDimensionLabel", sortingOrder: ["asc", "desc"] },
          { sortingType: "byTotalSize", sortingOrder: ["asc", "desc"] },
        ],
        options: [
          { field: "chartSubType", values: ["stacked", "grouped"] },
          { field: "color", values: ["palette"] },
        ],
      },
    ],
  },
};
