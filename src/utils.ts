import * as T from "./type";

export const toTSDefinitionWithAny = (item?: T.Item) => {
  if (!item) {
    return "any";
  }

  return toTSDefinition(item);
};

const toTSDefinition = (
  { properties, required, type, items }: T.Item,
  interfaceName?: string
): string => {
  if (type === "array") {
    if (!items) {
      throw Error("array but not aatribures items");
    }
    return toTSDefinition(items) + "[]";
  }
  if (!properties) {
    return type;
  }

  const c = Object.entries(properties)
    .map(([k, v]) => {
      const mandatory = required?.includes(k) || false;
      const mandatorySign = mandatory ? "" : "?";
      const content = v.type === "object" ? toTSDefinition(v) : v.type;
      return `${k}${mandatorySign}: ${content};`;
    })
    .join(" ");

  if (interfaceName) {
    return `interface ${interfaceName} {${c}}`;
  }

  return `{${c}}`;
};

const toTSInterface = (item: T.Item, interfaceName?: string): string =>
  `interface ${interfaceName} ${toTSDefinition(item)}`;
