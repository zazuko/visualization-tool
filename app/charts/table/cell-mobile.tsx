import { Box, Typography } from "@mui/material";
import { hcl } from "d3";
import * as React from "react";
import { Cell, Row } from "react-table";

import { useChartState } from "@/charts/shared/use-chart-state";
import { getBarLeftOffset, getBarWidth } from "@/charts/table/cell-desktop";
import { ColumnMeta, TableChartState } from "@/charts/table/table-state";
import { Tag } from "@/charts/table/tag";
import Flex from "@/components/flex";
import { useFormatNumber } from "@/configurator/components/ui-helpers";
import { Observation } from "@/domain/data";
import { Icon } from "@/icons";

export const RowMobile = ({
  row,
  prepareRow,
}: {
  row: Row<Observation>;
  prepareRow: (row: Row<Observation>) => void;
}) => {
  const { tableColumnsMeta } = useChartState() as TableChartState;

  prepareRow(row);

  const headingLevel = row.depth === 0 ? "h2" : row.depth === 1 ? "h3" : "p";
  return (
    <Box>
      {row.subRows.length === 0 ? (
        row.cells.map((cell, i) => {
          return (
            <Flex
              key={i}
              component="dl"
              sx={{
                color: "grey.800",
                fontSize: "0.75rem",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                my: 2,
                "&:first-of-type": {
                  pt: 2,
                },
                "&:last-of-type": {
                  borderBottom: "1px solid",
                  borderBottomColor: "grey.400",
                  pb: 3,
                },
              }}
            >
              <Box
                component="dt"
                sx={{ flex: "1 1 100%", fontWeight: "bold", mr: 2 }}
              >
                {cell.column.Header}
              </Box>
              <Box
                component="dd"
                sx={{ flex: "1 1 100%", ml: 2, position: "relative" }}
              >
                <DDContent
                  cell={cell}
                  columnMeta={tableColumnsMeta[cell.column.id]}
                />
              </Box>
            </Flex>
          );
        })
      ) : (
        // Group
        <Flex
          sx={{
            borderTop: "1px solid",
            borderTopColor: "grey.400",
            color: "grey.600",
            py: 2,
            ml: `${row.depth * 12}px`,
          }}
        >
          <Icon name={row.isExpanded ? "chevronDown" : "chevronRight"} />
          <Typography
            component={headingLevel}
            variant="body1"
            sx={{ color: "grey.900" }}
            {...row.getToggleRowExpandedProps()}
          >
            {`${row.groupByVal}`}
          </Typography>
        </Flex>
      )}
    </Box>
  );
};

export const DDContent = ({
  cell,
  columnMeta,
}: {
  cell: Cell<Observation>;
  columnMeta: ColumnMeta;
}) => {
  const { bounds } = useChartState();
  const { chartWidth } = bounds;

  const formatNumber = useFormatNumber();

  const {
    columnComponentType,
    type,
    textStyle,
    textColor,
    colorScale,
    barShowBackground,
    barColorBackground,
    barColorNegative,
    barColorPositive,
    widthScale,
  } = columnMeta;

  switch (type) {
    case "text":
      return (
        <Box
          component="div"
          sx={{
            width: "100%",
            color: textColor,
            fontWeight: textStyle,
          }}
        >
          {columnComponentType === "Measure"
            ? formatNumber(cell.value)
            : cell.render("Cell")}
        </Box>
      );
    case "category":
      return (
        <Tag
          tagColor={colorScale ? colorScale(cell.value) : "primaryLight"}
          small
        >
          {cell.render("Cell")}
        </Tag>
      );
    case "heatmap":
      const isNull = cell.value === null;
      return (
        <Box
          sx={{
            color: isNull
              ? textColor
              : hcl(colorScale ? colorScale(cell.value) : textColor).l < 55
              ? "#fff"
              : "#000",
            backgroundColor: isNull
              ? "grey.100"
              : colorScale
              ? colorScale(cell.value)
              : "grey.100",
            fontWeight: textStyle,
            px: 1,
            width: "fit-content",
            borderRadius: "2px",
          }}
        >
          {formatNumber(cell.value)}
        </Box>
      );
    case "bar":
      // Reset widthscale range based on current viewport
      widthScale?.range([0, chartWidth / 2]);

      return (
        <Flex
          sx={{
            flexDirection: "column",
            justifyContent: "center",
            width: chartWidth / 2,
          }}
        >
          <Box sx={{ width: chartWidth / 2 }}>{formatNumber(cell.value)}</Box>
          {cell.value !== null && widthScale && (
            <Box
              sx={{
                width: chartWidth / 2,
                height: 14,
                position: "relative",
                backgroundColor: barShowBackground
                  ? barColorBackground
                  : "grey.100",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: `${getBarLeftOffset(cell.value, widthScale)}px`,
                  width: `${getBarWidth(cell.value, widthScale)}px`,
                  height: 14,
                  backgroundColor:
                    cell.value > 0 ? barColorPositive : barColorNegative,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "-2px",
                  left: `${
                    cell.value < 0
                      ? widthScale(0)
                      : getBarLeftOffset(cell.value, widthScale)
                  }px`,
                  width: "1px",
                  height: 18,
                  backgroundColor: "grey.700",
                }}
              />
            </Box>
          )}
        </Flex>
      );

    default:
      return (
        <Box
          component="span"
          sx={{
            color: textColor,
            fontWeight: textStyle,
          }}
        >
          {columnComponentType === "Measure"
            ? formatNumber(cell.value)
            : cell.render("Cell")}
        </Box>
      );
  }
};
