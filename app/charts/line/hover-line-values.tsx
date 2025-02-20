import { LinesState } from "@/charts/line/lines-state";
import { useChartState } from "@/charts/shared/use-chart-state";
import { useInteraction } from "@/charts/shared/use-interaction";

export const HoverLineValues = () => {
  const { getX, xScale, getY, yScale, grouped, colors, bounds } =
    useChartState() as LinesState;
  const [state] = useInteraction();

  // const { x, visible, segment } = state.tooltip;

  // const segmentData = segment && grouped.get(segment);

  return (
    <>
      {/* {visible && segment && segmentData && (
        <>
          <g
            transform={`translate(${bounds.margins.left} ${bounds.margins.top})`}
          >
            {segmentData.map((d, i) => (
              <text
                key={i}
                x={xScale(getX(d))}
                y={yScale(getY(d))}
                fill={colors(segment)}
                textAnchor="middle"
                dy={-10}
                fontSize="0.8rem"
                opacity={xScale(getX(d)) !== x ? 1 : 0}
                style={{ transition: "opacity 200ms" }}
              >
                {formatNumber(getY(d))}
              </text>
            ))}
          </g>
        </>
      )} */}
    </>
  );
};
