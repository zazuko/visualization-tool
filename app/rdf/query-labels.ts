import { schema } from "@tpluscode/rdf-ns-builders";
import { sparql } from "@tpluscode/rdf-string";
import { TemplateResult } from "@tpluscode/rdf-string/lib/TemplateResult";
import { SELECT } from "@tpluscode/sparql-builder";
import { Literal, NamedNode } from "rdf-js";
import ParsingClient from "sparql-http-client/ParsingClient";

import batchLoad from "./batch-load";
import { getQueryLocales } from "./parse";
import { sparqlClient } from "./sparql-client";

interface ResourceLabel {
  iri: NamedNode;
  label?: Literal;
}

export const makeLocalesFilter = (
  subjectVar: string,
  predicate: NamedNode,
  objectVar: string,
  wantedLocale: string
) => {
  const locales = getQueryLocales(wantedLocale);

  const localesFilters = locales.map((locale) =>
    locale !== ""
      ? sparql`OPTIONAL {
    ${subjectVar} ${predicate} ${objectVar}_${locale}
    FILTER (LANGMATCHES(LANG(${objectVar}_${locale}), "${locale}"))
  }`
      : sparql`OPTIONAL {
    ${subjectVar} ${predicate} ${objectVar}_${locale}
    FILTER ((LANG(${objectVar}_${locale}) = ""))
  }`
  );

  return sparql`${localesFilters}
  BIND(COALESCE(${locales
    .map((locale) => `${objectVar}_${locale}`)
    .join(",")}) as ${objectVar})
  `;
};

const buildResourceLabelsQuery = (
  values: NamedNode[],
  localesFilter: TemplateResult<$Unexpressable>
) => {
  return SELECT.DISTINCT`?iri ?label`.WHERE`
      values ?iri {
        ${values}
      }
      ${localesFilter}
    `;
};

/**
 * Load labels for a list of IDs (e.g. dimension values)
 */
export async function loadResourceLabels({
  ids,
  locale,
  labelTerm = schema.name,
  client = sparqlClient,
}: {
  ids: NamedNode[];
  locale: string;
  labelTerm?: NamedNode;
  client?: ParsingClient;
}): Promise<ResourceLabel[]> {
  const localesFilter = makeLocalesFilter("?iri", labelTerm, "?label", locale);
  return batchLoad({
    ids,
    client,
    buildQuery: (values: NamedNode[]) =>
      buildResourceLabelsQuery(values, localesFilter),
  });
}
