export type OpenAPIType = "array" | "object" | "string" | "number" | "boolean";

export interface Item {
  type: OpenAPIType;
  properties?: { [attribute: string]: Item };
  required?: string[];
  items?: Item;
}

export type Method = "get" | "post" | "put" | "delete";

type ContentType = "application/json";

export interface Response {
  summary?: string;
  tags?: string[];
  content: { [contentType in ContentType]?: { schema: Item } };
}

export interface Parameter {
  description?: string;
  in: "query";
  name: string;
  schema: Pick<Item, "type">;
}

type ResponseCode = 200 | 201 | 400 | 401 | 403 | 404 | 500;

export interface Path {
  description: string;
  operationId: string;
  responses?: { [responseCode in ResponseCode]?: Response };
  parameters?: Parameter[];
  requestBody?: { "#ref": string } | Pick<Response, "content">;
}

export interface Components {
  requestBodies: { [name: string]: Pick<Response, "content"> };
}

export interface OpenAPI {
  components?: Components;
  paths: { [path: string]: { [method in Method]?: Path } };
}
