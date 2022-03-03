export type OpenAPIType = "array" | "object" | "string" | "number" | "boolean";

export interface Item {
  type: OpenAPIType;
  properties?: { [attribute: string]: Item };
  required?: string[];
  items?: Item;
}

//export type Method = "get" | "post";

export interface Response {
  summary?: string;
  tags?: string[];
  content: { [contentType: string]: { schema: Item } }; // contentType: 'application/json' etc
}

export interface Parameter {
  description?: string;
  in: "query";
  name: string;
  schema: Pick<Item, "type">;
}

export interface Path {
  description: string;
  operationId: string;
  responses?: { [responseCode: number]: Response }; // responsecode: 200, 201, 400, etc
  parameters?: Parameter[];
  requestBody?: { "#ref": string } | Pick<Response, "content">;
}

export interface OpenAPIPath {
  [method: string]: Path;
}

export interface Components {
  requestBodies: { [name: string]: Pick<Response, "content"> };
}

export interface OpenAPI {
  components?: Components;
  paths: { [path: string]: OpenAPIPath };
}
