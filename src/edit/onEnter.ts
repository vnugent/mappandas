import { List } from "immutable";
import * as _ from "underscore";

import * as F from "./Factory";

const onEnter = ({ event, editor, next, onEntryUpdate }) => {
  const { value } = editor;
  const root = value.document.nodes;

  const type = value.startBlock.type;
  if (type === "title") {
    const overview = root.find(v => v.type === "overview");
    if (overview) {
      const textNode = overview.getFirstText();
      return editor.moveToRangeOfNode(textNode);
    }

    return editor.insertBlock(F.createOverview());
  }
  if (type === "overview") {
    return next();
  }

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

  if (type === "location") {
    const selection = value.selection;
    if (selection.focus.offset === 0 && selection.isCollapsed) {
      console.log("#onEnter at beginning of location");
      //editor.splitNod;
      return next();
    }

    const loc = value.startBlock;
    var desc = editor.value.document.getNextSibling(loc.key);
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
  return next();
};

export default onEnter;
