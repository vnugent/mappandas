import { List } from "immutable";
import * as _ from "underscore";

import * as F from "./Factory";

const onEnter = ({ event, editor, next }) => {
  const { value } = editor;
  const root = value.document.nodes;

  const type = value.startBlock.type;
//   if (type === "title") {
//     const overview = root.find(v => v.type === "overview");
//     if (overview) {
//       const textNode = overview.getFirstText();
//       return editor.moveToRangeOfNode(textNode);
//     }
//     return next();
//     //return editor.insertBlock(F.createOverview());
//   }
//   if (type === "overview") {
//     return next();
//   }

  // insert new paragraph after Figure
  if (type === "caption" || type === "image") {
    const parentOfinFocus = editor.value.document.getParent(
      editor.value.focusBlock.key
    );
    const newParagraph = F.createOverview();
    const index = root.indexOf(parentOfinFocus);

    return editor
      .insertNodeByKey(value.document.key, index + 1, newParagraph)
      .moveToStartOfNode(newParagraph);
  }

  return next();
};

export default onEnter;
