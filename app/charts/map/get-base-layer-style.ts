import merge from "lodash/merge";
import { MapOptions } from "maplibre-gl";
import { MapboxStyle } from "react-map-gl";

import { BASE_VECTOR_TILE_URL, MAPTILER_STYLE_KEY } from "@/domain/env";

import { Locale } from "../../locales/locales";

import greyStyleBase from "./grey.json";
import { hasLayout, replaceStyleTokens, mapLayers } from "./style-helpers";

const tokens = {
  "{key}": MAPTILER_STYLE_KEY,
  "<BASE_VECTOR_TILE>": BASE_VECTOR_TILE_URL,
};

const greyStyle = replaceStyleTokens(greyStyleBase as MapboxStyle, tokens);

export const emptyStyle = {
  version: 8,
  name: "Empty",
  metadata: {
    "mapbox:autocomposite": true,
  },
  sources: {},
  glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "rgba(0,0,0,0)",
      },
    },
  ],
} as MapOptions["style"];

interface Props {
  locale: Locale;
  showLabels: boolean;
}

type AnyLayer = MapboxStyle["layers"][number];

export const getBaseLayerStyle = (props: Props) => {
  const { locale, showLabels } = props;
  const languageTag = `name:${locale === "en" ? "latin" : locale}`;
  const textOpacity = showLabels ? 1 : 0;
  const textLayersVisibility = showLabels ? "visible" : "none";

  const greyStyleTextAdjusted = mapLayers(greyStyle, (layer) => {
    if (!hasLayout(layer)) {
      return;
    }

    // @ts-ignore
    if (layer.layout["text-field"]) {
      return merge(layer, {
        paint: {
          "text-opacity": textOpacity,
        },
        layout: {
          "text-field": `{${languageTag}}`,
          visibility: textLayersVisibility,
        },
      }) as AnyLayer;
    } else {
      return layer as AnyLayer;
    }
  });

  return greyStyleTextAdjusted as MapboxStyle;
};
