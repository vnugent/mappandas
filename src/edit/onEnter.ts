import { List } from "immutable";
import * as _ from "underscore";

import * as F from "./Factory";

const onEnter = ({ event, editor, next, onEntryUpdate }) => {
  const { value } = editor;

  const type = value.startBlock.type;
  if (type === "title") {
    const nodes = value.document.nodes;
    const overview = nodes.find(v => v.type === "overview");
    if (overview) {
      const textNode = overview.getFirstText();
      return editor.moveToRangeOfNode(textNode);
    }

    return editor.insertBlock(F.createOverview());
  }
  if (type === "overview") {
    return next();
  }

  if (type === "location") {
    const loc = value.startBlock;
    var desc = editor.value.document.getNextSibling(loc.key);
    console.log("desc", desc.toJSON());
    event.preventDefault();
    if (onEntryUpdate) {
      _.delay(
        () =>
          onEntryUpdate({
            location: loc,
            mDescription: List.of(desc)
          }),
        250
      );
    }
    return editor.moveToStartOfNode(desc.nodes.first());
  }

  if (type === "description") {
    // if (onEntryUpdate) {
    //   const entry = editor.value.document.getParent(value.startBlock.key);
    //   onEntryUpdate({
    //     location: entry.nodes.first(),
    //     mDescription: entry.nodes.slice(1)
    //   });
    // }
    return next();
  }

  console.log("### Unexpected Type", type);
  return undefined;
};

export default onEnter;
