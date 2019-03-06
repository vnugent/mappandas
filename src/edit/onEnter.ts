import { Block } from "slate";
import { List } from "immutable";

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
    event.preventDefault();
    const loc = value.startBlock;
    var desc = editor.value.document.getNextSibling(loc.key);
    console.log("###editor, desc, location", editor, desc, loc);
    if (!desc) {
      console.log("description not found");
      desc = Block.create({ type: "description" });
      const entry = loc.getParent([0]);
      console.log("parent of", loc, entry);
    }
    if (onEntryUpdate) {
      onEntryUpdate({
        location: loc,
        mDescription: List.of(desc)
      });
    }
    return editor.moveToStartOfNode(desc.getFirstText());
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
