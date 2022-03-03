import React from "react";

import YMLtoJSON from "js-yaml";

import * as T from "./type";
import * as U from "./utils";

const Form = ({
  valueDefault,
  onSuccess,
}: {
  valueDefault?: string;
  onSuccess: (s: T.OpenAPI, prefix: string) => void;
}) => {
  const [value, setValue] = React.useState<string | undefined>(valueDefault);
  const [prefix, setPrefix] = React.useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (U.isString(value)) {
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

        onSuccess(j, prefix);
      } catch (err) {
        console.error("could not parse to JSON: " + (err as Error).message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-control"
        onChange={(v) => setPrefix(v.target.value)}
        placeholder={"api prefix"}
      />
      <br />
      <textarea
        className="form-control"
        value={value}
        onChange={(v) => setValue(v.target.value)}
      />
      <br />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default Form;
