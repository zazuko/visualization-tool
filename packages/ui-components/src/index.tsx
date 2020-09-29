import { scaleOrdinal } from "d3-scale";

export const Hello = ({ name }: { name: string }) => {
  const s = scaleOrdinal([1, 2, 3]).domain(["a", "b", "c"]);
  return (
    <div>
      Hello {name} {s("b")}!!!!
    </div>
  );
};
