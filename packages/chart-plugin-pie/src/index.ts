import { ChartPlugin, getCategoricalDimensions } from "@visualize-admin/core";
import { mapColorsToComponentValuesIris } from "@visualize-admin/core/src/chart-helpers";

export const chartPlugin: ChartPlugin = {
  name: "bar",
  iconName: "bar",
  isPossibleChartType: (meta) => true,
  isValidConfig: () => true,
  getInitialConfig: ({ dimensions, measures }) => {
    return {
      chartType: "pie",
      filters: {},
      fields: {
        y: { componentIri: measures[0].iri },
        segment: {
          componentIri: getCategoricalDimensions(dimensions)[0].iri,
          palette: "category10",
          sorting: { sortingType: "byMeasure", sortingOrder: "asc" },
          colorMapping: mapColorsToComponentValuesIris({
            palette: "category10",
            component: getCategoricalDimensions(dimensions)[0],
          }),
        },
      },
    };
  },
  configOptions: {
    chartType: "pie",
    encodings: [
      {
        field: "y",
        optional: false,
        values: ["Measure"],
        filters: false,
      },
      {
        field: "segment",
        optional: false,
        values: ["TemporalDimension", "NominalDimension", "OrdinalDimension"],
        filters: true,
        sorting: [
          { sortingType: "byMeasure", sortingOrder: ["asc", "desc"] },
          { sortingType: "byDimensionLabel", sortingOrder: ["asc", "desc"] },
        ],
        options: [{ field: "color", values: ["palette"] }],
      },
    ],
  },
};
