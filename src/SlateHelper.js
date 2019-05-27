import { Value } from "slate";

export const getPreviewText = data => {
  const value = Value.fromJSON(data);

  if (value && value.document) {
    const { nodes } = value.document;
    const second = nodes.get(1);
    return second && second.text ? second.text.substring(0, 150) + "..." : "";
  }
  return "";
};
