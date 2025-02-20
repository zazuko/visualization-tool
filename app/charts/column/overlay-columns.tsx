import { ColumnsState } from "@/charts/column/columns-state";
import { useChartState } from "@/charts/shared/use-chart-state";
import { useInteraction } from "@/charts/shared/use-interaction";
import { Observation } from "@/domain/data";

export const InteractionColumns = () => {
  const [, dispatch] = useInteraction();

  const { preparedData, bounds, getX, xScaleInteraction } =
    useChartState() as ColumnsState;
  const { margins, chartHeight } = bounds;

  const showTooltip = (d: Observation) => {
    dispatch({
      type: "INTERACTION_UPDATE",
      value: { interaction: { visible: true, d } },
    });
  };
  const hideTooltip = () => {
    dispatch({
      type: "INTERACTION_HIDE",
    });
  };
  return (
    <g transform={`translate(${margins.left} ${margins.top})`}>
      {preparedData.map((d, i) => (
        <rect
          key={i}
          x={xScaleInteraction(getX(d)) as number}
          y={0}
          width={xScaleInteraction.bandwidth()}
          height={chartHeight}
          fill="hotpink"
          fillOpacity={0}
          stroke="none"
          onMouseOut={hideTooltip}
          onMouseOver={() => showTooltip(d)}
        />
      ))}
    </g>
  );
};
