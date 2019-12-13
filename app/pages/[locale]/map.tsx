import React from "react";
import { AppLayout, Center } from "../../components/layout";

import { useVegaView } from "../../lib/use-vega";
import { Spec, View } from "vega";
import {
  useDataSetAndMetadata,
  DataCubeProvider,
  DataSetMetadata,
  useRawObservations,
  MeasureWithMeta
} from "../../domain";
import { Loading } from "../../components/hint";
import { Select, Checkbox } from "../../components/form";
import { Box, Flex, Text } from "rebass";
import { useResizeObserver } from "../../lib/use-resize-observer";
import { DataTableRaw } from "../../components/datatableRaw";
import { format } from "d3-format";

const formatNumber = format(",.2f");

const DEFAULT_CATEGORY = "http://elcom.zazuko.com/category/H4";
const DEFAULT_MEASURE = "http://elcom.zazuko.com/attribute/total";
const FIELDS = {
  municipality: {
    componentIri: "http://elcom.zazuko.com/attribute/municipality"
  },
  total: {
    componentIri: "http://elcom.zazuko.com/attribute/total"
  },
  kev: {
    componentIri: "http://elcom.zazuko.com/attribute/kev"
  },
  gridusage: {
    componentIri: "http://elcom.zazuko.com/attribute/gridusage"
  },
  energy: {
    componentIri: "http://elcom.zazuko.com/attribute/energy"
  },
  fee: {
    componentIri: "http://elcom.zazuko.com/attribute/fee"
  }
};

function getKeyByNestedValue(
  object: Record<string, Record<string, {}>>,
  nestedKey: string,
  value: string
) {
  return Object.keys(object).find(k => object[k][nestedKey] === value);
}

const shapesCtx = require.context(
  "../../public/static/shapes/out",
  true,
  /\d{4}\/.*\.json$/
);

const shapes = new Map<string, TopoJSON.Topology>();

shapesCtx.keys().forEach(k => {
  shapes.set(k, shapesCtx(k));
});

interface MunicipalityDatum {
  count: number; // Aggregated from n suppliers
  iri: string;
  label?: string;
  total: string;
  kev: string;
  gridusage: string;
  energy: string;
  fee: string;
}
interface Municipality {
  id: string;
  observed: MunicipalityDatum;
}

interface MeasureDatum {
  iri: string;
  label: string;
  min: number;
  max: number;
  lookup: string;
}

const Page = () => {
  const rd = useDataSetAndMetadata(
    "http://elcom.zazuko.com/dataset/municipality/electricityTariffs"
  );

  const availableGeoYears = Array.from(shapes.keys())
    .map(d => d.match(/\d+/g))
    .map(d => d && d[0])
    .filter((x, i, a) => a.indexOf(x) === i)
    .sort();

  const latestGeoYear = availableGeoYears[availableGeoYears.length - 1];

  //#region STATE
  const [year, setYear] = React.useState<string>(
    latestGeoYear ? (+latestGeoYear + 1).toString() : "2020"
  );

  /**
   * The map material always refers to the last year.
   */
  const [geoYear, setGeoYear] = React.useState<string>(latestGeoYear || "2019");

  const [category, setCategory] = React.useState<string>(DEFAULT_CATEGORY);
  const [measure, setMeasure] = React.useState<MeasureDatum | undefined>(
    undefined
  );
  const [municipality, setMunicipality] = React.useState<
    undefined | Municipality
  >(undefined);

  const [municipalities, setMunicipalities] = React.useState<
    Map<string, MunicipalityDatum>
  >(new Map());

  const [tableVisibility, setTableVisibility] = React.useState(false);

  const updateMunicipality = React.useCallback((m: Municipality) => {
    setMunicipality(m);
  }, []);

  const memoizedData = React.useMemo(() => {
    return rd.data;
  }, [rd.data]);

  const updateYear = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setMunicipality(undefined);
      const prevYear = +e.currentTarget.value - 1;
      setYear(e.currentTarget.value);
      setGeoYear(prevYear.toString());
    },
    []
  );

  const updateCategory = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setMunicipality(undefined);
      setCategory(e.currentTarget.value);
    },
    []
  );

  const updateMunicipalities = React.useCallback(
    (m: Map<string, MunicipalityDatum>) => {
      setMunicipalities(m);
    },
    []
  );

  const updateTableVisibility = () => {
    setTableVisibility(!tableVisibility);
  };

  const [resizeRef, width, height] = useResizeObserver();

  const updateMeasure = (m: MeasureWithMeta | undefined) => {
    const lookupKey =
      m && getKeyByNestedValue(FIELDS, "componentIri", m.component.iri.value);
    if (m && m.max && m.min && lookupKey) {
      setMeasure({
        iri: m.component.iri.value,
        label: m.component.label.value,
        min: +m.min.value,
        max: +m.max.value,
        lookup: lookupKey
      });
    } else {
      console.warn(`Could not apply filter.`, m);
    }
  };

  React.useEffect(() => {
    if (measure === undefined && rd.state === "loaded") {
      const match = rd.data.measures.find(
        d => d.component.iri.value === DEFAULT_MEASURE
      );
      updateMeasure(match);
    }
  }, [measure, rd]);

  //#endregion
  //#region SPEC
  const spec: Spec = React.useMemo(() => {
    const lakes = shapes.get(`./${geoYear}/ch-lakes.json`);
    const cantons = shapes.get(`./${geoYear}/ch-cantons.json`);
    const municipalities = shapes.get(`./${geoYear}/ch-municipalities.json`);

    return {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width: Math.min(900, width),
      height: height,
      autosize: "fit-x",
      padding: 25,
      projections: [
        {
          name: "projection",
          type: "mercator",
          fit: { signal: "data('cantons')" },
          size: {
            signal: "[width, height]"
          }
        }
      ],
      signals: [
        {
          name: "highlight",
          value: { iri: "" }
        }
      ],
      data: [
        {
          name: "metrics",
          values: [],
          transform: [
            {
              type: "aggregate",
              fields: ["iri", "total", "kev", "gridusage", "energy", "fee"],
              ops: ["count", "mean", "mean", "mean", "mean", "mean"],
              as: ["count", "total", "kev", "gridusage", "energy", "fee"],
              groupby: ["iri", "label", "count"]
            }
          ]
        },
        {
          name: "cantons",
          values: cantons,
          format: {
            type: "topojson",
            feature: "cantons"
          }
        },
        {
          name: "municipalities",
          values: municipalities,
          format: {
            type: "topojson",
            feature: "municipalities"
          },
          transform: [
            {
              type: "formula",
              as: "iri",
              expr:
                "'https://ld.geo.admin.ch/boundaries/municipality/' + datum.id"
            },
            {
              type: "lookup",
              from: "metrics",
              key: "iri",
              fields: ["iri"],
              as: ["observed"],
              default: {
                label: "",
                total: undefined,
                kev: undefined,
                gridusage: undefined,
                energy: undefined,
                fee: undefined
              }
            }
          ]
        },
        {
          name: "lakes",
          values: lakes,
          format: {
            type: "topojson",
            feature: "lakes"
          }
        }
      ],
      scales: [
        {
          name: "color",
          type: "quantize",
          domain: measure ? { data: "metrics", field: measure.lookup } : [0, 0],
          range: { scheme: "lightmulti", count: 5 },
          reverse: false
        }
      ],
      marks: [
        {
          type: "shape",
          from: { data: "municipalities" },
          name: "municipality",
          encode: {
            enter: {
              tooltip: {
                signal: measure
                  ? ` datum.observed.label ? { title: datum.observed.label,'${measure.lookup}': format(datum.observed['${measure.lookup}'], ".2f")} : ""`
                  : ""
              },
              strokeWidth: { value: 0.5 },
              stroke: { value: "#CCCCCC" },
              fill: { value: "#CCCCCC" }
            },
            update: {
              fill: measure
                ? {
                    signal: `highlight.iri === datum.observed.iri ? "#888888": isValid(datum.observed['${measure.lookup}']) ? scale('color', datum.observed['${measure.lookup}']) : '#EFEFEF'`
                  }
                : { value: "#EFEFEF" }
            },
            hover: {
              fill: {
                signal: `highlight.iri === datum.observed.iri ? '#888888' : '#CCCCCC'`
              }
            }
          },
          transform: [{ type: "geoshape", projection: "projection" }]
        },
        {
          type: "shape",
          interactive: false,
          from: { data: "cantons" },
          name: "canton",
          encode: {
            enter: {
              strokeWidth: { value: 1 },
              stroke: { value: "#757575" }
            }
          },
          transform: [{ type: "geoshape", projection: "projection" }]
        },
        {
          type: "shape",
          interactive: false,
          from: { data: "lakes" },
          encode: {
            enter: {
              fill: { value: "#62A8E5" }
            }
          },
          transform: [{ type: "geoshape", projection: "projection" }]
        }
      ],
      legends: [
        {
          fill: "color",
          orient: "top-left",
          title: measure ? measure.label : ""
        }
      ]
    };
  }, [geoYear, height, measure, width]);
  //#endregion

  return (
    <AppLayout>
      <Box
        bg="muted"
        sx={{
          display: "grid",
          gridTemplateColumns: "minmax(12rem, 20rem) minmax(22rem, 1fr)",
          gridTemplateRows: "minmax(0, 1fr)",
          gridTemplateAreas: `
        "left right"
        `,
          width: "100%",
          position: "fixed",
          // FIXME replace 96px with actual header size
          top: "96px",
          height: "calc(100vh - 96px)"
        }}
      >
        <Box
          as="section"
          data-name="panel-left"
          variant="container.left"
          sx={{ height: "100%", display: "block" }}
        >
          {rd.state === "loaded" && memoizedData ? (
            <Flex
              flexDirection="column"
              padding={2}
              justifyContent="space-between"
              height="100%"
            >
              <div>
                <h1>{memoizedData.dataSet.labels[0].value} </h1>
                {memoizedData.dimensions
                  .filter(
                    d =>
                      /**
                       * Filter out Providers, because there is no data yet
                       * */
                      d.component.iri.value !==
                      "http://elcom.zazuko.com/attribute/provider"
                  )
                  .map((d, index) => {
                    const isCategoryDimension =
                      d.component.iri.value ===
                      "http://elcom.zazuko.com/attribute/category";
                    const isYearDimension =
                      d.component.iri.value ===
                      "http://elcom.zazuko.com/attribute/year";
                    const isMunicipalityDimension =
                      d.component.iri.value ===
                      "http://elcom.zazuko.com/attribute/municipality";

                    const val = isCategoryDimension
                      ? category
                      : isYearDimension
                      ? year
                      : isMunicipalityDimension
                      ? municipality && municipality.id
                        ? municipality.id
                        : ""
                      : "";

                    console.log(municipality, val);

                    const label = d.component.label.value;
                    return (
                      <div key={label + index}>
                        <Select
                          label={label}
                          value={val}
                          onChange={e => {
                            if (isYearDimension) {
                              updateYear(e);
                            } else if (isCategoryDimension) {
                              updateCategory(e);
                            } else if (isMunicipalityDimension) {
                              const match = municipalities.get(
                                e.currentTarget.value
                              );

                              match &&
                                updateMunicipality({
                                  id: match.iri,
                                  observed: match
                                });
                            }
                          }}
                          options={[
                            {
                              label: d.component.label.value || "...",
                              value: "",
                              disabled: true
                            }
                          ].concat(
                            d.values
                              .sort((a, b) => {
                                if (!isMunicipalityDimension) {
                                  return 0;
                                }
                                if (a.label.value < b.label.value) {
                                  return -1;
                                }
                                if (a.label.value > b.label.value) {
                                  return 1;
                                }
                                return 0;
                              })
                              .map(v => ({
                                label: v.label.value || v.value.value,
                                value: v.value.value || v.label.value,
                                disabled: isYearDimension
                                  ? !availableGeoYears.includes(
                                      (
                                        +v.value.value - 1
                                      ).toString() /** Verify there is a map for the previous year */
                                    )
                                  : isMunicipalityDimension
                                  ? !municipalities.has(
                                      v.value.value || v.label.value
                                    )
                                  : false
                              }))
                          )}
                        />
                      </div>
                    );
                  })}

                <Select
                  value={measure && measure.iri}
                  onChange={e => {
                    const match = memoizedData.measures.find(
                      d => d.component.iri.value === e.currentTarget.value
                    );
                    updateMeasure(match);
                  }}
                  options={memoizedData.measures.map(d => ({
                    label: d.component.label.value,
                    value: d.component.iri.value
                  }))}
                />
                <div>
                  <Checkbox
                    checked={tableVisibility}
                    label="Data table"
                    // name="Zürich"
                    onChange={updateTableVisibility}
                    //value="Zürich"
                  />
                </div>
              </div>

              <Flex>
                {!!municipality && (
                  <Box width="100%">
                    <Box variant="heading3" as="h3" mb={2}>
                      {municipality.observed.label}
                      {municipality.observed.count > 1 && "*"}
                    </Box>
                    {memoizedData &&
                      memoizedData.measures
                        .sort(a =>
                          a.component.iri.value.includes("total") ? 0 : -1
                        )
                        .map(({ component }) => {
                          const key =
                            getKeyByNestedValue(
                              FIELDS,
                              "componentIri",
                              component.iri.value
                            ) || "";

                          const { observed } = municipality;

                          // const val = key in observed ? observed[key] : "–";
                          const val =
                            key in observed
                              ? ((observed as unknown) as Record<
                                  string,
                                  string
                                >)[key]
                              : "–";

                          const isTotal = component.iri.value.includes("total");

                          const fontWeight =
                            isTotal || (measure && measure.lookup === key)
                              ? "bold"
                              : "lighter";

                          return (
                            <Flex
                              key={component.iri.value}
                              justifyContent="space-between"
                              my={2}
                              color={
                                isTotal || (measure && measure.lookup === key)
                                  ? "#333"
                                  : "#888"
                              }
                              pt={isTotal ? 2 : 0}
                              sx={{
                                borderTop: isTotal ? "1px solid #ccc" : "none"
                              }}
                            >
                              <Text variant="" fontWeight={fontWeight}>
                                {component.label.value}
                              </Text>
                              <Text textAlign="right" fontWeight={fontWeight}>
                                {typeof val === "number"
                                  ? formatNumber(val)
                                  : val}
                              </Text>
                            </Flex>
                          );
                        })}{" "}
                    {municipality.observed.count > 1 && (
                      <small>
                        (* aggregation of {municipality.observed.count} vendors)
                      </small>
                    )}
                  </Box>
                )}
              </Flex>
            </Flex>
          ) : (
            <Loading />
          )}
        </Box>

        <div
          ref={resizeRef}
          style={{ width: "100%", height: "100%", position: "relative" }}
        >
          <Center>
            {width && (
              <React.Fragment>
                {rd.state === "loaded" && memoizedData ? (
                  <MapComponent
                    year={year}
                    setMunicipality={updateMunicipality}
                    setMunicipalities={updateMunicipalities}
                    highlightedMunicipality={municipality && municipality.id}
                    dataset={memoizedData}
                    spec={spec}
                    category={category}
                    showTable={tableVisibility}
                    height={height}
                  />
                ) : (
                  <MapStatic spec={spec} showTable={tableVisibility} />
                )}
              </React.Fragment>
            )}
          </Center>
        </div>
      </Box>

      <div style={{}}></div>
      <hr />
    </AppLayout>
  );
};

const MapComponent = ({
  year,
  spec,
  highlightedMunicipality,
  setMunicipality,
  setMunicipalities,
  category,
  dataset,
  showTable,
  height
}: {
  year: string;
  category: string;
  spec: Spec;
  highlightedMunicipality: string | undefined;
  setMunicipality: (m: Municipality) => void;
  setMunicipalities: (m: Map<string, MunicipalityDatum>) => void;
  dataset: DataSetMetadata;
  showTable: boolean;
  height: number;
}) => {
  const filters = React.useMemo(() => {
    return {
      "http://elcom.zazuko.com/attribute/year": {
        type: "single" as const,
        value: year
      },
      "http://elcom.zazuko.com/attribute/category": {
        type: "single" as const,
        value: category // "http://elcom.zazuko.com/category/H4"
      }
    };
  }, [category, year]);

  const observations = useRawObservations({
    dataSet: dataset.dataSet,
    measures: dataset.measures,
    dimensions: dataset.dimensions,
    fields: FIELDS,
    filters: filters
  });

  const observationReady = observations.state === "loaded";
  const obsData = observations.data;

  const onViewCreated = React.useCallback(
    (view: View) => {
      view.addEventListener("click", function(event, item) {
        if (!item) return;
        const { name } = (item.mark as unknown) as { name: string };
        console.table(item.datum.observed);
        switch (name) {
          case "municipality":
            view.signal("highlight", { iri: item.datum.iri });
            setMunicipality(Object.assign(item.datum, { id: item.datum.iri }));
        }
      });

      highlightedMunicipality &&
        view.signal("highlight", {
          iri: highlightedMunicipality
        });

      if (observationReady && obsData) {
        const formatted = obsData.map(d => ({
          iri: d.municipality.value.value,
          label: d.municipality.label && d.municipality.label.value,
          total: d.total.value.value,
          kev: d.kev.value.value,
          gridusage: d.gridusage.value.value,
          energy: d.energy.value.value,
          fee: d.fee.value.value
        }));

        view
          .data("metrics", formatted)
          .runAsync()
          .then(v => {
            /**
             * As the aggragation happens internally in vega, the state is populated from here.
             * This ensures the dropdown knows what values are defined in the dataset and has
             * enough information for the detail view without having to use a portal etc.
             */
            const aggregatedMunicipalities: MunicipalityDatum[] = v.data(
              "metrics"
            );
            console.info(
              `Vega data insert complete. Added ${aggregatedMunicipalities.length} entries. (Aggregated from ${formatted.length})`
            );
            const nextValues = new Map(
              aggregatedMunicipalities.map(d => [d.iri, d])
            );
            setMunicipalities(nextValues);
          });
      }
    },
    [
      highlightedMunicipality,
      observationReady,
      obsData,
      setMunicipality,
      setMunicipalities
    ]
  );
  const [ref] = useVegaView({
    spec,
    renderer: "canvas",
    onViewCreated
  });

  return (
    <React.Fragment>
      <div
        style={{
          opacity: showTable ? 0 : observationReady ? 1 : 0.5,
          display: showTable ? "none" : "initial",
          transition: ".4s opacity",
          overflow: "hidden"
        }}
        ref={ref}
      />
      {showTable && obsData && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            background: "white",
            maxHeight: "100vh",
            width: "100%",
            maxWidth: "100%",
            overflow: "scroll"
          }}
        >
          <DataTableRaw
            dimensions={dataset.dimensions}
            measures={dataset.measures}
            chunkAmount={
              height / 55 /** @FIXME rough approximation of how many rows fit */
            }
            filterKey="municipality"
            rawObservations={obsData.sort((a, b) => {
              const aLabel = a.municipality.label
                ? a.municipality.label.value
                : "";
              const bLabel = b.municipality.label
                ? b.municipality.label.value
                : "";

              if (aLabel < bLabel) {
                return -1;
              }
              if (aLabel > bLabel) {
                return 1;
              }
              return 0;
            })}
            lookUp={Object.assign(FIELDS, {
              stromnetzbetreiber: {
                componentIri: "http://elcom.zazuko.com/attribute/provider"
              },
              kategorie: {
                componentIri: "http://elcom.zazuko.com/attribute/category"
              },
              referenceYear: {
                componentIri: "http://elcom.zazuko.com/attribute/year"
              }
            })}
          />
        </div>
      )}
    </React.Fragment>
  );
};

const MapStatic = ({ spec, showTable }: { spec: Spec; showTable: boolean }) => {
  const [ref] = useVegaView({
    spec,
    renderer: "canvas"
  });
  return (
    <div
      style={{ opacity: showTable ? 0 : 0.5, overflow: "hidden" }}
      ref={ref}
    />
  );
};

export default () => (
  <DataCubeProvider>
    <Page />
  </DataCubeProvider>
);
