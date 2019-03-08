import * as F from "../Factory";

const addLocation = editor => {
  const { value } = editor;
  const { document } = value;
  var listNode = document.nodes.filter(node => node.type === "list").first();
  
  if (!listNode) {
    listNode = F.initializeList(); // initialize list with one empty entry
    return editor.insertBlock(listNode).moveToStartOfNode(listNode.nodes.first().getFirstText());
  }

  // append new entry to existing list
  const newEntry = F.createEntry();
  return editor
    .insertNodeByKey(listNode.key, listNode.nodes.size, newEntry)
    .moveToStartOfNode(newEntry.nodes.first().getFirstText());
};

export default addLocation;
