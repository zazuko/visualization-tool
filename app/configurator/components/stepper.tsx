import { Trans } from "@lingui/macro";
import { Button, Typography } from "@mui/material";
import React, { ReactNode, useCallback, useEffect } from "react";

import Flex from "@/components/flex";
import { useHeaderProgress } from "@/components/header";
import {
  canTransitionToNextStep,
  canTransitionToPreviousStep,
  useConfiguratorState,
} from "@/configurator";
import { useDataCubeMetadataWithComponentValuesQuery } from "@/graphql/query-hooks";
import SvgIcChevronLeft from "@/icons/components/IcChevronLeft";
import SvgIcChevronRight from "@/icons/components/IcChevronRight";
import { useLocale } from "@/src";

export type StepStatus = "past" | "current" | "future";

const steps = ["CONFIGURING_CHART", "DESCRIBING_CHART"] as const;
type StepState = typeof steps[number];

export const StepperDumb = ({
  goPrevious,
  goNext,
  state,
  data,
}: {
  goPrevious: () => void;
  goNext: () => void;
  state: ReturnType<typeof useConfiguratorState>[0];
  data: ReturnType<
    typeof useDataCubeMetadataWithComponentValuesQuery
  >[0]["data"];
}) => {
  const nextDisabled =
    !canTransitionToNextStep(state, data?.dataCubeByIri) ||
    state.state === "PUBLISHING";
  const previousDisabled =
    !canTransitionToPreviousStep(state) || state.state === "PUBLISHING";

  const previousLabel = <Trans id="button.back">Back</Trans>;
  const nextLabel =
    state.state === "DESCRIBING_CHART" || state.state === "PUBLISHING" ? (
      <Trans id="button.publish">Publish this visualization</Trans>
    ) : (
      <Trans id="button.next">Next</Trans>
    );

  const currentStepIndex = steps.indexOf(state.state as $IntentionalAny);
  const { value: progress, setValue: setProgress } = useHeaderProgress();
  useEffect(() => {
    const run = async () => {
      if (
        (currentStepIndex === 0 || currentStepIndex === -1) &&
        progress === 100
      ) {
        setProgress(0);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      setProgress(
        Math.round(((currentStepIndex + 1) / (steps.length + 1)) * 100)
      );
    };
    run();
    return () => {
      setProgress(100);
    };
  }, [currentStepIndex, setProgress, progress]);

  return (
    <Flex
      sx={{
        justifyContent: ["flex-start", "flex-start", "center"],
        alignItems: "center",
        position: "relative",

        backgroundColor: "grey.100",
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: "grey.500",
        overflow: "hidden",
      }}
    >
      {/* Stepper container */}
      <Flex
        sx={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
          minHeight: 56,
        }}
      >
        <Flex sx={{ minWidth: 200, justifyContent: "flex-start" }}>
          <Button
            startIcon={<SvgIcChevronLeft />}
            onClick={goPrevious}
            disabled={previousDisabled}
            variant="text"
            size="small"
            color="inherit"
            sx={{ fontWeight: "bold" }}
          >
            {previousLabel}
          </Button>
        </Flex>

        <Flex
          sx={{ flexGrow: 1, justifyContent: "center", textAlign: "center" }}
        >
          <CallToAction
            stepState={steps[currentStepIndex] as StepState | undefined}
          />
        </Flex>
        <Flex sx={{ minWidth: 200, justifyContent: "flex-end" }}>
          <Button
            endIcon={
              state.state === "DESCRIBING_CHART" ? null : <SvgIcChevronRight />
            }
            onClick={goNext}
            disabled={nextDisabled}
            variant={state.state === "DESCRIBING_CHART" ? "contained" : "text"}
            color={state.state === "DESCRIBING_CHART" ? "primary" : "inherit"}
            size={state.state === "DESCRIBING_CHART" ? "medium" : "small"}
            sx={{ fontWeight: "bold" }}
          >
            {nextLabel}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const Stepper = ({ dataSetIri }: { dataSetIri?: string }) => {
  const [state, dispatch] = useConfiguratorState();
  const locale = useLocale();
  const [{ data }] = useDataCubeMetadataWithComponentValuesQuery({
    variables: { iri: dataSetIri ?? "", locale },
  });
  const goNext = useCallback(() => {
    if (data?.dataCubeByIri) {
      dispatch({
        type: "STEP_NEXT",
        dataSetMetadata: data?.dataCubeByIri,
      });
    }
  }, [data, dispatch]);

  const goPrevious = useCallback(() => {
    if (state.state === "CONFIGURING_CHART") {
      history.back();
    } else {
      dispatch({
        type: "STEP_PREVIOUS",
      });
    }
  }, [dispatch, state.state]);

  return (
    <StepperDumb
      state={state}
      goPrevious={goPrevious}
      goNext={goNext}
      data={data}
    />
  );
};

export const CallToAction = ({
  stepState,
}: {
  stepState: StepState | undefined;
}) => {
  switch (stepState) {
    case "CONFIGURING_CHART":
      return (
        <CallToActionText
          label={
            <Trans id="step.visualize">
              Customize your visualization by using the filter and color
              segmentation options in the sidebars.
            </Trans>
          }
        />
      );
    case "DESCRIBING_CHART":
      return (
        <CallToActionText
          label={
            <Trans id="step.annotate">
              Before publishing, add a title and description to your chart, and
              choose which elements should be interactive.
            </Trans>
          }
        />
      );
  }

  return null;
};

const CallToActionText = ({ label }: { label: ReactNode }) => {
  return (
    <Typography
      sx={{
        color: "grey.700",
        fontWeight: "regular",
      }}
      variant="body2"
    >
      {label}
    </Typography>
  );
};
