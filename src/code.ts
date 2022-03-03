import * as T from "./type";
import * as U from "./utils";

export const methodsKeywords = ["GET", "POST", "PUT", "DELETE", "CREATE"];

const isContent = (
  c: Pick<T.Response, "content"> | { "#ref": string }
): c is Pick<T.Response, "content"> =>
  !!(c as Pick<T.Response, "content">).content;

const getRequestBody = (
  { requestBody }: Pick<T.Path, "requestBody">,
  components?: T.Components
) => {
  if (!requestBody) {
    return undefined;
  }

  if (!isContent(requestBody)) {
    const r = requestBody["#ref"];
    console.log(r);
    return;
  }

  const preSchema = requestBody.content["application/json"];

  if (!preSchema) {
    return;
  }

  return U.toTSDefinitionWithAny(preSchema.schema);
};

const getQuery = ({
  parameters,
}: Pick<T.Path, "parameters">):
  | { query: { name: string; type: string }[]; paramString: string }
  | undefined => {
  if (!parameters) {
    return undefined;
  }

  const query: { name: string; type: string }[] = parameters
    .filter((x) => x.in === "query")
    .map((x) => ({
      name: x.name,
      type: U.toTSDefinitionWithAny(x.schema),
    }));

  if (query.length === 0) {
    return undefined;
  }

  const paramString: string = query
    .map(({ name, type }) => `${name}: ${type}`)
    .join("; ");

  return { query, paramString };
};

export const toCode = (
  path: T.Path,
  pathName: string,
  method: T.Method,
  components?: T.Components
) => {
  const response = path.responses?.[200];

  if (!response) {
    throw Error("could not find response 200");
  }

  const preSchema = response.content["application/json"];

  if (!preSchema) {
    throw Error("application/json undefined");
  }

  const { schema } = preSchema;

  const q = getQuery(path);
  const body = getRequestBody(path, components);

  const url: string = q
    ? `"${pathName}?" + paramsToString(query)`
    : `"${pathName}"`;

  const params: string[] = [];

  if (q) {
    params.push(`query: {${q.paramString}}`);
  }

  if (body) {
    params.push(`body: ${body}`);
  }

  return `export const ${path.operationId.replace(
    /-/g,
    "_"
  )} = async (${params.join(", ")}): Promise<${U.toTSDefinitionWithAny(
    schema
  )}> => {
  const url = urlPrefix + ${url};
  
  const r = await fetch(url, { method: "${method.toUpperCase()}", headers, credentials: "same-origin"${
    body ? `, body: JSON.stringify(body)` : ""
  } });
  return r.json();
}`;
};

export const codePrefix = (prefix: string) => `
const urlPrefix='${prefix}';

const headers = {'content-type': 'application/json'};

const paramsToString = (p: { [s: string]: string }): string =>
  Object.entries(p)
    .map(([k, v]) => [k, encodeURIComponent(v)].join("="))
    .join("&");
`;
