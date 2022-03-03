export const toTSDefinitionWithAny = (item) => {
  if (!item) {
    return "any";
  }
  return toTSDefinition(item);
};
const toTSDefinition = ({properties, required, type, items}, interfaceName) => {
  if (type === "array") {
    if (!items) {
      throw Error("array but not aatribures items");
    }
    return toTSDefinition(items) + "[]";
  }
  if (!properties) {
    return type;
  }
  const c = Object.entries(properties).map(([k, v]) => {
    const mandatory = required?.includes(k) || false;
    const mandatorySign = mandatory ? "" : "?";
    const content = v.type === "object" ? toTSDefinition(v) : v.type;
    return `${k}${mandatorySign}: ${content};`;
  }).join(" ");
  if (interfaceName) {
    return `interface ${interfaceName} {${c}}`;
  }
  return `{${c}}`;
};
const toTSInterface = (item, interfaceName) => `interface ${interfaceName} ${toTSDefinition(item)}`;
export const isString = (s) => s !== void 0 && s !== "";
