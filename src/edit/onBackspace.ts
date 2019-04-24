//import * as F from "./Factory";

const onBackspace = (event: any, editor: any, next) => {
  const { value } = editor;
  const { selection } = value;
  const type = value.startBlock.type;

  if (type === "location") {
    if (selection.focus.offset === 0 && selection.isCollapsed) {
      event.preventDefault();
      return;
    }
  }
//   if (
//     type === "overview" &&
//     selection.focus.offset === 0 &&
//     selection.isCollapsed
//   ) {
//     const prev = value.document.getPreviousSibling(value.startBlock.key);
//     if (prev && prev.type === "card") {
//       event.preventDefault();
//       return;
//     }
//   }
  return next();
};

export default onBackspace;
