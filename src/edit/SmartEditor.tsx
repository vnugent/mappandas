import * as React from "react";
import { Editor } from "slate-react";
import { Block, Value } from "slate";
import { Typography } from "@material-ui/core";

import onEnter from "./onEnter";
import onDash from "./onDash";
import onBackspace from "./onBackspace";
//import * as F from "./Factory";

export interface IAppProps {}

export interface IAppState {}

const KEY_ENTER = "Enter";
const KEY_DASH = "-";
const KEY_BACKSPACE = "Backspace";

class SmartEditor extends React.Component<IAppProps, IAppState> {
  private editorRef: any;
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
    this.editorRef = React.createRef();
  }

  onKeyDown = (event, editor, next) => {
    switch (event.key) {
      case KEY_ENTER:
        return onEnter(event, editor, next);
      case KEY_DASH:
        return onDash(event, editor, next);
      case KEY_BACKSPACE:
        return onBackspace(event, editor, next);
    }
    return next();
  };

  _printNode = (nodes, depth) => {
    if (nodes) {
      const newDepth = depth + 2;
      const padding = new Array(depth + 1).join(" ");
      nodes.forEach(node => {
        if (node.object === "text") {
          const text = node.text ? node.text : "<empty>";
          console.log(padding, text);
          console.log(padding, node.toJSON({ preserveKeys: true }));

          return;
        }
        console.log(padding, node.toJSON({ preserveKeys: true }));

        if (node.object !== "text") this._printNode(node.nodes, newDepth);
        else this._printNode(node.leaves, newDepth);
      });
    }
  };

  printDebug = (e: any) => {
    console.log(this.editorRef.current);
    const document = this.editorRef.current.value
      ? this.editorRef.current.value.document
      : undefined;
    if (document) {
      console.log(" ========= Document nodes =========");
      console.log(document.toJSON({ preserveKeys: true }));
      document.nodes.forEach(node => {
        console.log("---");
        console.log(node.toJSON({ preserveKeys: true }));
        this._printNode(node.nodes, 3);
      });
      //console.log(document && document.toJSON());
    }
  };

  public render() {
    return (
      <div>
        <button onClick={this.printDebug}>Debug</button>
        <Editor
          ref={this.editorRef}
          autoFocus={true}
          placeholder="Enter a title..."
          defaultValue={initialValue}
          schema={schema}
          renderNode={this.renderNode}
          onKeyDown={this.onKeyDown}
        />
      </div>
    );
  }

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props;
    //console.log("#children", node.type, children);
    //console.log("##", node.type, attributes, node);

    switch (node.type) {
      case "title":
        return (
          <Typography
            {...attributes}
            variant="h3"
            color="textPrimary"
            gutterBottom
            style={{ zIndex: 2000, fontFamily: "serif" }}
          >
            {children}
          </Typography>
        );
      case "overview":
        return (
          <Typography
            variant="h5"
            color="textPrimary"
            gutterBottom
            style={{ zIndex: 2000, fontFamily: "serif" }}
          >
            {children}
          </Typography>
        );
      case "description":
        return <p {...attributes}>{children}</p>;
      case "list":
        return <div {...attributes}>{children}</div>;
      case "entry":
        return (
          <div
            {...attributes}
            style={{
              marginTop: "2px",
              padding: "2px",
              backgroundColor: "#b3e5fc"
            }}
          >
            {children}
          </div>
        );
      case "location":
        return <h3 {...attributes}>{children}</h3>;
      default:
        return next();
    }
  };
}

const initialValueAsJson = require("./value.json");

const initialValue = Value.fromJSON(initialValueAsJson);

//const node_map = ["title", "overview", "list"];
const schema: any = {
  document: {
    nodes: [
      { match: { type: "title" }, min: 1, max: 1 },
      { match: { type: "overview" } },
      { match: { type: "list" }, min: 0, max: 1 }
    ],
    normalize: (editor, { code, node, child, index }) => {
      console.log("##normalize document ", code, node, child, index);
      switch (code) {
        case "child_type_invalid": {
          //const type = node_map[index];
          //return editor.setNodeByKey(child.key, type);
          break;
        }
        case "child_min_invalid": {
          return;
        }
      }
    }
  },
  blocks: {
    list: {
      nodes: [{ match: { type: "entry" }, min: 1 }],
      normalize: (editor, { code, node, child, index }) => {
        //const node_map = ["location", "description"];
        console.log("##normalize list ", code, node, child, index);
      }
    },
    entry: {
      parent: "list",
      first: { type: "location" },
      nodes: [
        { match: { type: "location" }, min: 1, max: 1 },
        { match: { type: "description" }, min: 1 }
      ],

      normalize: (editor, { code, node, child, index }) => {
        const node_map = ["location", "description"];

        console.log("##normalize entry ", code, node, child, index);
        switch (code) {
          case "child_type_invalid": {
            const type = node_map[index];
            return editor.setNodeByKey(child.key, type);
          }
          case "child_min_invalid": {
            var block = Block.create(node_map[index]);
            return editor.insertNodeByKey(node.key, index, block);
          }
        }
      }
    }
  }
};

export default SmartEditor;
