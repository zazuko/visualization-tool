import type { ChartPlugin } from "@visualize-admin/core";

export const chartPlugin: ChartPlugin = {
  name: "bar",
  iconName: "bar",
  isPossibleChartType: (meta) => true,
  isValidConfig: () => true,
  getInitialConfig: ({ dimensions, measures }) => {
    return {
      chartType: "bar",
      filters: {},
      fields: {
        x: { componentIri: measures[0].iri },
        y: {
          componentIri: dimensions[0].iri,
          sorting: { sortingType: "byDimensionLabel", sortingOrder: "asc" },
        },
      },
    };
  },
  configOptions: {
    chartType: "bar",
    encodings: [
      {
        field: "y",
        optional: false,
        values: ["TemporalDimension", "NominalDimension", "OrdinalDimension"],
        filters: true,
      },
      {
        field: "x",
        optional: false,
        values: ["Measure"],
        filters: false,
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
          { field: "chartSubType", values: ["grouped"] },
          { field: "color", values: ["palette"] },
        ],
      },
    ],
  },
};
