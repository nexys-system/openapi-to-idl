import React from "react";
import { title, github } from "./config";

import * as T from "./type";
import * as C from "./code";
import Form from "./form";

import LoadData from "./load-data";

const UI = ({ value }: { value: string }) => {
  const [p, setParsed] = React.useState<
    { parsed: T.OpenAPI; prefix: string } | undefined
  >();

  if (!p) {
    return (
      <Form
        valueDefault={value}
        onSuccess={(parsed, prefix) => setParsed({ parsed, prefix })}
      />
    );
  }

  const { parsed, prefix } = p;

  const codes = Object.entries(parsed.paths)
    .map(([pathname, responses], i) => {
      const methods: T.Method[] = Object.keys(responses).filter((x) =>
        C.methodsKeywords.includes(x.toUpperCase())
      ) as T.Method[];

      if (methods.length < 1) {
        throw Error("no method associated");
      }

      if (methods.length > 1) {
        throw Error("more than one method");
      }

      const [method] = methods;
      const path = responses[method];

      if (!path) {
        throw Error("path undefined");
      }

      const code = C.toCode(
        path,
        pathname,
        method as "GET" | "POST",
        parsed.components
      );

      return code;
    })
    .join("\n\n");

  const codeOut = [C.codePrefix(prefix), codes].join("\n\n");

  return (
    <>
      <ul>
        {Object.entries(parsed.paths).map(([pathname, responses], i) => {
          const methods: string[] = Object.keys(responses).filter((x) =>
            C.methodsKeywords.includes(x.toUpperCase())
          );

          if (methods.length < 1) {
            throw Error("no method associated");
          }

          if (methods.length > 1) {
            throw Error("more than one method");
          }

          const [method] = methods;

          return (
            <li key={i}>
              <code>
                {method.toUpperCase()} {pathname}{" "}
              </code>
            </li>
          );
        })}
      </ul>

      <pre>{codeOut}</pre>
      <ul className="list-inline">
        <li>
          <button
            onClick={() => navigator.clipboard.writeText(codeOut)}
            className="btn btn-sm btn-primary"
          >
            copy
          </button>
        </li>
        <li>
          <button
            onClick={() => setParsed(undefined)}
            className="btn btn-sm btn-secondary"
          >
            reset
          </button>
        </li>
      </ul>
    </>
  );
};

export default UI;
