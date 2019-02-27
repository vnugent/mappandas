import { Block } from "slate";
import { List } from "immutable";

const onDash = (event: any, editor: any, next) => {
  const { value } = editor;
  const type = value.startBlock.type;
  if (type === "overview" || type === "title") {
    const nodes = value.document.nodes;

    //editor.moveFocusToStartOfNextBlock;
    const currentText = value.focusText.text;
    console.log("###", currentText);
    if (currentText.charAt(currentText.length - 1) === "-") {
      const entryNode = nodes.find(v => v.type === "entry");
      if (entryNode) {
        // already exist so simply move there
        const textNode = entryNode.getFirstText();

        event.preventDefault();
        return editor.moveToEndOfNode(textNode);
      }
      event.preventDefault();
      const block = Block.create({
        type: "entry",
        nodes: List.of(
          Block.create({ type: "location" }),
          Block.create({ type: "description" })
        )
      });
      return editor.insertBlock(block);
    }
    return next();
    //return editor.moveToRangeOfNode(textNode);
    //return next();
  }
  if (value.startBlock.type === "overview") {
    return next();
  }

  return undefined;
};

export default onDash;
