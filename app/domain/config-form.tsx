import get from "lodash/get";
import { ChangeEvent, InputHTMLAttributes, useCallback } from "react";
import { getInitialFilters, getInitialState } from ".";
import { ChartType, MetaKey } from "./config-types";
import { useConfiguratorState } from "./configurator-state";
import { DataSetMetadata } from "./data-cube";
import { Locales } from "../locales/locales";

// interface FieldProps {
//   name: HTMLInputElement["name"]
//   onChange: [];
// }
export type Option = {
  value: string | $FixMe;
  label: string | $FixMe;
  disabled?: boolean;
};

export type FieldProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "name" | "value" | "checked" | "type"
>;

export const useField = ({
  path,
  type = "text",
  value
}: {
  path: string;
  type?: "text" | "checkbox" | "radio" | "input" | "select";
  value?: string;
}): FieldProps => {
  const [state, dispatch] = useConfiguratorState();

  const onChange = useCallback<(e: ChangeEvent<HTMLInputElement>) => void>(
    e => {
      dispatch({
        type: "CHART_CONFIG_CHANGED",
        value: {
          path,
          value:
            type === "checkbox"
              ? e.currentTarget.checked
                ? true
                : undefined
              : e.currentTarget.value
        }
      });
    },
    [dispatch, path, type]
  );

  const stateValue =
    state.state === "CONFIGURING_CHART" ? get(state.chartConfig, path, "") : "";

  const checked =
    type === "checkbox"
      ? stateValue
      : type === "radio" || "select"
      ? stateValue === value
      : undefined;

  return {
    name: path,
    value: value ? value : stateValue,
    type,
    checked,
    onChange
  };
};

export const useMetaField = ({
  metaKey,
  locale,
  value
}: {
  metaKey: MetaKey;
  locale: Locales;
  value?: string;
}): FieldProps => {
  const [state, dispatch] = useConfiguratorState();

  const onChange = useCallback<(e: ChangeEvent<HTMLInputElement>) => void>(
    e => {
      dispatch({
        type: "CHART_DESCRIPTION_CHANGED",
        value: {
          path: `${metaKey}.${locale}`,
          value: e.currentTarget.value
        }
      });
    },
    [dispatch, metaKey, locale]
  );

  return {
    name: `${metaKey}-${locale}`,
    value,
    onChange
  };
};

export const useMultiFilterField = ({
  dimensionIri,
  value
}: {
  dimensionIri: string;
  value: string;
}): FieldProps => {
  const [state, dispatch] = useConfiguratorState();

  const onChange = useCallback<(e: ChangeEvent<HTMLInputElement>) => void>(
    e => {
      dispatch({
        type: "CHART_CONFIG_FILTER_SET_MULTI",
        value: {
          dimensionIri,
          values: { [value]: e.currentTarget.checked ? true : undefined }
        }
      });
    },
    [dispatch, dimensionIri, value]
  );

  const checked =
    state.state === "CONFIGURING_CHART"
      ? get(
          state.chartConfig,
          ["filters", dimensionIri, "values", value],
          false
        )
      : false;

  return {
    name: dimensionIri,
    value,
    checked,
    onChange
  };
};

export const useSingleFilterField = ({
  dimensionIri,
  value
}: {
  value: string;
  dimensionIri: string;
}): FieldProps => {
  const [state, dispatch] = useConfiguratorState();

  const onChange = useCallback<(e: ChangeEvent<HTMLInputElement>) => void>(
    e => {
      dispatch({
        type: "CHART_CONFIG_FILTER_SET_SINGLE",
        value: {
          dimensionIri,
          value: e.currentTarget.value
        }
      });
    },
    [dispatch, dimensionIri]
  );

  const stateValue =
    state.state === "CONFIGURING_CHART"
      ? get(state.chartConfig, ["filters", dimensionIri, "value"], "")
      : "";

  const checked = stateValue === value;

  return {
    name: dimensionIri,
    value: value ? value : stateValue,
    checked,
    onChange
  };
};

export const useChartTypeSelectorField = ({
  path,
  value,
  metaData
}: {
  path: string;
  value?: string;
  metaData: DataSetMetadata;
}): FieldProps => {
  const [state, dispatch] = useConfiguratorState();
  const { dimensions, measures } = metaData;
  const onChange = useCallback<(e: ChangeEvent<HTMLInputElement>) => void>(
    e => {
      const chartType = e.currentTarget.value as ChartType;
      const filters = getInitialFilters(dimensions);
      const initialState = getInitialState({ chartType, dimensions, measures });
      dispatch({
        type: "CHART_TYPE_PREVIEWED",
        value: {
          path: "chartConfig",
          value: {
            chartType,
            filters,
            ...initialState
          }
        }
      });
    },
    [dimensions, dispatch, measures]
  );

  const stateValue =
    state.state === "CONFIGURING_CHART" ||
    state.state === "SELECTING_CHART_TYPE"
      ? get(state, "chartConfig.chartType")
      : "";

  const checked = stateValue === value;

  return {
    name: path,
    value: value ? value : stateValue,
    checked,
    onChange
  };
};
