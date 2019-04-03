import * as F from "../Factory";

const addLocation = editor => {
  const { value } = editor;
  const { document } = value;

  const focus = value.focusBlock;
  if (focus.type === "overview") {
    const newEntry = F.createEntry();
    return editor.insertBlock(newEntry).moveToStartOfNode(newEntry);
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
  }
};

export default addLocation;
