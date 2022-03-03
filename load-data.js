import React from "./_snowpack/pkg/react.js";
import UI from "./ui.js";
const LoadData = () => {
  const [value, setValue] = React.useState();
  if (!value) {
    fetch("/sample.yml").then(async (r) => {
      const j = await r.text();
      setValue(j);
    });
    return /* @__PURE__ */ React.createElement("p", null, "Loading...");
  }
  return /* @__PURE__ */ React.createElement(UI, {
    value
  });
};
export default LoadData;
