import { Block } from "slate";
import * as F from "./Factory";

const onEnter = (event: any, editor: any, next) => {
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
        console.log("description not found")
        desc = Block.create({ type: "description" });
        const entry = loc.getParent([0]);
        console.log("parent of", loc, entry);
        //return editor.insertBlock(desc);
      //return editor.moveToStartOfNode(desc);
    }

    return editor.moveToStartOfNode(desc.getFirstText());
  }
  //   if (type === "location") {
  //     const loc = value.startBlock;
  //     var desc =  editor.value.document.getNextSibling(loc.key)
  //     console.log("###editor, desc, location", editor, desc, loc);
  //     if (desc) {
  //         return editor.moveToStartOfNode(desc);
  //     }
  //     desc = Block.create({ type: "description" });
  //     return editor.insertBlock(desc);
  //     //return desc.getParent(desc.key).nodes.insert(loc);
  //     //return ;

  //   }

  if (type === "description") {
    console.log("new line in desc");
    return next();
  }

  console.log("Type", type);
  return undefined;
};

export default onEnter;
