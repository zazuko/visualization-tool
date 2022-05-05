import { t, Trans } from "@lingui/macro";
import { Box, Typography } from "@mui/material";
import { BoxProps } from "@mui/system";
import Image from "next/image";
import React, {
  memo,
  useMemo,
  useContext,
  createContext,
  useState,
  useCallback,
} from "react";

import Flex from "@/components/flex";
import { FieldSetLegend } from "@/components/form";
import { ConfiguratorStateConfiguringChart, MapConfig } from "@/configurator";
import { ColorRampField } from "@/configurator/components/chart-controls/color-ramp";
import {
  ControlSection,
  ControlSectionContent,
  SectionTitle,
} from "@/configurator/components/chart-controls/section";
import {
  ChartOptionCheckboxField,
  ChartOptionRadioField,
  ChartOptionSelectField,
  ColorPickerField,
} from "@/configurator/components/field";
import { DimensionValuesMultiFilter } from "@/configurator/components/filters";
import brightImg from "@/configurator/map/assets/bright.png";
import customImg from "@/configurator/map/assets/custom.png";
import defaultImg from "@/configurator/map/assets/default.png";
import openstreetmapsImg from "@/configurator/map/assets/openstreetmaps.png";
import outdoorImg from "@/configurator/map/assets/outdoor.png";
import satelliteImg from "@/configurator/map/assets/satellite.png";
import swisstopogreyImg from "@/configurator/map/assets/swisstopogrey.png";
import {
  GeoFeature,
  getGeoDimensions,
  getGeoShapesDimensions,
} from "@/domain/data";
import { useGeoShapesByDimensionIriQuery } from "@/graphql/query-hooks";
import { DataCubeMetadata } from "@/graphql/types";
import { useLocale } from "@/src";

export const MapColumnOptions = ({
  state,
  metaData,
}: {
  state: ConfiguratorStateConfiguringChart;
  metaData: DataCubeMetadata;
}) => {
  const chartConfig = state.chartConfig as MapConfig;
  const { activeField } = state;

  switch (activeField) {
    case "baseLayer":
      return (
        <>
          <BaseLayersSettings />
          <MapStyleSettings />
        </>
      );
    case "areaLayer":
      return (
        <AreaLayerSettings chartConfig={chartConfig} metaData={metaData} />
      );
    case "symbolLayer":
      return (
        <SymbolLayerSettings
          chartConfig={chartConfig}
          metaData={metaData}
        ></SymbolLayerSettings>
      );
    default:
      return null;
  }
};

const ThemeImg = ({
  selected,
  src,
  name,
  ...props
}: { src: StaticImageData; selected: boolean; name: string } & Omit<
  BoxProps,
  "src"
>) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
      }}
      {...props}
    >
      <Box
        sx={{
          borderStyle: "inset",
          boxSizing: "border-box",
          borderWidth: selected ? "3px" : "1px",
          display: "inline-flex",
          borderRadius: 4,
          overflow: "hidden",
          borderColor: selected ? "#006699" : "gray",
          transition: "transform 0.1s ease",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.025)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        }}
      >
        <Image alt="" width={88} height={88} src={src} />
      </Box>
      <Typography
        sx={{ mt: 1 }}
        variant="caption"
        color="textSecondary"
        textAlign="center"
      >
        {name}
      </Typography>
    </Box>
  );
};

type MapStyle = {
  id: string;
  name: string;
  url: string | undefined;
  img: StaticImageData;
};

const mapTilerToken = "bjdC9JlMbYCu3Yx63rOB";
const defaultCustomURL = `https://api.maptiler.com/maps/winter/style.json?key=${mapTilerToken}`;
export const mapStyles: MapStyle[] = [
  {
    id: "default",
    name: "Default",
    url: undefined,
    img: defaultImg,
  },
  {
    id: "outdoor",
    name: "Outdoor",
    url: `https://api.maptiler.com/maps/outdoor/style.json?key=${mapTilerToken}`,
    img: outdoorImg,
  },
  {
    id: "bright",
    name: "Bright",
    url: `https://api.maptiler.com/maps/bright/style.json?key=${mapTilerToken}`,
    img: brightImg,
  },
  {
    id: "openstreetmaps",
    name: "OSM",
    url: `https://api.maptiler.com/maps/openstreetmap/style.json?key=${mapTilerToken}`,
    img: openstreetmapsImg,
  },
  {
    id: "satellite",
    name: "Satellite",
    url: `https://api.maptiler.com/maps/hybrid/style.json?key=${mapTilerToken}`,
    img: satelliteImg,
  },
  {
    id: "swisstopogrey",
    name: "SwissTopo Grey",
    url: `https://api.maptiler.com/maps/ch-swisstopo-lbm-grey/style.json?key=${mapTilerToken}`,
    img: swisstopogreyImg,
  },
  {
    id: "custom",
    name: "Custom",
    url:
      typeof localStorage !== "undefined"
        ? localStorage.getItem("custom-map-style-url") || defaultCustomURL
        : defaultCustomURL,
    img: customImg,
  },
];

const getSavedStyle = () => {
  if (
    typeof localStorage !== "undefined" &&
    localStorage.getItem("map-style-id")
  ) {
    const id = localStorage.getItem("map-style-id");
    return mapStyles.find((x) => x.id === id) || mapStyles[0];
  }
  return mapStyles[0];
};

const MapStyleContext = createContext({
  selectedStyle: getSavedStyle() || mapStyles[0],
  setSelectedStyle: (style: MapStyle) => {},
});

export const useMapStyle = () => useContext(MapStyleContext);

const MapStyleSettings = () => {
  const { selectedStyle, setSelectedStyle } = useContext(MapStyleContext);
  const handleSelectStyle = (style: MapStyle) => {
    setSelectedStyle(style);
    localStorage.setItem("map-style-id", style.id);
  };

  const handleApplyCustomMapStyleUrl = useCallback(
    (ev) => {
      setSelectedStyle({
        ...selectedStyle,
        url: ev.target.value,
      });
      localStorage.setItem("custom-map-style-url", ev.target.value);
    },
    [selectedStyle, setSelectedStyle]
  );
  return (
    <ControlSection>
      <SectionTitle iconName="mapMaptype">
        <Trans id="chart.map.layers.map-style">Map style</Trans>
      </SectionTitle>
      <ControlSectionContent side="right">
        <Typography variant="body2">Select a theme</Typography>
        <Box
          display="grid"
          sx={{
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "1rem",
            mt: "1rem",
          }}
        >
          {mapStyles.map((style) => (
            <ThemeImg
              key={style.id}
              src={style.img}
              name={style.name}
              selected={selectedStyle.id === style.id}
              onClick={() => handleSelectStyle(style)}
            />
          ))}
        </Box>
        {selectedStyle.id === "custom" ? (
          <input
            defaultValue={selectedStyle.url}
            onBlur={handleApplyCustomMapStyleUrl}
            style={{ width: "100%" }}
          />
        ) : null}
      </ControlSectionContent>
    </ControlSection>
  );
};

export const MapStyleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedStyle, setSelectedStyle] = useState(getSavedStyle());
  const ctx = useMemo(() => {
    return { selectedStyle, setSelectedStyle };
  }, [selectedStyle, setSelectedStyle]);
  return (
    <MapStyleContext.Provider value={ctx}>{children}</MapStyleContext.Provider>
  );
};

export const BaseLayersSettings = memo(() => {
  return (
    <>
      <ControlSection>
        <SectionTitle iconName="mapMaptype">
          <Trans id="chart.map.layers.base">Base Layer</Trans>
        </SectionTitle>
        <ControlSectionContent side="right">
          <ChartOptionCheckboxField
            label={t({
              id: "chart.map.layers.base.show",
              message: "Show",
            })}
            field={null}
            path="baseLayer.show"
          />
        </ControlSectionContent>
      </ControlSection>
    </>
  );
});

export const AreaLayerSettings = memo(
  ({
    chartConfig,
    metaData,
  }: {
    chartConfig: MapConfig;
    metaData: DataCubeMetadata;
  }) => {
    const locale = useLocale();
    const activeField = "areaLayer";
    const geoShapesDimensions = useMemo(
      () => getGeoShapesDimensions(metaData.dimensions),
      [metaData.dimensions]
    );
    const geoShapesDimensionsOptions = useMemo(
      () =>
        geoShapesDimensions.map((d) => ({
          value: d.iri,
          label: d.label,
        })),
      [geoShapesDimensions]
    );

    const [{ data: fetchedGeoShapes }] = useGeoShapesByDimensionIriQuery({
      variables: {
        dataCubeIri: metaData.iri,
        dimensionIri: chartConfig.fields.areaLayer.componentIri,
        locale,
      },
    });

    const geoShapes =
      fetchedGeoShapes?.dataCubeByIri?.dimensionByIri?.__typename ===
      "GeoShapesDimension"
        ? (fetchedGeoShapes.dataCubeByIri.dimensionByIri.geoShapes as any)
        : undefined;

    const hierarchyLevelOptions = useMemo(
      () =>
        [
          ...new Set(
            (
              geoShapes?.topology?.objects?.shapes?.geometries as GeoFeature[]
            )?.map((d) => d.properties.hierarchyLevel)
          ),
        ]?.map((d) => ({ value: d, label: `${d}` })),
      [geoShapes]
    );

    const measuresOptions = useMemo(
      () =>
        metaData.measures.map((d) => ({
          value: d.iri,
          label: d.label,
        })),
      [metaData.measures]
    );

    const numberOfGeoShapes = (geoShapes?.topology?.objects?.shapes?.geometries
      ?.length || 0) as number;

    const numberOfColorScaleClasses = useMemo(
      () =>
        Array.from(
          { length: Math.min(7, Math.max(0, numberOfGeoShapes - 2)) },
          (_, i) => i + 3
        ).map((d) => ({ value: d, label: `${d}` })),
      [numberOfGeoShapes]
    );

    const currentNumberOfColorScaleClasses =
      chartConfig.fields.areaLayer.nbClass;
    const currentColorScaleType = chartConfig.fields.areaLayer.colorScaleType;

    const isAvailable = geoShapesDimensions.length > 0;
    const isHidden = !chartConfig.fields.areaLayer.show;

    return !isAvailable ? (
      <NoGeoDimensionsWarning />
    ) : (
      <>
        <ControlSection>
          <SectionTitle iconName="mapRegions">
            <Trans id="chart.map.layers.area">Areas</Trans>
          </SectionTitle>
          <ControlSectionContent side="right">
            <ChartOptionCheckboxField
              label={t({
                id: "chart.map.layers.show",
                message: "Show layer",
              })}
              field="areaLayer"
              path="show"
            />
          </ControlSectionContent>
        </ControlSection>
        <ControlSection>
          <SectionTitle iconName="chartMap">
            {t({
              id: "controls.dimension.geographical",
              message: "Geographical dimension",
            })}
          </SectionTitle>
          <ControlSectionContent side="right">
            <ChartOptionSelectField
              id="areaLayer.componentIri"
              label={t({
                id: "controls.select.dimension",
                message: "Select a dimension",
              })}
              field={activeField}
              path="componentIri"
              options={geoShapesDimensionsOptions}
              disabled={isHidden}
            />
          </ControlSectionContent>
        </ControlSection>
        <ControlSection>
          <SectionTitle iconName="list">
            {t({ id: "controls.hierarchy", message: "Hierarchy level" })}
          </SectionTitle>
          <ControlSectionContent side="right">
            <ChartOptionSelectField<number>
              id="areaLayer.hierarchyLevel"
              label={t({
                id: "controls.hierarchy.select",
                message: "Select a hierarchy level",
              })}
              field={activeField}
              path="hierarchyLevel"
              options={hierarchyLevelOptions}
              getValue={(d) => +d}
              disabled={isHidden}
            />
          </ControlSectionContent>
        </ControlSection>
        <ControlSection>
          <SectionTitle iconName="chartBar">
            {t({ id: "controls.measure", message: "Measure" })}
          </SectionTitle>
          <ControlSectionContent side="right">
            <ChartOptionSelectField
              id="areaLayer.measureIri"
              label={t({
                id: "controls.select.measure",
                message: "Select a measure",
              })}
              field={activeField}
              path="measureIri"
              options={measuresOptions}
              disabled={isHidden}
            />
          </ControlSectionContent>
        </ControlSection>
        <ControlSection>
          <SectionTitle iconName="color">
            {t({ id: "controls.color", message: "Color" })}
          </SectionTitle>
          <ControlSectionContent side="right">
            <FieldSetLegend
              legendTitle={t({
                id: "controls.scale.type",
                message: "Scale type",
              })}
            />
            <Flex sx={{ justifyContent: "flex-start" }} mt={1}>
              <ChartOptionRadioField
                label={t({
                  id: "chart.map.layers.area.discretization.continuous",
                  message: "Continuous",
                })}
                field={activeField}
                path="colorScaleType"
                value="continuous"
                disabled={isHidden}
              />

              {/* Limit the number of clusters to min. 3 */}
              {numberOfGeoShapes >= 3 && (
                <ChartOptionRadioField
                  label={t({
                    id: "chart.map.layers.area.discretization.discrete",
                    message: "Discrete",
                  })}
                  field={activeField}
                  path="colorScaleType"
                  value="discrete"
                  disabled={isHidden}
                />
              )}
            </Flex>

            <ColorRampField
              field={activeField}
              path="palette"
              nbClass={
                currentColorScaleType === "discrete"
                  ? currentNumberOfColorScaleClasses
                  : undefined
              }
              disabled={isHidden}
            />

            {chartConfig.fields.areaLayer.colorScaleType === "discrete" &&
              numberOfGeoShapes >= 3 && (
                <>
                  <FieldSetLegend legendTitle="Interpolation" />
                  <ChartOptionSelectField
                    id="areaLayer.colorScaleInterpolationType"
                    label={null}
                    field={activeField}
                    path="colorScaleInterpolationType"
                    options={[
                      {
                        label: t({
                          id: "chart.map.layers.area.discretization.quantize",
                          message: "Quantize (equal intervals)",
                        }),
                        value: "quantize",
                      },
                      {
                        label: t({
                          id: "chart.map.layers.area.discretization.quantiles",
                          message: "Quantiles (equal distribution of values)",
                        }),
                        value: "quantile",
                      },
                      {
                        label: t({
                          id: "chart.map.layers.area.discretization.jenks",
                          message: "Jenks (natural breaks)",
                        }),
                        value: "jenks",
                      },
                    ]}
                    disabled={isHidden}
                  />
                  <ChartOptionSelectField<number>
                    id="areaLayer.nbClass"
                    label="Number of classes"
                    field={activeField}
                    path="nbClass"
                    options={numberOfColorScaleClasses}
                    getValue={(d) => +d}
                    disabled={isHidden}
                  />
                </>
              )}
          </ControlSectionContent>
        </ControlSection>
        {!isHidden && (
          <ControlSection>
            <SectionTitle iconName="filter">Filter</SectionTitle>
            <ControlSectionContent side="right">
              <DimensionValuesMultiFilter
                key={chartConfig.fields.areaLayer.componentIri}
                dimensionIri={chartConfig.fields.areaLayer.componentIri}
                dataSetIri={metaData.iri}
              />
            </ControlSectionContent>
          </ControlSection>
        )}
      </>
    );
  }
);

export const SymbolLayerSettings = memo(
  ({
    chartConfig,
    metaData,
  }: {
    chartConfig: MapConfig;
    metaData: DataCubeMetadata;
  }) => {
    const activeField = "symbolLayer";
    const geoDimensions = useMemo(
      () => getGeoDimensions(metaData.dimensions),
      [metaData.dimensions]
    );
    const geoDimensionsOptions = useMemo(
      () =>
        geoDimensions.map((d) => ({
          value: d.iri,
          label: d.label,
        })),
      [geoDimensions]
    );

    const measuresOptions = useMemo(
      () =>
        metaData.measures.map((d) => ({
          value: d.iri,
          label: d.label,
        })),
      [metaData.measures]
    );

    const isAvailable = geoDimensions.length > 0;
    const isHidden = !chartConfig.fields.symbolLayer.show;

    return !isAvailable ? (
      <NoGeoDimensionsWarning />
    ) : (
      <>
        <ControlSection>
          <SectionTitle iconName="mapSymbols">
            <Trans id="chart.map.layers.symbol">Symbols</Trans>
          </SectionTitle>
          <ControlSectionContent side="right">
            <ChartOptionCheckboxField
              label={t({
                id: "chart.map.layers.show",
                message: "Show layer",
              })}
              field="symbolLayer"
              path="show"
            />
          </ControlSectionContent>
        </ControlSection>
        <ControlSection>
          <SectionTitle iconName="chartMap">
            {t({
              id: "controls.dimension.geographical",
              message: "Geographical dimension",
            })}
          </SectionTitle>
          <ControlSectionContent side="right">
            <ChartOptionSelectField
              id="symbolLayer.componentIri"
              label={t({
                id: "controls.select.dimension",
                message: "Select a dimension",
              })}
              field={activeField}
              path="componentIri"
              options={geoDimensionsOptions}
              disabled={isHidden}
            />
          </ControlSectionContent>
        </ControlSection>
        <ControlSection>
          <SectionTitle iconName="chartBar">
            {t({ id: "controls.measure", message: "Measure" })}
          </SectionTitle>
          <ControlSectionContent side="right">
            <ChartOptionSelectField
              id="symbolLayer.measureIri"
              label={t({
                id: "controls.select.measure",
                message: "Select a measure",
              })}
              field={activeField}
              path="measureIri"
              options={measuresOptions}
              disabled={isHidden}
            />
          </ControlSectionContent>
        </ControlSection>
        <ControlSection>
          <SectionTitle iconName="color">
            {t({ id: "controls.color", message: "Color" })}
          </SectionTitle>
          <ControlSectionContent side="right">
            <ColorPickerField
              label={t({
                id: "controls.color.select",
                message: "Select a color",
              })}
              field={activeField}
              path="color"
              disabled={isHidden}
            />
          </ControlSectionContent>
        </ControlSection>
        <ControlSection>
          <SectionTitle iconName="filter">Filter</SectionTitle>
          {!isHidden && (
            <ControlSectionContent side="right">
              <DimensionValuesMultiFilter
                key={chartConfig.fields.symbolLayer.componentIri}
                dimensionIri={chartConfig.fields.symbolLayer.componentIri}
                dataSetIri={metaData.iri}
              />
            </ControlSectionContent>
          )}
        </ControlSection>
      </>
    );
  }
);

const NoGeoDimensionsWarning = () => {
  return (
    <Box sx={{ my: 3, py: 3, px: 5, width: "80%" }}>
      <Trans id="chart.map.warning.noGeoDimensions">
        In this dataset there are no geographical dimensions to display.
      </Trans>
    </Box>
  );
};
