import PlaceholderPlugin from "slate-react-placeholder";

interface placeholder {
  type: string;
  text: string;
}

const createFor = (placeholders: placeholder[]): any[] => {
  return placeholders.map(placeholder => {
    return new PlaceholderPlugin({
      placeholder: placeholder.text,
      when: (editor, node) => {
        return isEmpty(placeholder.type, node) && isFirstLine(editor, node);
      }
    });
  });
};

const isEmpty = (type: string, node: any) => {
  return (
    node.type === type &&
    node.text === "" &&
    node.nodes.size === 1 &&
    node.getTexts().size === 1
  );
};

const isFirstLine = (editor: any, node: any) => {
    const prev = editor.value.document.getPreviousSibling(node.key);
    if (prev && prev.type === node.type) {
        return false;
    }
    return true;
}



const placeholderPlugins = createFor([
   { type: "title", text: "Title" },
  { type: "overview", text: "Tell your story" },
  { type: "location", text: "Location" },
  { type: "description", text: "Description" }
]);

export default placeholderPlugins;
