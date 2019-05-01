import * as F from "../Factory";

const addLocation = editor => {
  const { value } = editor;
  const { document } = value;

  const focus = value.focusBlock;

  const parentOfinFocus = editor.value.document.getParent(
    focus.key
  );

  if (parentOfinFocus.type === "card") {
    const index = document.nodes.indexOf(parentOfinFocus);
    const newEntry = F.createEntry();
    return editor
      .insertNodeByKey(document.key, index + 1, newEntry)
      .moveToStartOfNode(newEntry);
  } else if (focus.type === "overview") {
    const newEntry = F.createEntry();
    return editor.insertBlock(newEntry).moveToStartOfNode(newEntry);
  }
};

export default addLocation;
