import * as _ from "underscore";

const EVENT_DELAY = 250;

const LocationPlugin = options => {
  const { handler } = options;
  return {
    onKeyDown(event, editor, next) {
      const { value } = editor;
      const location = value.startBlock;

      if (location.type !== "location") return next();

      const isNotBlank = location.getFirstText().text.trim() !== "";

      if (event.key === "ArrowUp") {
        isNotBlank && fireEvent(location, editor, handler);
        return next();
      }

      if (event.key === "Enter" || event.key === "ArrowDown") {
        event.preventDefault(); // prevent splitting/normalization
        isNotBlank && fireEvent(location, editor, handler);
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
