import React from "react";
import { AppLayout, Center } from "../../components/layout";

import { useVegaView } from "../../lib/use-vega";
import { Spec, View } from "vega";
import {
  useDataSetAndMetadata,
  useDataSets,
  DataCubeProvider,
  useObservations,
  DataSetMetadata
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

  const updateYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(+e.currentTarget.value);
  };

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
          <div style={{ position: "absolute", top: 100 }}>
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
                      <select>
                        {d.values.map(v => {
                          const label = v.label.value;
                          const value = v.value.value;
                          return (
                            <option key={label + value}>
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
        {rd.state === "loaded" && (
          <MapComponent
            year={year}
            setMunicipality={setMunicipality}
            dataset={rd.data}
          />
        )}
      </Center>
    </AppLayout>
  );
};

const MapComponent = ({
  year,
  setMunicipality,
  dataset
}: {
  year: number;
  setMunicipality: React.Dispatch<React.SetStateAction<number | undefined>>;
  dataset: DataSetMetadata;
}) => {
  const observations = useObservations({
    ...dataset,
    fields: {
      xField: "string",
      yField: "string",
      groupByField: "string",
      labelField: "string"
    },
    filters: {}
  });

  console.log(observations);

  const spec: Spec = React.useMemo(() => {
    const lakes = shapes.get(`./${year}/ch-lakes.json`);
    const cantons = shapes.get(`./${year}/ch-cantons.json`);
    const municipalities = shapes.get(`./${year}/ch-municipalities.json`);
    return {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width: 900,
      height: 600,
      padding: {
        top: 25,
        left: 25,
        right: 25,
        bottom: 25
      },

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
          }
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
      scales: [],
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
              fill: { value: "#fff" }
            },
            hover: {
              fill: { value: "#F38B3C" }
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
      legends: []
    };
  }, [year]);

  const onViewCreated = React.useCallback(
    (view: View) => {
      view.addEventListener("click", function(event, item) {
        if (!item) return;
        const { name } = (item.mark as unknown) as { name: string };
        switch (name) {
          case "municipality":
            setMunicipality(item.datum.id);
        }
      });
    },
    [setMunicipality]
  );
  const [ref] = useVegaView({
    spec,
    renderer: "canvas",
    onViewCreated
  });
  return <div ref={ref} />;
};

export default () => (
  <DataCubeProvider>
    <Page />
  </DataCubeProvider>
);
