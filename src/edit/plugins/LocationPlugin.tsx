import * as _ from "underscore";

const EVENT_DELAY = 250;

const LocationPlugin = options => {
  const { handler } = options;
  return {
    onKeyDown(event, editor, next) {
      const { value } = editor;

      if (value.startBlock.type !== "location") return next();

      const location = value.startBlock;

      if (event.key === "ArrowUp") {
        fireEvent(location, editor, handler);
        return next();
      }
      if (event.key === "Enter" || event.key === "ArrowDown") {
        event.preventDefault(); // prevent splitting/normalization
        fireEvent(location, editor, handler);
        const desc = editor.value.document.getNextSibling(location.key);
        return editor.moveToStartOfNode(desc.nodes.first());
      }
      return next();
    }
  };
};

const fireEvent = (location, editor, fn) =>
  _.delay(() => fn(location, editor), EVENT_DELAY);

export default LocationPlugin;
