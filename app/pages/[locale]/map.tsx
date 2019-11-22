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
import { Select } from "../../components/form";
import { Box, Flex } from "rebass";

const DEFAULT_CATEGORY = "http://elcom.zazuko.com/category/H4";
const DEFAULT_MEASURE = "http://elcom.zazuko.com/attribute/total";
const FIELDS = {
  municipality: "http://elcom.zazuko.com/attribute/municipality",
  total: "http://elcom.zazuko.com/attribute/total",
  kev: "http://elcom.zazuko.com/attribute/kev",
  gridusage: "http://elcom.zazuko.com/attribute/gridusage",
  energy: "http://elcom.zazuko.com/attribute/energy",
  fee: "http://elcom.zazuko.com/attribute/fee"
};

function getKeyByValue(object: Record<string, {}>, value: string) {
  return Object.keys(object).find(key => object[key] === value);
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

interface Municipality {
  pinned: boolean;
  id: number;
  observed: {
    count: number; // Aggregated from n suppliers
    label?: string;
    total: string;
    kev: string;
    gridusage: string;
    energy: string;
    fee: string;
  };
}

interface MeasureDatum {
  iri: string;
  label: string;
  min: number;
  max: number;
  lookup: string;
}

const Page = () => {
  const availableYears = ["2014", "2015", "2016", "2017", "2018", "2019"];
  const rd = useDataSetAndMetadata(
    "http://elcom.zazuko.com/dataset/municipality/electricityTariffs"
  );
  // Array.from(shapes.keys())
  //   .map(d => d.match(/\d+/g))
  //   .flat()
  //   .filter((x, i, a) => a.indexOf(x) === i);

  //#region STATE
  const [year, setYear] = React.useState<string>(
    availableYears[availableYears.length - 1] || "2019"
  );
  const [category, setCategory] = React.useState<string>(DEFAULT_CATEGORY);
  const [measure, setMeasure] = React.useState<MeasureDatum | undefined>(
    undefined
  );
  const [municipality, setMunicipality] = React.useState<
    undefined | Municipality
  >(undefined);

  const updateMunicipality = (m: Municipality, pinned: boolean) => {
    setMunicipality({ ...m, pinned });
  };

  const updateYear = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setYear(e.currentTarget.value);
  };
  const updateCategory = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCategory(e.currentTarget.value);
  };

  const updateMeasure = (m: MeasureWithMeta | undefined) => {
    const lookupKey = m && getKeyByValue(FIELDS, m.component.iri.value);
    if (m && m.max && m.min && lookupKey) {
      setMeasure({
        iri: m.component.iri.value,
        label: m.component.labels[0].value,
        min: +m.min.value,
        max: +m.max.value,
        lookup: lookupKey
      });
    } else {
      console.warn(`Could not apply filter for ${m}`);
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
    const lakes = shapes.get(`./${year}/ch-lakes.json`);
    const cantons = shapes.get(`./${year}/ch-cantons.json`);
    const municipalities = shapes.get(`./${year}/ch-municipalities.json`);

    return {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width: 900,
      height: 600,
      padding: 25,

      autosize: "pad",
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
      signals: [],
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
          domain: measure ? [measure.min, measure.max] : [0, 0],
          range: { scheme: "yelloworangered", count: 5 }
        }
      ],
      marks: [
        {
          type: "shape",
          from: { data: "municipalities" },
          name: "municipality",
          encode: {
            enter: {
              strokeWidth: { value: 0.5 },
              stroke: { value: "#CCCCCC" },
              fill: { value: "#CCCCCC" }
            },
            update: {
              fill: measure
                ? {
                    signal: `isValid(datum.observed['${measure.lookup}']) ? scale('color', datum.observed['${measure.lookup}']) : '#EFEFEF'`
                  }
                : { value: "#EFEFEF" }
            },
            hover: {
              fill: { value: "#fff" }
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
  }, [measure, year]);
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
          {rd.state === "loaded" ? (
            <Flex
              flexDirection="column"
              padding={2}
              justifyContent="space-between"
              height="100%"
            >
              <div>
                <h1>{rd.data.dataSet.labels[0].value} </h1>
                {rd.data.dimensions
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

                    const label = d.component.labels[0].value;
                    return (
                      <div key={label + index}>
                        <Select
                          label={label}
                          value={
                            isCategoryDimension
                              ? category
                              : isYearDimension
                              ? year
                              : undefined
                          }
                          onChange={e => {
                            isYearDimension && updateYear(e);
                            isCategoryDimension && updateCategory(e);
                          }}
                          options={d.values.map(v => ({
                            label: v.label.value || v.value.value,
                            value: v.value.value || v.label.value,
                            disabled: isYearDimension
                              ? !availableYears.includes(v.value.value)
                              : false
                          }))}
                        />
                      </div>
                    );
                  })}

                <Select
                  value={measure && measure.iri}
                  onChange={e => {
                    const match = rd.data.measures.find(
                      d => d.component.iri.value === e.currentTarget.value
                    );
                    updateMeasure(match);
                  }}
                  options={rd.data.measures.map(d => ({
                    label: d.component.labels[0].value,
                    value: d.component.iri.value
                  }))}
                />
              </div>
              <Flex>
                {municipality && (
                  <div>
                    <h3>
                      {municipality.observed.label}
                      {municipality.observed.count > 1 && "*"} (Nr.
                      {municipality.id})
                    </h3>
                    <dl>
                      <dt>total</dt>
                      <dd>{municipality.observed.total}</dd>
                      <dt>kev</dt>
                      <dd>{municipality.observed.kev}</dd>
                      <dt>gridusage</dt>
                      <dd>{municipality.observed.gridusage}</dd>
                      <dt>energy</dt>
                      <dd>{municipality.observed.energy}</dd>
                      <dt>fee</dt>
                      <dd>{municipality.observed.fee}</dd>
                    </dl>
                    {municipality.observed.count > 1 && (
                      <small>
                        (* aggregation of {municipality.observed.count} vendors)
                      </small>
                    )}
                  </div>
                )}
              </Flex>
            </Flex>
          ) : (
            <Loading />
          )}
        </Box>

        <Center>
          {rd.state === "loaded" ? (
            <MapComponent
              year={year}
              setMunicipality={updateMunicipality}
              dataset={rd.data}
              spec={spec}
              category={category}
            />
          ) : (
            <MapStatic spec={spec} />
          )}
        </Center>
      </Box>

      <div style={{}}></div>
      <hr />
    </AppLayout>
  );
};

const MapComponent = ({
  year,
  spec,
  setMunicipality,
  category,
  dataset
}: {
  year: string;
  category: string;
  spec: Spec;
  setMunicipality: (m: Municipality, pinned: boolean) => void;
  dataset: DataSetMetadata;
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
            setMunicipality(item.datum, true);
        }
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
          .then(() => {
            console.info(
              `Vega data insert complete. Added ${formatted.length} entries.`
            );
          });
      }
    },
    [observationReady, obsData, setMunicipality]
  );
  const [ref] = useVegaView({
    spec,
    renderer: "canvas",
    onViewCreated
  });

  return (
    <div
      style={{
        opacity: observationReady ? 1 : 0.5,
        transition: ".4s opacity",
        overflow: "hidden"
      }}
      ref={ref}
    />
  );
};

const MapStatic = ({ spec }: { spec: Spec }) => {
  const [ref] = useVegaView({
    spec,
    renderer: "canvas"
  });
  return <div style={{ opacity: 0.5, overflow: "hidden" }} ref={ref} />;
};

export default () => (
  <DataCubeProvider>
    <Page />
  </DataCubeProvider>
);
