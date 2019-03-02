import * as F from "./Factory";
//const EM_DASH = "&#8212;";

const onDash = (event: any, editor: any, next) => {
  const { value } = editor;
  const { document } = value;

  // let's see if there are 2 consecutive --
  const currentText = value.focusText.text;
  if (currentText.charAt(currentText.length - 1) !== "-") {
    return next();
  }

  editor.deleteBackward(1);

  const listNode = document.nodes.filter(node => node.type === "list").first();

  const type = value.startBlock.type;
  if (type === "overview" || type === "title") {
    event.preventDefault();

    if (listNode) {
      // list already exists so simply move there
      const textNode = listNode.nodes.first().getFirstText();

      return editor.moveToEndOfNode(textNode);
    }
    const list = F.initializeList();
    return editor.insertBlock(list).moveToStartOfNode(
      list
        .nodes
        .first()
        .nodes
        .first()
    );
  }

  if (type === "location" || type === "description") {
    event.preventDefault();

    const entry = document.getParent(value.focusBlock.key);
    const sibling = document.getNextSibling(entry.key);
    if (sibling) {
      const leaf = sibling.nodes.first().getFirstText();
      return editor.moveToEndOfNode(leaf);
    }

    // const newList = listNode.nodes.insert(F.createEntry());
    // console.log("##", newList.toJSON());
    // return editor.replaceNodeByKey(listNode.key, F.initializeList(newList));
    const newEntry = F.createEntry();
    console.log(
      "#newentry",
      newEntry.nodes.first().toJSON(),
      newEntry.nodes.first()
    );
    return editor
      .insertNodeByKey(listNode.key, listNode.nodes.size, newEntry)
      .moveToStartOfNode(newEntry.nodes.first());
  }

  return undefined;
};

export default onDash;
