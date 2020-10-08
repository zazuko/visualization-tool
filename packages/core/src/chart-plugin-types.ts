import { IconName } from "@visualize-admin/icons";
import { ReactNode } from "react";
import { ChartConfig, ChartType, SortingOrder } from "./config-types";
import { Dimension } from "./data-types";

export type ChartPlugin = {
  name: string;
  iconName: IconName;
  isPossibleChartType: (dataCubeMetadata: any) => boolean;
  isValidConfig: (config: any) => boolean;
  getInitialConfig: ({
    dimensions,
    measures,
  }: {
    dimensions: Dimension[];
    measures: Dimension[];
  }) => ChartConfig;
  configOptions: ChartSpec;
  previewComponent: () => ReactNode;
  publishedComponent: () => ReactNode;
};

/**
 * This module controls chart controls displayed in the UI.
 * Related to config-types.ts.
 */

// This should match graphQL Schema
type DimensionType =
  | "TemporalDimension"
  | "NominalDimension"
  | "OrdinalDimension"
  | "Measure"
  | "Attribute";

type EncodingField = "x" | "y" | "segment";
type EncodingOption = "chartSubType" | "sorting" | "color";

type EncodingOptions =
  | undefined
  | {
      field: EncodingOption;
      values: string[] | { field: string; values?: string | string[] }[];
    }[];
type EncodingSortingOption = {
  sortingType: "byDimensionLabel" | "byTotalSize" | "byMeasure";
  sortingOrder: SortingOrder[];
};
interface EncodingSpec {
  field: EncodingField;
  optional: boolean;
  values: DimensionType[];
  filters: boolean;
  sorting?: EncodingSortingOption[]; // { field: string; values: string | string[] }[];
  options?: EncodingOptions;
}
interface ChartSpec {
  chartType: ChartType;
  encodings: EncodingSpec[];
}
