import { GenericField, SortingOrder, SortingType } from "@visualize-admin/core";
import * as t from "io-ts";

export const BarFields = t.intersection([
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
