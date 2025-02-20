import { I18nProvider } from "@lingui/react";
// Used for color-picker component. Must include here because of next.js constraints about global CSS imports
import "core-js/features/array/flat-map";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { ContentMDXProvider } from "@/components/content-mdx-provider";
import { PUBLIC_URL } from "@/domain/env";
import { GraphqlProvider } from "@/graphql/context";
import { analyticsPageView } from "@/lib/googleAnalytics";
import "@/lib/nprogress.css";
import { useNProgress } from "@/lib/use-nprogress";
import { i18n, parseLocaleString } from "@/locales/locales";
import { LocaleProvider } from "@/locales/use-locale";
import * as federalTheme from "@/themes/federal";
import Flashes from "@/utils/flashes";
import AsyncLocalizationProvider from "@/utils/l10n-provider";

export default function App({ Component, pageProps }: AppProps) {
  const { events: routerEvents, asPath, locale: routerLocale } = useRouter();

  useNProgress();

  const locale = parseLocaleString(routerLocale ?? "");

  // Immediately activate locale to avoid re-render
  if (i18n.locale !== locale) {
    i18n.activate(locale);
  }

  // Initialize analytics
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      analyticsPageView(url);
    };

    const handleRouteStart = (url: string) => {
      const locale = parseLocaleString(url.slice(1));
      if (i18n.locale !== locale) {
        i18n.activate(locale);
      }
    };

    routerEvents.on("routeChangeStart", handleRouteStart);
    routerEvents.on("routeChangeComplete", handleRouteChange);
    return () => {
      routerEvents.off("routeChangeStart", handleRouteStart);
      routerEvents.off("routeChangeComplete", handleRouteChange);
    };
  }, [routerEvents]);

  return (
    <>
      <Head>
        <title key="title">visualize.admin.ch</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={"visualize.admin.ch"} />
        <meta property="og:url" content={`${PUBLIC_URL}${asPath}`} />
        {federalTheme.preloadFonts?.map((src) => (
          <link
            key={src}
            rel="preload"
            href={src}
            as="font"
            crossOrigin="anonymous"
          />
        ))}
      </Head>

      <LocaleProvider value={locale}>
        <I18nProvider i18n={i18n}>
          <GraphqlProvider>
            <ThemeProvider theme={federalTheme.theme}>
              <CssBaseline />
              <Flashes />
              <ContentMDXProvider>
                <AsyncLocalizationProvider locale={locale}>
                  <Component {...pageProps} />
                </AsyncLocalizationProvider>
              </ContentMDXProvider>
            </ThemeProvider>
          </GraphqlProvider>
        </I18nProvider>
      </LocaleProvider>
    </>
  );
}
