import React from "react";
import { AppLayout, Center } from "../../components/layout";

import { useVegaView } from "../../lib/use-vega";
import { Spec, View, changeset } from "vega";
import {
  useDataSetAndMetadata,
  DataCubeProvider,
  DataSetMetadata,
  useRawObservations
} from "../../domain";
import { Loading } from "../../components/hint";

const shapesCtx = require.context(
  "../../public/static/shapes/out",
  true,
  /\d{4}\/.*\.json$/
);

const shapes = new Map<string, TopoJSON.Topology>();

shapesCtx.keys().forEach(k => {
  shapes.set(k, shapesCtx(k));
});

const Page = () => {
  const [year, setYear] = React.useState(2017);
  const [municipality, setMunicipality] = React.useState<undefined | number>(
    undefined
  );

  const rd = useDataSetAndMetadata(
    "http://elcom.zazuko.com/dataset/municipality/electricityTariffs"
  );

  console.log("rd", rd);

  const updateYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(+e.currentTarget.value);
  };

  const spec: Spec = React.useMemo(() => {
    const lakes = shapes.get(`./${year}/ch-lakes.json`);
    const cantons = shapes.get(`./${year}/ch-cantons.json`);
    const municipalities = shapes.get(`./${year}/ch-municipalities.json`);
    console.log(municipalities);

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
              default: { total: 0 }
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
              stroke: { value: "#CCCCCC" }
            },
            update: {
              fill: { scale: "color", field: "observed.total" }
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
          title: "Total exkl. MWST"
        }
      ]
    };
  }, [year]);

  return (
    <AppLayout>
      <Center>
        <div style={{}}>
          {year}
          <input
            type="range"
            min={2017}
            max={2019}
            value={year}
            onChange={updateYear}
          />
          <div
            style={{
              position: "absolute",
              top: 100,
              width: 400,
              background: "red"
            }}
          >
            {rd.state === "loaded" ? (
              <div>
                <h1>
                  {rd.data.dataSet.labels[0].value} {municipality}
                </h1>
                {rd.data.dimensions.map(d => {
                  const title = d.component.labels[0].value;
                  return (
                    <div key={title}>
                      <b>{title}</b>
                      <br />
                      <select style={{ width: "100%" }}>
                        {d.values.map(v => {
                          const label = v.label.value;
                          const value = v.value.value;
                          return (
                            <option key={label + value} value={value}>
                              {label || value}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  );
                })}
                {rd.data.measures.length}
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
          />
        ) : (
          <MapStatic spec={spec} />
        )}
      </Center>
    </AppLayout>
  );
};
/**usememo / deps */
const FIELDS = {
  municipality: "http://elcom.zazuko.com/attribute/municipality",
  total: "http://elcom.zazuko.com/attribute/total"
};

const FILTERS = {
  "http://elcom.zazuko.com/attribute/year": {
    type: "single" as const,
    value: "2017"
  },
  "http://elcom.zazuko.com/attribute/category": {
    type: "single" as const,
    value: "http://elcom.zazuko.com/category/H1"
  }
};

const MapComponent = ({
  year,
  spec,
  setMunicipality,
  dataset
}: {
  year: number;
  spec: Spec;
  setMunicipality: React.Dispatch<React.SetStateAction<number | undefined>>;
  dataset: DataSetMetadata;
}) => {
  const observations = useRawObservations({
    dataSet: dataset.dataSet,
    measures: dataset.measures,
    dimensions: dataset.dimensions,
    fields: FIELDS,
    filters: FILTERS
  });

  const observationReady = observations.state === "loaded";

  observationReady && console.log("observations", observations);

  const onViewCreated = React.useCallback(
    (view: View) => {
      view.addEventListener("click", function(event, item) {
        if (!item) return;
        const { name } = (item.mark as unknown) as { name: string };
        console.log(item);
        switch (name) {
          case "municipality":
            setMunicipality(item.datum.id);
        }
      });
      if (observationReady && observations.data) {
        const formatted = observations.data.map(d => ({
          iri: d.municipality.value.value,
          total: d.total.value.value
        }));
        const changeSet = changeset().insert(formatted);
        view.change("metrics", changeSet).run();
      }
      console.log("view", view.getState());
    },
    [observationReady, observations.data, setMunicipality]
  );
  const [ref] = useVegaView({
    spec,
    renderer: "canvas",
    onViewCreated
  });
  return <div style={{ opacity: observationReady ? 1 : 0.5 }} ref={ref} />;
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
