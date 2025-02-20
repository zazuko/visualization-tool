import { Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import { ReactNode } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

import { DraggableTab } from "@/configurator/components/chart-controls/control-tab";
import {
  ControlSection,
  ControlSectionContent,
  SectionTitle,
} from "@/configurator/components/chart-controls/section";
import { getIconName } from "@/configurator/components/ui-helpers";
import { useActiveFieldField } from "@/configurator/config-form";
import { TableColumn } from "@/configurator/config-types";
import { DimensionMetaDataFragment } from "@/graphql/query-hooks";
import { DataCubeMetadata } from "@/graphql/types";
import { Icon } from "@/icons";

type Props = {
  id: string;
  title: ReactNode;
  items: TableColumn[];
  metaData: DataCubeMetadata;
  isDropDisabled?: boolean;
};
export const TabDropZone = ({
  id,
  items,
  title,
  metaData,
  isDropDisabled,
}: Props) => {
  const { dimensions, measures } = metaData;

  const components = [...dimensions, ...measures];

  return (
    <Droppable droppableId={id} isDropDisabled={isDropDisabled}>
      {(
        { innerRef, placeholder },
        { isDraggingOver, isUsingPlaceholder, draggingOverWith }
      ) => {
        return (
          <ControlSection isHighlighted={isDraggingOver}>
            <SectionTitle>{title}</SectionTitle>
            <ControlSectionContent
              side="left"
              role="tablist"
              aria-labelledby={`controls-${id}`}
            >
              <Box
                sx={{ p: 0, minHeight: 60, position: "relative" }}
                ref={innerRef}
              >
                {items.map(({ componentIri, index, isHidden }, i) => {
                  return (
                    <Draggable
                      key={componentIri}
                      draggableId={componentIri}
                      index={i}
                    >
                      {(
                        { innerRef, draggableProps, dragHandleProps },
                        { isDragging }
                      ) => {
                        return (
                          <Box
                            ref={innerRef}
                            sx={{
                              position: "relative",
                            }}
                            {...draggableProps}
                            style={{
                              ...draggableProps.style,
                            }}
                            {...dragHandleProps}
                          >
                            <DraggableTabField
                              key={componentIri}
                              component={
                                components.find((d) => d.iri === componentIri)!
                              }
                              value={`${componentIri}`}
                              upperLabel={
                                <Trans id="table.column.no">
                                  Column {index + 1}
                                </Trans>
                              }
                              isDragging={isDragging}
                              disabled={isHidden}
                            />
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                right: 3,
                                margin: "auto",
                                color: isDragging
                                  ? "secondary.active"
                                  : "secondary.disabled",
                                ":hover": {
                                  color: "secondary.hover",
                                },
                              }}
                            >
                              <Icon name="dragndrop" />
                            </Box>
                          </Box>
                        );
                      }}
                    </Draggable>
                  );
                })}
                {placeholder}
              </Box>
            </ControlSectionContent>
          </ControlSection>
        );
      }}
    </Droppable>
  );
};

const DraggableTabField = ({
  component,
  value,
  isDragging,
  upperLabel,
  disabled,
}: {
  component: DimensionMetaDataFragment;
  value: string;
  disabled?: boolean;
  isDragging: boolean;
  upperLabel: ReactNode;
}) => {
  const field = useActiveFieldField({
    value,
  });

  const iconName = getIconName(
    `tableColumn${component.__typename}${disabled ? "Hidden" : ""}`
  );

  return (
    <DraggableTab
      component={component}
      value={`${field.value}`}
      upperLabel={upperLabel}
      checked={field.checked}
      onClick={field.onClick}
      isDragging={isDragging}
      disabled={disabled}
      iconName={iconName}
    />
  );
};
