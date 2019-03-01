//import * as F from "./Factory";

const onBackspace = (event: any, editor: any, next) => {
  const { value } = editor;
  const {selection} = value;
  const type = value.startBlock.type;
  
  console.log("#onBackspace() ", type, selection);
//   if (type === "location") {
//       event.preventDefault();
//       return;
//   }
  return next();
};

export default onBackspace;
