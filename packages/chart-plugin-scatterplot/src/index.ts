import { ChartPlugin, getCategoricalDimensions } from "@visualize-admin/core";
import { mapColorsToComponentValuesIris } from "@visualize-admin/core/src/chart-helpers";

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
          componentIri: measures.length > 1 ? measures[1].iri : measures[0].iri,
        },
        segment: {
          componentIri: getCategoricalDimensions(dimensions)[0].iri,
          palette: "category10",
          colorMapping: mapColorsToComponentValuesIris({
            palette: "category10",
            component: getCategoricalDimensions(dimensions)[0],
          }),
        },
      },
    };
  },
  configOptions: {
    chartType: "bar",
    encodings: [
      {
        field: "x",
        optional: false,
        values: ["Measure"],
        filters: false,
      },
      { field: "y", optional: false, values: ["Measure"], filters: false },
      {
        field: "segment",
        optional: true,
        values: ["TemporalDimension", "NominalDimension", "OrdinalDimension"],
        filters: true,
        options: [{ field: "color", values: ["palette"] }],
      },
    ],
  },
};
