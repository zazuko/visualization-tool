import {
  schemeAccent,
  schemeCategory10,
  schemeDark2,
  schemePaired,
  schemePastel1,
  schemePastel2,
  schemeSet1,
  schemeSet2,
  schemeSet3,
} from "d3-scale-chromatic";
import { scaleOrdinal } from "d3-scale";

export const getPalette = (
  palette: string | undefined
): ReadonlyArray<string> => {
  switch (palette) {
    case "accent":
      return schemeAccent;
    case "category10":
      return schemeCategory10;
    case "dark2":
      return schemeDark2;
    case "paired":
      return schemePaired;
    case "pastel1":
      return schemePastel1;
    case "pastel2":
      return schemePastel2;
    case "set1":
      return schemeSet1;
    case "set2":
      return schemeSet2;
    case "set3":
      return schemeSet3;
    default:
      return schemeCategory10;
  }
};

export const mapColorsToComponentValuesIris = ({
  palette,
  component,
}: {
  palette: string;
  component: DimensionFieldsWithValuesFragment;
}) => {
  const colorScale = scaleOrdinal()
    .domain(component.values.map((dv) => dv.value))
    .range(getPalette(palette));
  const colorMapping = {} as { [x: string]: string };

  component.values.forEach((dv) => {
    colorMapping[`${dv.value}` as string] = colorScale(dv.value) as string;
  });
  return colorMapping;
};
