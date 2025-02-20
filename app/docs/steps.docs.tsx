import { markdown, ReactSpecimen } from "catalog";

import { HeaderBorder, HeaderProgressProvider } from "@/components/header";
import {
  ConfiguratorStateConfiguringChart,
  ConfiguratorStateDescribingChart,
} from "@/configurator";
import { StepperDumb } from "@/configurator/components/stepper";
import { DataCubeMetadataWithComponentValuesQuery } from "@/graphql/query-hooks";

const mockData = {
  __typename: "Query",
  dataCubeByIri: { dimensions: [{}] },
} as DataCubeMetadataWithComponentValuesQuery;

export default () => markdown`
> The "stepper" is used to guide users through the steps of creating a visualization.


Configuring step

${(
  <ReactSpecimen>
    <HeaderProgressProvider>
      <HeaderBorder />
      <StepperDumb
        goPrevious={() => {}}
        goNext={() => {}}
        data={mockData}
        state={
          { state: "CONFIGURING_CHART" } as ConfiguratorStateConfiguringChart
        }
      />
    </HeaderProgressProvider>
  </ReactSpecimen>
)}

Describing step

  ${(
    <ReactSpecimen>
      <HeaderProgressProvider>
        <HeaderBorder />
        <StepperDumb
          goPrevious={() => {}}
          goNext={() => {}}
          data={mockData}
          state={
            { state: "DESCRIBING_CHART" } as ConfiguratorStateDescribingChart
          }
        />
      </HeaderProgressProvider>
    </ReactSpecimen>
  )}


  ## How to use

~~~
import { Step } from "../components/step";

<Step variant="">
  Primary Step
</Step>
~~~

`;
