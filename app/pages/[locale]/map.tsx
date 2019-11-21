import React from "react";
import { AppLayout, Center } from "../../components/layout";

import { useVegaView } from "../../lib/use-vega";
import { Spec, View } from "vega";
import {
  useDataSetAndMetadata,
  DataCubeProvider,
  DataSetMetadata,
  useRawObservations
} from "../../domain";
import { Loading } from "../../components/hint";
import { Select } from "../../components/form";

const shapesCtx = require.context(
  "../../public/static/shapes/out",
  true,
  /\d{4}\/.*\.json$/
);

const DEFAULT_CATEGORY = "http://elcom.zazuko.com/category/H4";

const shapes = new Map<string, TopoJSON.Topology>();

shapesCtx.keys().forEach(k => {
  shapes.set(k, shapesCtx(k));
});

interface Municipality {
  id: number;
  observed: {
    label?: string;
    total: string;
    kev: string;
    gridusage: string;
    energy: string;
    fee: string;
    total2: {
      label: string;
      value: string;
    };
  };
}

const Page = () => {
  const availableYears = ["2014", "2015", "2016", "2017", "2018", "2019"];
  // Array.from(shapes.keys())
  //   .map(d => d.match(/\d+/g))
  //   .flat()
  //   .filter((x, i, a) => a.indexOf(x) === i);

  const [year, setYear] = React.useState<string>(
    availableYears[availableYears.length - 1] || "2019"
  );
  const [category, setCategory] = React.useState<string>(DEFAULT_CATEGORY);

  const [municipality, setMunicipality] = React.useState<
    undefined | Municipality
  >(undefined);

  const rd = useDataSetAndMetadata(
    "http://elcom.zazuko.com/dataset/municipality/electricityTariffs"
  );

  const updateYear = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setYear(e.currentTarget.value);
  };
  const updateCategory = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    console.log(e.currentTarget.value);
    setCategory(e.currentTarget.value);
  };

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
          values: []
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
              default: { total: undefined, label: "" }
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
          domain: [0, 70],
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
              fill: {
                signal:
                  "isValid(datum.observed.total) ? scale('color', datum.observed.total) : '#EFEFEF'"
              }
            },
            hover: {
              fill: { value: "#fff" }
            }
            // tooltip: {
            //   signal: "datum"
            // }
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
          title: "Total exkl. MWST"
        }
      ]
    };
  }, [year]);

  return (
    <AppLayout>
      <Center>
        <div style={{}}>
          <div
            style={{
              position: "absolute",
              top: 100,
              width: 400,
              padding: 10,
              background: "#f5f5f5"
            }}
          >
            {rd.state === "loaded" ? (
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
                  .map(d => {
                    const isCategoryDimension =
                      d.component.iri.value ===
                      "http://elcom.zazuko.com/attribute/category";
                    const isYearDimension =
                      d.component.iri.value ===
                      "http://elcom.zazuko.com/attribute/year";
                    const title = d.component.labels[0].value;
                    return (
                      <div key={title}>
                        <b>{title}</b>
                        <br />

                        <Select
                          value={
                            availableYears
                              ? year
                              : isCategoryDimension
                              ? category
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
                              ? !availableYears.includes(
                                  v.value.value || v.label.value //@FIXME check whats what for years
                                )
                              : false
                          }))}
                        />
                      </div>
                    );
                  })}
                <br />
                Measures:
                {rd.data.measures.map(d => (
                  <div key={d.component.labels[0].value}>
                    {d.component.labels[0].value}
                  </div>
                ))}
                <hr />
                {category}
                {municipality && (
                  <div>
                    <h3>
                      {municipality.observed.label} (Nr.{municipality.id})
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
                  </div>
                )}
              </div>
            ) : (
              <Loading />
            )}
          </div>
        </div>
        <hr />
        {rd.state === "loaded" ? (
          <MapComponent
            year={year}
            setMunicipality={setMunicipality}
            dataset={rd.data}
            spec={spec}
            category={category}
          />
        ) : (
          <MapStatic spec={spec} />
        )}
      </Center>
    </AppLayout>
  );
};

const FIELDS = {
  municipality: "http://elcom.zazuko.com/attribute/municipality",
  total: "http://elcom.zazuko.com/attribute/total",
  kev: "http://elcom.zazuko.com/attribute/kev",
  gridusage: "http://elcom.zazuko.com/attribute/gridusage",
  energy: "http://elcom.zazuko.com/attribute/energy",
  fee: "http://elcom.zazuko.com/attribute/fee"
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
  setMunicipality: React.Dispatch<
    React.SetStateAction<undefined | Municipality>
  >;
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
  observationReady && console.log(obsData);
  const onViewCreated = React.useCallback(
    (view: View) => {
      view.addEventListener("click", function(event, item) {
        if (!item) return;
        const { name } = (item.mark as unknown) as { name: string };
        console.table(item.datum.observed);
        switch (name) {
          case "municipality":
            setMunicipality(item.datum);
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

        console.log("formatted.length", formatted.length);
        // const changeSet = changeset()
        //   .remove(truthy)
        //   .insert(formatted);
        // view.change("metrics", changeSet).runAsync();
        view.data("metrics", formatted).runAsync();
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
      style={{ opacity: observationReady ? 1 : 0.5, transition: ".4s opacity" }}
      ref={ref}
    />
  );
};

const MapStatic = ({ spec }: { spec: Spec }) => {
  const [ref] = useVegaView({
    spec,
    renderer: "canvas"
  });
  return <div style={{ opacity: 0.5 }} ref={ref} />;
};

export default () => (
  <DataCubeProvider>
    <Page />
  </DataCubeProvider>
);
