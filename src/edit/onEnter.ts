
const onEnter = (event: any, editor: any, next) => {
  const { value } = editor;

  const type = value.startBlock.type;
  if ( type === "title") {
    //editor.moveFocusToStartOfNextBlock();
    const nodes = value.document.nodes;
    const overview = nodes.find(v => v.type === "overview");

    const textNode = overview.getFirstText();
    return editor.moveToEndOfNode(textNode);
  }
  if (type === "overview") {
     return next();
  }
  if (type === "description") {
    return next();
 }

  return undefined;
};

export default onEnter;
