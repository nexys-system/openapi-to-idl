import React from "./_snowpack/pkg/react.js";
import * as C from "./code.js";
import Form from "./form.js";
const UI = ({value}) => {
  const [p, setParsed] = React.useState();
  if (!p) {
    return /* @__PURE__ */ React.createElement(Form, {
      valueDefault: value,
      onSuccess: (parsed2, prefix2) => setParsed({parsed: parsed2, prefix: prefix2})
    });
  }
  const {parsed, prefix} = p;
  const codes = Object.entries(parsed.paths).map(([pathname, responses], i) => {
    const methods = Object.keys(responses).filter((x) => C.methodsKeywords.includes(x.toUpperCase()));
    if (methods.length < 1) {
      throw Error("no method associated");
    }
    if (methods.length > 1) {
      throw Error("more than one method");
    }
    const [method] = methods;
    const path = responses[method];
    const code = C.toCode(path, pathname, method, parsed.components);
    return code;
  }).join("\n\n");
  const codeOut = [C.codePrefix(prefix), codes].join("\n\n");
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("ul", null, Object.entries(parsed.paths).map(([pathname, responses], i) => {
    const methods = Object.keys(responses).filter((x) => C.methodsKeywords.includes(x.toUpperCase()));
    if (methods.length < 1) {
      throw Error("no method associated");
    }
    if (methods.length > 1) {
      throw Error("more than one method");
    }
    const [method] = methods;
    return /* @__PURE__ */ React.createElement("li", {
      key: i
    }, /* @__PURE__ */ React.createElement("code", null, method.toUpperCase(), " ", pathname, " "));
  })), /* @__PURE__ */ React.createElement("pre", null, codeOut), /* @__PURE__ */ React.createElement("ul", {
    className: "list-inline"
  }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", {
    onClick: () => navigator.clipboard.writeText(codeOut),
    className: "btn btn-sm btn-primary"
  }, "copy")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", {
    onClick: () => setParsed(void 0),
    className: "btn btn-sm btn-secondary"
  }, "reset"))));
};
export default UI;
