import * as F from "../Factory";

const addLocation = editor => {
  const { value } = editor;
  const { document } = value;
  var listNode = document.nodes.filter(node => node.type === "list").first();

  //   if (!listNode) {
  //     listNode = F.initializeList(); // initialize list with one empty entry
  //     return editor
  //       .insertBlock(listNode)
  //       .moveToStartOfNode(listNode.nodes.first().getFirstText());
  //   }
  const focus = value.focusBlock;
  if (focus.type === "overview") {
    // insert at the start of list
    const newEntry = F.createEntry();
    return (
      editor
        //.insertNodeByKey(listNode.key, 0, newEntry)
        .insertBlock(newEntry)
    );
    //.moveTo(newEntry.nodes.first().getFirstText().key, 1);
  }

  if (focus.type === "location" || focus.type === "description") {
    const parentOfinFocus = editor.value.document.getParent(
      editor.value.focusBlock.key
    );
    const index = document.nodes.indexOf(parentOfinFocus);
    const newEntry = F.createEntry();
    const newParagraph = F.createOverview();
    return editor
    .insertNodeByKey(document.key, index + 1, newEntry)
    .moveToStartOfNode(newEntry);

    //   .insertNodeByKey(document.key, index + 1, newParagraph)
    //   .moveToStartOfNode(newParagraph)
    //   .insertBlock(newEntry)
    //   .moveToStartOfNode(newEntry);
  }
};

export default addLocation;
