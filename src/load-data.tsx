import React from "react";
import UI from "./ui";

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

export default LoadData;
