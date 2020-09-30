import * as t from "io-ts";

import {
  GenericField,
  SortingType,
  SortingOrder,
  ColorMapping,
  Filters,
} from "@visualize-admin/core";

const SegmentField = t.intersection([
  t.type({
    componentIri: t.string,
  }),
  t.type({
    type: t.union([t.literal("stacked"), t.literal("grouped")]),
  }),
  t.type({ palette: t.string }),
  t.partial({
    colorMapping: ColorMapping,
  }),
  t.partial({
    sorting: t.type({
      sortingType: SortingType,
      sortingOrder: SortingOrder,
    }),
  }),
]);

export type SegmentField = t.TypeOf<typeof SegmentField>;
export type SegmentFields = Record<string, SegmentField | undefined>;

const BarFields = t.intersection([
  t.type({
    x: GenericField,
    y: t.intersection([
      t.type({
        componentIri: t.string,
      }),
      t.partial({
        sorting: t.type({
          sortingType: SortingType,
          sortingOrder: SortingOrder,
        }),
      }),
    ]),
  }),
  t.partial({
    segment: SegmentField,
  }),
]);
const BarConfig = t.type(
  {
    chartType: t.literal("bar"),
    filters: Filters,
    fields: BarFields,
  },
  "BarConfig"
);
export type BarFields = t.TypeOf<typeof BarFields>;
export type BarConfig = t.TypeOf<typeof BarConfig>;

const ColumnFields = t.intersection([
  t.type({
    x: t.intersection([
      t.type({
        componentIri: t.string,
      }),
      t.partial({
        sorting: t.type({
          sortingType: SortingType,
          sortingOrder: SortingOrder,
        }),
      }),
    ]),
    y: GenericField,
  }),
  t.partial({
    segment: SegmentField,
  }),
]);
const ColumnConfig = t.type(
  {
    chartType: t.literal("column"),
    filters: Filters,
    fields: ColumnFields,
  },
  "ColumnConfig"
);
export type ColumnFields = t.TypeOf<typeof ColumnFields>;
export type ColumnConfig = t.TypeOf<typeof ColumnConfig>;

const LineFields = t.intersection([
  t.type({
    x: GenericField,
    y: GenericField,
  }),
  t.partial({
    segment: t.intersection([
      t.type({
        componentIri: t.string,
      }),
      t.type({ palette: t.string }),
      t.partial({
        colorMapping: ColorMapping,
      }),
    ]),
  }),
]);
const LineConfig = t.type(
  {
    chartType: t.literal("line"),
    filters: Filters,
    fields: LineFields,
  },
  "LineConfig"
);
export type LineFields = t.TypeOf<typeof LineFields>;
export type LineConfig = t.TypeOf<typeof LineConfig>;

const AreaFields = t.intersection([
  t.type({
    x: GenericField,
    y: GenericField,
  }),

  t.partial({
    segment: t.intersection([
      t.type({
        componentIri: t.string,
      }),
      t.type({ palette: t.string }),
      t.partial({
        colorMapping: ColorMapping,
      }),
      t.partial({
        sorting: t.type({
          sortingType: SortingType,
          sortingOrder: SortingOrder,
        }),
      }),
    ]),
  }),
]);
const AreaConfig = t.type(
  {
    chartType: t.literal("area"),
    filters: Filters,
    fields: AreaFields,
  },
  "AreaConfig"
);

export type AreaFields = t.TypeOf<typeof AreaFields>;
export type AreaConfig = t.TypeOf<typeof AreaConfig>;

const ScatterPlotFields = t.intersection([
  t.type({
    x: GenericField,
    y: GenericField,
  }),
  t.partial({
    segment: t.intersection([
      t.type({ componentIri: t.string }),
      t.type({ palette: t.string }),
      t.partial({
        colorMapping: ColorMapping,
      }),
    ]),
  }),
]);
const ScatterPlotConfig = t.type(
  {
    chartType: t.literal("scatterplot"),
    filters: Filters,
    fields: ScatterPlotFields,
  },
  "ScatterPlotConfig"
);
export type ScatterPlotFields = t.TypeOf<typeof ScatterPlotFields>;
export type ScatterPlotConfig = t.TypeOf<typeof ScatterPlotConfig>;

const PieFields = t.type({
  y: GenericField,
  // FIXME: "segment" should be "x" for consistency
  segment: t.intersection([
    t.type({
      componentIri: t.string,
      palette: t.string,
    }),
    t.partial({
      colorMapping: ColorMapping,
    }),
    t.partial({
      sorting: t.type({
        sortingType: SortingType,
        sortingOrder: SortingOrder,
      }),
    }),
  ]),
});
const PieConfig = t.type(
  {
    chartType: t.literal("pie"),
    filters: Filters,
    fields: PieFields,
  },
  "PieConfig"
);
export type PieFields = t.TypeOf<typeof PieFields>;
export type PieConfig = t.TypeOf<typeof PieConfig>;

export type ChartFields =
  | ColumnFields
  | BarFields
  | LineFields
  | AreaFields
  | ScatterPlotFields
  | PieFields;
