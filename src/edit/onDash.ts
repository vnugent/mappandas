import * as F from "./Factory";

const onDash = (event: any, editor: any, next) => {
  const { value } = editor;
  const type = value.startBlock.type;
  if (type === "overview" || type === "title") {
    const nodes = value.document.nodes;

    const currentText = value.focusText.text;
    if (currentText.charAt(currentText.length - 1) === "-") {
      editor.deleteBackward(1);
      const listNode = nodes.find(v => v.type === "list");
      if (listNode) {
        // already exist so simply move there
        const textNode = listNode.nodes.first().getFirstText();

        event.preventDefault();
        return editor.moveToEndOfNode(textNode);
      }
      event.preventDefault();
      const list = F.initializeList();
      return editor.insertBlock(list);
    }
    return next();
  }
  if (value.startBlock.type === "overview") {
    return next();
  }

  return undefined;
};

export default onDash;
