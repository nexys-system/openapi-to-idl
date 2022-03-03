import React from "./_snowpack/pkg/react.js";
import YMLtoJSON from "./_snowpack/pkg/js-yaml.js";
import * as U from "./utils.js";
const Form = ({
  valueDefault,
  onSuccess
}) => {
  const [value, setValue] = React.useState(valueDefault);
  const [prefix, setPrefix] = React.useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (U.isString(value)) {
      try {
        const j = YMLtoJSON.load(value);
        if (typeof j !== "object") {
          throw Error("not of type object");
        }
        if (!j.paths) {
          throw Error("does not have 'paths' attributes");
        }
        if (typeof j.paths !== "object") {
          throw Error("'paths' attribute is not of type object");
        }
        console.log(j);
        onSuccess(j, prefix);
      } catch (err) {
        console.error("could not parse to JSON: " + err.message);
      }
    }
  };
  return /* @__PURE__ */ React.createElement("form", {
    onSubmit: handleSubmit
  }, /* @__PURE__ */ React.createElement("input", {
    type: "text",
    className: "form-control",
    onChange: (v) => setPrefix(v.target.value),
    placeholder: "api prefix"
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("textarea", {
    className: "form-control",
    value,
    onChange: (v) => setValue(v.target.value)
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Submit"));
};
export default Form;
