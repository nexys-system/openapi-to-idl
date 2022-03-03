import * as U from "./utils.js";
export const methodsKeywords = ["GET", "POST", "PUT", "DELETE", "CREATE"];
const isContent = (c) => !!c.content;
const getRequestBody = ({requestBody}, components) => {
  if (!requestBody) {
    return void 0;
  }
  if (!isContent(requestBody)) {
    const r = requestBody["#ref"];
    console.log(r);
    return;
  }
  return U.toTSDefinitionWithAny(requestBody.content["application/json"].schema);
};
const getQuery = ({
  parameters
}) => {
  if (!parameters) {
    return void 0;
  }
  const query = parameters.filter((x) => x.in === "query").map((x) => ({
    name: x.name,
    type: U.toTSDefinitionWithAny(x.schema)
  }));
  if (query.length === 0) {
    return void 0;
  }
  const paramString = query.map(({name, type}) => `${name}: ${type}`).join("; ");
  return {query, paramString};
};
export const toCode = (path, pathName, method, components) => {
  const response = path.responses?.[200];
  if (!response) {
    throw Error("could not find response 200");
  }
  const items = response.content["application/json"].schema;
  const q = getQuery(path);
  const body = getRequestBody(path, components);
  const url = q ? `"${pathName}?" + paramsToString(query)` : `"${pathName}"`;
  const params = [];
  if (q) {
    params.push(`query: {${q.paramString}}`);
  }
  if (body) {
    params.push(`body: ${body}`);
  }
  return `export const ${path.operationId.replace(/-/g, "_")} = async (${params.join(", ")}): Promise<${U.toTSDefinitionWithAny(items)}> => {
  const url = urlPrefix + ${url};
  
  const r = await fetch(url, { method: "${method.toUpperCase()}", headers, credentials: "same-origin"${body ? `, body: JSON.stringify(body)` : ""} });
  return r.json();
}`;
};
export const codePrefix = (prefix) => `
const urlPrefix='${prefix}';

const headers = {'content-type': 'application/json'};

const paramsToString = (p: { [s: string]: string }): string =>
  Object.entries(p)
    .map(([k, v]) => [k, encodeURIComponent(v)].join("="))
    .join("&");
`;
