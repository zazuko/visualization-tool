import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { ChartEditor } from "../../components/editor/chart-editor";
import { AppLayout } from "../../components/layout";
import { ConfiguratorStatePublishing } from "../../domain";
import { ConfiguratorStateProvider } from "../../domain/configurator-state";
import { useLocale } from "../../lib/use-locale";

const useChartId = () => {
  const { asPath } = useRouter();
  const hashIndex = asPath.indexOf("#");
  // const [_, chartId]= asPath.split("#");

  return  hashIndex > -1 && hashIndex < asPath.length -1 ? asPath.slice(hashIndex + 1) : undefined

  // const chartId = query.chartId as string; // Safe type cast because in the context of this page, chartId is always a string

};

type ReturnVal = {
  key: string;
};
const save = async (state: ConfiguratorStatePublishing): Promise<ReturnVal> => {
  return fetch("/api/config", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      dataSet: state.dataSet,
      meta: state.meta,
      chartConfig: state.chartConfig
    })
  }).then(res => res.json());
};

const ChartConfiguratorPage: NextPage = () => {
  const chartId = useChartId();
  const locale = useLocale();
  const { push, replace, query } = useRouter();

  console.log(chartId)

  const handlePublish = useCallback(
    async (state: ConfiguratorStatePublishing) => {
      const result = await save(state);
      await push(
        {
          pathname: `/[locale]/v/[chartId]`,
          query: { publishSuccess: true }
        },
        `/${locale}/v/${result.key}`
      );
    },
    [push, locale]
  );

  const handleReplaceNew = useCallback(() => {
    replace(`/[locale]/create`, `/${locale}/create`);
  }, [replace, locale]);

  const handlePushChartId = useCallback(
    newChartId => {
      push(`/[locale]/create`, `/${locale}/create#${newChartId}`);
    },
    [push, locale]
  );

  return (
    <>
      <Head>
        {/* Disables resoponsive scaling for this page (other pages still work) */}
        <meta name="viewport" content="width=1280"></meta>
      </Head>
      <AppLayout>
        <ConfiguratorStateProvider
          chartId={chartId}
          handlePublish={handlePublish}
          handleReplaceNew={handleReplaceNew}
          handlePushChartId={handlePushChartId}
        >
          <ChartEditor />
        </ConfiguratorStateProvider>
      </AppLayout>
    </>
  );
};

export default ChartConfiguratorPage;
