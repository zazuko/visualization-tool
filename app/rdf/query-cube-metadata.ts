import RDF from "@rdfjs/data-model";
import { SELECT, sparql } from "@tpluscode/sparql-builder";
import { keyBy } from "lodash";

import { schema, dcat, dcterms, cube } from "../../app/rdf/namespace";
import { DataCubeOrganization, DataCubeTheme } from "../graphql/query-hooks";

import { makeLocalesFilter } from "./query-labels";
import { sparqlClient } from "./sparql-client";

type RawDataCubeTheme = Omit<DataCubeTheme, "__typename">;
type RawDataCubeOrganization = Omit<DataCubeOrganization, "__typename">;

const parseSparqlTheme = (sparqlTheme: any) => {
  return {
    label: sparqlTheme.name.value,
    iri: sparqlTheme.theme.value,
  } as RawDataCubeTheme;
};

const parseSparqlOrganization = (sparqlOrg: any) => {
  return {
    label: sparqlOrg.name.value,
    iri: sparqlOrg.theme.value,
  } as RawDataCubeOrganization;
};

// Handles both batch loading and loading all themes
// Batch loading is done by load all themes and then filtering according to given IRIs
export const createThemeLoader =
  ({ locale }: { locale: string }) =>
  async (
    filterIris?: readonly string[]
  ): Promise<(RawDataCubeTheme | null)[]> => {
    const query = SELECT.ALL.WHERE`
    graph   <https://lindas.admin.ch/sfa/opendataswiss> {
      ?theme a ${schema.DefinedTerm} ;
        ${
          schema.inDefinedTermSet
        } <https://register.ld.admin.ch/opendataswiss/category>; 
        ${makeLocalesFilter("?theme", schema.name, "?name", locale)}
    }`;
    const results = await query.execute(sparqlClient.query, {
      operation: "postUrlencoded",
    });

    if (filterIris) {
      const resultsByIri = keyBy(results, (x) => x.theme.value);
      return filterIris.map((iri) => {
        const theme = resultsByIri[iri];
        return theme ? parseSparqlTheme(theme) : null;
      });
    }

    const parsed = results.map(parseSparqlTheme);
    return parsed;
  };

export const createOrganizationLoader =
  ({ locale }: { locale: string }) =>
  async (
    filterIris?: readonly string[]
  ): Promise<(RawDataCubeOrganization | null)[]> => {
    const query = SELECT.ALL.WHERE`
    graph   <https://lindas.admin.ch/sfa/opendataswiss> {
      ?theme a ${schema.Organization} ;
      ${makeLocalesFilter("?theme", schema.name, "?name", locale)}
    }`;
    const results = await query.execute(sparqlClient.query, {
      operation: "postUrlencoded",
    });

    if (filterIris) {
      const resultsByIri = keyBy(results, (x) => x.theme.value);
      return filterIris.map((iri) => {
        const org = resultsByIri[iri];
        return org ? parseSparqlOrganization(org) : null;
      });
    }

    const parsed = results.map(parseSparqlOrganization);
    return parsed;
  };

export const loadThemes = ({ locale }: { locale: string }) => {
  return createThemeLoader({ locale })();
};

export const loadOrganizations = ({ locale }: { locale: string }) => {
  return createOrganizationLoader({ locale })();
};

export const queryDatasetCountByOrganization = async ({
  theme,
  includeDrafts,
}: {
  theme?: string;
  includeDrafts?: boolean;
}) => {
  const query = SELECT`(count(?iri) as ?count) ?creator`.WHERE`
    ?iri ${dcterms.creator} ?creator.
    ${theme ? sparql`?iri ${dcat.theme} <${theme}>.` : ``}
    ${makeVisualizeDatasetFilter({ includeDrafts })}
  `.GROUP().BY`?creator`.build();
  const results = await sparqlClient.query.select(query, {
    operation: "postUrlencoded",
  });
  return results
    .map((r) => {
      return {
        count: parseInt(r.count.value, 10),
        iri: r.creator?.value,
      };
    })
    .filter((r) => r.iri);
};

const makeVisualizeDatasetFilter = (options?: { includeDrafts?: boolean }) => {
  const includeDrafts = options?.includeDrafts || false;
  return sparql`
    ?iri ${schema.workExample} <https://ld.admin.ch/application/visualize>.
    ${
      includeDrafts
        ? ""
        : sparql`?iri ${schema.creativeWorkStatus} <https://ld.admin.ch/vocabulary/CreativeWorkStatus/Published>.`
    }
    FILTER NOT EXISTS {?iri ${schema.expires} ?expiryDate }
    FILTER NOT EXISTS {?iri ${schema.validThrough} ?validThrough }
    `;
};

export const queryDatasetCountByTheme = async ({
  organization,
  includeDrafts,
}: {
  organization?: string;
  includeDrafts?: boolean;
}) => {
  const query = SELECT`(count(?iri) as ?count) ?theme`.WHERE`
    ?iri ${dcat.theme} ?theme.
    ${organization ? sparql`?iri ${dcterms.creator} <${organization}>.` : ``}
    ?theme ${
      schema.inDefinedTermSet
    } <https://register.ld.admin.ch/opendataswiss/category>.
    ${makeVisualizeDatasetFilter({ includeDrafts })}
  `.GROUP().BY`?theme`.build();
  const results = await sparqlClient.query.select(query, {
    operation: "postUrlencoded",
  });
  return results
    .map((r) => {
      return {
        count: parseInt(r.count.value, 10),
        iri: r.theme?.value,
      };
    })
    .filter((r) => r.iri);
};

export const queryDatasetCountBySubTheme = async ({
  organization,
  theme,
  includeDrafts,
}: {
  organization?: string;
  theme?: string;
  includeDrafts?: boolean;
}) => {
  const baseQuery = SELECT`(count(?iri) as ?count) ?subtheme`.WHERE`
    ?iri ${schema.about} ?subtheme.
    ${organization ? sparql`?iri ${dcterms.creator} <${organization}>.` : ``}
    ${theme ? sparql`?iri ${dcat.theme} <${theme}>.` : ``}
    ?iri ${schema.about} ?subtheme. 
    ${makeVisualizeDatasetFilter({ includeDrafts })}
  `.build();
  const query = `${baseQuery} GROUP BY ?subtheme`;
  const results = await sparqlClient.query.select(query, {
    operation: "postUrlencoded",
  });
  return results
    .map((r) => {
      return {
        count: parseInt(r.count.value, 10),
        iri: r.subtheme?.value,
      };
    })
    .filter((r) => r.iri);
};

export const queryLatestPublishedCubeFromUnversionedIri = async (
  unversionedIri: string
) => {
  const iri = RDF.variable("iri");
  // Check if it is a versioned cube
  const query = SELECT`${iri}`.WHERE`
    <${unversionedIri}> ${schema.hasPart} ${iri}.
    ${makeVisualizeDatasetFilter({ includeDrafts: true })}
  `
    .ORDER()
    .BY(iri, true);
  const results = await sparqlClient.query.select(query.build(), {
    operation: "postUrlencoded",
  });
  if (results.length !== 1) {
    // Check if it is an unversioned cube
    const query = SELECT`*`.WHERE`
      <${unversionedIri}> ${cube.observationConstraint} ?shape.
      ${makeVisualizeDatasetFilter({ includeDrafts: true })}
    `;
    const results = await sparqlClient.query.select(query.build(), {
      operation: "postUrlencoded",
    });
    if (results.length === 0) {
      return;
    }
    return {
      iri: unversionedIri,
    };
  }
  return {
    iri: results[0].iri.value,
  };
};

export const loadSubthemes = async ({
  parentIri,
  locale,
}: {
  parentIri: string;
  locale: string;
}) => {
  const query = SELECT`?iri ?label`.WHERE`
    ?iri ${schema.inDefinedTermSet} <${parentIri}>;
    ${makeLocalesFilter("?iri", schema.name, "?label", locale)}
  `.build();
  const results = await sparqlClient.query.select(query, {
    operation: "postUrlencoded",
  });
  return results.map((r) => {
    return {
      iri: r.iri.value,
      label: r.label.value,
    };
  });
};
