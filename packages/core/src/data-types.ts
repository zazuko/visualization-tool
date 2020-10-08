import type { Literal, NamedNode } from "rdf-js";

export type Dimension = { iri: string };

export type RawObservationValue = {
  value: Literal | NamedNode;
  label?: Literal;
};

export type RawObservation = Record<string, RawObservationValue>;

export type ObservationValue = string | number | boolean | Date;

export type Observation = Record<string, ObservationValue>;
