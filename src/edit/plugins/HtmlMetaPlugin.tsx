import * as F from "../Factory";

const HtmlMetaPlugin = options => {
    const { handler } = options;
    return {
        onKeyDown(event, editor, next) {
            const { value } = editor;
            const { document } = value;
            const focus = value.startBlock;



            if (event.key === "h") {
                const text: string = value.startText.text;
                if (text.charAt(text.length - 1) === '/') {
                    console.log("cool!")
                    event.preventDefault();
                    const block = F.createCanonical();
                    return editor.deleteBackward(1).
                        insertNodeByKey(document.key, document.nodes.size, block);
                }
                return next();
            }
            return next();
        }
    };
};

export default HtmlMetaPlugin;