import { GetServerSideProps } from "next";

import { DatasetBrowser } from "@/browser";
import { queryLatestPublishedCubeFromUnversionedIri } from "@/rdf/query-cube-metadata";
import { defaultLocale } from "@/src";
import { getQueryParams } from "@/utils/flashes";
export default DatasetBrowser;
/**
 * Heuristic to check if a dataset IRI is versioned.
 * Versioned iris look like https://blabla/<number/
 */
const isDatasetIriVersioned = (iri: string) => {
  return iri.match(/\/\d+\/?$/) !== null;
};

const getServerSideProps: GetServerSideProps = async function (ctx) {
  const { params } = ctx;
  if (!params) {
    return { props: {} };
  }
  if (
    params?.type === "dataset" &&
    params.iri &&
    !Array.isArray(params.iri) &&
    !isDatasetIriVersioned(params.iri)
  ) {
    const resp = await queryLatestPublishedCubeFromUnversionedIri(params.iri);
    if (!resp) {
      return {
        redirect: {
          permanent: false,
          destination: `/?${getQueryParams("CANNOT_FIND_CUBE", {
            iri: params.iri,
          })}`,
        },
      };
    } else if (params.iri === resp.iri) {
      return { props: {} };
    }
    return {
      redirect: {
        permanent: false,
        destination: `/${
          ctx.locale || defaultLocale
        }/browse/dataset/${encodeURIComponent(resp.iri)}`,
      },
    };
  }
  return {
    props: {},
  };
};

export { getServerSideProps };
