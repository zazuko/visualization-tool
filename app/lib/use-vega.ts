import { useEffect, useRef } from "react";
import { formatLocale, parse, Spec, timeFormatLocale, View, Warn } from "vega";
import { d3FormatLocales, d3TimeFormatLocales } from "../locales/locales";
import { useLocale } from "./use-locale";
import * as vegaTooltip from "vega-tooltip";

/**
 * Creates a Vega view with the correct locale.
 */
export const useVegaView = ({
  spec,
  renderer = "svg",
  onViewCreated
}: {
  /**
   * Optional callback returning the view, this allows handling external events.
   */
  onViewCreated?: (x: View) => void;
  spec: Spec;
  renderer?: "svg" | "canvas";
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  useEffect(() => {
    // Unfortunately there's no other way than to globally mutate Vega's locales
    formatLocale(d3FormatLocales[locale]);
    timeFormatLocale(d3TimeFormatLocales[locale]);

    const createView = async () => {
      try {
        const handler = new vegaTooltip.Handler();
        const view = new View(parse(spec), {
          logLevel: Warn,
          renderer: renderer,
          container: ref.current,
          hover: true
        });

        onViewCreated && onViewCreated(view);

        await view.tooltip(handler.call).runAsync();

        // console.table("vegadata", view.data("table"));
      } catch (error) {
        console.log(error);
      }
    };
    createView();
    // return clean-up function
  }, [spec, locale, renderer, onViewCreated]);

  return [ref] as const;
};
