import { ChartPlugin, getTimeDimensions } from "@visualize-admin/core";

export const chartPlugin: ChartPlugin = {
  name: "bar",
  iconName: "bar",
  isPossibleChartType: (meta) => true,
  isValidConfig: () => true,
  getInitialConfig: ({ dimensions, measures }) => {
    return {
      chartType: "line",
      filters: {},
      fields: {
        x: {
          componentIri: getTimeDimensions(dimensions)[0].iri,
        },
        y: { componentIri: measures[0].iri },
      },
    };
  },
  configOptions: {
    chartType: "line",
    encodings: [
      { field: "y", optional: false, values: ["Measure"], filters: false },
      {
        field: "x",
        optional: false,
        values: ["TemporalDimension"],
        filters: true,
      },
      {
        field: "segment",
        optional: true,
        values: ["NominalDimension", "OrdinalDimension"],
        filters: true,
        // sorting: [
        //   { sortingType: "byTotalSize", sortingOrder: ["asc", "desc"] },
        //   { sortingType: "byDimensionLabel", sortingOrder: ["asc", "desc"] },
        // ],
        options: [{ field: "color", values: ["palette"] }],
      },
    ],
  },
};
