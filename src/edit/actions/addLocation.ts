import * as F from "../Factory";

const addLocation = editor => {
  const { value } = editor;
  const { document } = value;
  var listNode = document.nodes.filter(node => node.type === "list").first();

  if (!listNode) {
    listNode = F.initializeList(); // initialize list with one empty entry
    return editor
      .insertBlock(listNode)
      .moveToStartOfNode(listNode.nodes.first().getFirstText());
  }
  const focus = value.focusBlock;
  if (focus.type === "title" || focus.type === "overview") {
    // insert at the start of list
    const newEntry = F.createEntry();
    return editor
      .insertNodeByKey(listNode.key, 0, newEntry)
      .moveTo(newEntry.nodes.first().getFirstText().key, 1);
  }
  // "split existing entry into 2"
  return editor.splitBlock(2).moveBackward(1);
};

export default addLocation;
