import React from "react";
import { title, github } from "./config";

import LoadData from "./load-data";

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
