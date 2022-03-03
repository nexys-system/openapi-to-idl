import React from "react";
import { title, github } from "./config";

import YMLtoJSON from "js-yaml";

import * as T from "./type";
import * as U from "./utils";

const isString = (s?: string): s is string => s !== undefined && s !== "";

const Form = ({
  valueDefault,
  onSuccess,
}: {
  valueDefault?: string;
  onSuccess: (s: T.OpenAPI) => void;
}) => {
  const [value, setValue] = React.useState<string | undefined>(valueDefault);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isString(value)) {
      try {
        const j = YMLtoJSON.load(value) as T.OpenAPI;

        if (typeof j !== "object") {
          throw Error("not of type object");
        }

        if (!(j as any).paths) {
          throw Error("does not have 'paths' attributes");
        }

        if (typeof (j as any).paths !== "object") {
          throw Error("'paths' attribute is not of type object");
        }

        console.log(j);

        onSuccess(j);
      } catch (err) {
        console.error("could not parse to JSON: " + (err as Error).message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={value} onChange={(v) => setValue(v.target.value)} />
      <br />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

const LoadData = () => {
  const [value, setValue] = React.useState<string | undefined>();

  if (!value) {
    fetch("/sample.yml").then(async (r) => {
      const j = await r.text();

      setValue(j);
    });

    return <p>Loading...</p>;
  }

  return <UI value={value} />;
};

const methodsKeywords = ["GET", "POST", "PUT", "DELETE", "CREATE"];

const UI = ({ value }: { value: string }) => {
  const [parsed, setParsed] = React.useState<T.OpenAPI | undefined>();

  if (!parsed) {
    return (
      <>
        <Form valueDefault={value} onSuccess={(value) => setParsed(value)} />
      </>
    );
  }

  return (
    <ul>
      {Object.entries(parsed.paths).map(([k, v], i) => {
        const methods: string[] = Object.keys(v).filter((x) =>
          methodsKeywords.includes(x.toUpperCase())
        );

        if (methods.length < 1) {
          throw Error("no method associated");
        }

        if (methods.length > 1) {
          throw Error("more than one method");
        }

        const [method] = methods;

        const path = v[method];

        const response = path.responses?.[200];

        if (!response) {
          throw Error("could not find path 200");
        }

        const items = response.content["application/json"].schema;

        /*if (!items) {
          throw Error("response undefined");
        }*/

        return (
          <li key={i}>
            <code>
              {method.toUpperCase()} {path.operationId} {k}
            </code>
            :{" "}
            <pre>
              {`const ${path.operationId.replace(
                /-/g,
                "_"
              )} = async ():Promise<${U.toTSDefinitionWithAny(items)}> => {
  const r = await fetch("${k}", {method: "${method.toUpperCase()}"});
  return r.json();
}`}
              {/*U.toTSDefinitionWithAny(items)*/}

              {/*JSON.stringify(items, null, 2)*/}
            </pre>
          </li>
        );
      })}
    </ul>
  );
};

export default () => (
  <>
    <h1>{title}</h1>

    <LoadData />

    <p>
      <a href={github.url}>
        <i className="fa fa-code"></i> Source
      </a>
      &nbsp;available under MIT license. Contributions are welcome.
    </p>
  </>
);
