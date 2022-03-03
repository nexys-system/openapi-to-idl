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

export interface OpenAPIPath {
  [method: string]: {
    description: string;
    operationId: string;
    responses?: { [responseCode: number]: Response }; // responsecode: 200, 201, 400, etc
  };
}

export interface OpenAPI {
  paths: { [path: string]: OpenAPIPath };
}
