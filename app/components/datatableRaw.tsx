import { Dimension, Measure } from "@zazuko/query-rdf-data-cube";
import { format } from "d3-format";
import * as React from "react";
import { Box, Button, Flex } from "rebass";
import {
  DimensionWithMeta,
  MeasureWithMeta,
  RawObservationValue
} from "../domain";
import { Loading } from "./hint";
import { useMemo } from "react";
import { chunksOf } from "fp-ts/lib/Array";
import { Input } from "./form";

interface Header {
  headerIndex: string;
  header: string;
  componentType: string;
  lookup: string;
}

const formatNumber = format(",.2~f");

export const Table = ({
  headers,
  chunkAmount,
  rawObservations,
  filterKey
}: {
  filterKey: string;
  chunkAmount: number;
  headers: Header[];
  rawObservations: Record<string, RawObservationValue>[];
}) => {
  const [chunkIndex, setChunkIndex] = React.useState(0);
  const [filterString, setFilterString] = React.useState("");

  const filtered = React.useMemo(
    () =>
      rawObservations.filter(d => {
        const hasKey = filterKey in d;
        if (!filterString || !hasKey) return true;
        const label = d[filterKey].label;
        return label
          ? label.value.toLowerCase().includes(filterString.toLowerCase())
          : false;
      }),
    [filterKey, filterString, rawObservations]
  );
  const chunks = chunksOf(chunkAmount)(filtered);
  const pageAmount = chunks.length - 1;

  const paginate = {
    prev: () => setChunkIndex(chunkIndex - 1),
    next: () => setChunkIndex(chunkIndex + 1)
  };

  return (
    <Box
      as="table"
      sx={{
        minWidth: "100%",
        borderCollapse: "collapse"
      }}
    >
      <thead>
        <Box as="tr" variant="datatable.headerRow">
          <td colSpan={headers.length}>
            <Flex justifyContent="space-between" alignItems="center" p={2}>
              <Flex flex={1} alignItems="center">
                <Button onClick={paginate.prev} disabled={chunkIndex <= 0}>
                  Prev
                </Button>
                <Box p={2}>
                  {chunkIndex} / {pageAmount}
                </Box>
                <Button
                  onClick={paginate.next}
                  disabled={chunkIndex >= pageAmount}
                >
                  Next
                </Button>
              </Flex>
              <Input
                type="search"
                onChange={e => {
                  setChunkIndex(0);
                  setFilterString(e.currentTarget.value);
                }}
              />
            </Flex>
          </td>
        </Box>
      </thead>
      <tbody>
        <Box as="tr" variant="datatable.headerRow">
          {headers.map(({ header, componentType }) => {
            return (
              <Box
                as="th"
                variant="datatable.headerCell"
                role="columnheader"
                scope="col"
                key={header}
                sx={{
                  textAlign: componentType === "measure" ? "right" : "left"
                }}
              >
                {header}
              </Box>
            );
          })}
        </Box>
        {(chunks[chunkIndex] || []).map((obs, i) => {
          return (
            <Box as="tr" variant="datatable.row" key={i}>
              {headers.map(({ headerIndex, componentType, lookup }) => {
                const val = obs[lookup];

                const { label, value } = val
                  ? val
                  : {
                      label: { value: null },
                      value: { value: null }
                    };

                return (
                  <Box
                    key={headerIndex}
                    as="td"
                    variant="datatable.cell"
                    sx={{
                      textAlign: componentType === "measure" ? "right" : "left"
                    }}
                  >
                    {componentType === "measure"
                      ? value.value !== null && typeof +value.value === "number"
                        ? formatNumber(+value.value)
                        : value.value
                      : label
                      ? label.value
                      : (value.value || "").replace("http://", "")}
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </tbody>
    </Box>
  );
};

export const DataTableRaw = ({
  dimensions,
  measures,
  rawObservations,
  lookUp,
  chunkAmount = 15,
  filterKey
}: {
  filterKey: string;
  dimensions: DimensionWithMeta[];
  measures: MeasureWithMeta[];
  rawObservations: Record<string, RawObservationValue>[];
  lookUp: Record<string, { componentIri: string }>;
  chunkAmount?: number;
}) => {
  const selection: [string, Dimension | Measure][] = useMemo(
    () =>
      [...dimensions, ...measures].map((comp, i) => [`${i}`, comp.component]),
    [dimensions, measures]
  );

  const headers: Header[] = Object.entries(selection).map(([key, value]) => ({
    headerIndex: key,
    header: value[1].label.value,
    componentType: value[1].componentType,
    lookup:
      Object.keys(lookUp).find(
        k => lookUp[k].componentIri === value[1].iri.value
      ) || ""
  }));

  if (rawObservations) {
    return (
      <Table
        headers={headers}
        chunkAmount={chunkAmount}
        rawObservations={rawObservations}
        filterKey={filterKey}
      />
    );
  } else {
    return <Loading />;
  }
};
