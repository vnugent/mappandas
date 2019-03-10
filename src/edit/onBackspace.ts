//import * as F from "./Factory";

const onBackspace = (event: any, editor: any, next) => {
  const { value } = editor;
  const {selection} = value;
  const type = value.startBlock.type;
  
  console.log("#onBackspace() ", type, selection);
  if (type === "location") {
      if (selection.focus.offset === 0 &&  selection.isCollapsed) {
        event.preventDefault();
        return;
      }
  }
  return next();
};

export default onBackspace;
