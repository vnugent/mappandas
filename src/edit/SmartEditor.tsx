import * as React from "react";
import { Editor } from "slate-react";
import { Block, Value } from "slate";
import { Typography } from "@material-ui/core";

import onEnter from "./onEnter";
import onDash from "./onDash";

export interface IAppProps {}

export interface IAppState {}

const KEY_ENTER = "Enter";
const KEY_DASH = "-";

class SmartEditor extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  onKeyDown = (event, editor, next) => {
    switch (event.key) {
      case KEY_ENTER:
        return onEnter(event, editor, next);
      case KEY_DASH:
        return onDash(event, editor, next);
    }
    return next();
  };

  public render() {
    return (
      <Editor
        placeholder="Enter a title..."
        defaultValue={initialValue}
        schema={schema}
        renderNode={this.renderNode}
        onKeyDown={this.onKeyDown}
      />
    );
  }

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props;
    //console.log("#children", node.type, children);
    console.log("##", node.type, attributes, node);

    switch (node.type) {
      case "title":
        return (
          <div {...attributes}>
            <Typography
              variant="h4"
              color="textPrimary"
              gutterBottom
              style={{ zIndex: 2000 }}
            >
              {children}
            </Typography>
            {node.text === "" && (
              <div
                {...attributes}
                style={{
                  marginTop: "-35px",
                  marginLeft: "8px",
                  pointerEvents: "none"
                }}
              >
                Title
              </div>
            )}
          </div>
        );
      case "overview":
        return (
          <Typography
            variant="subtitle2"
            color="textSecondary"
            gutterBottom
            {...attributes}
          >
            {children}
          </Typography>
        );
      case "description":
        return <p {...attributes}>{children}</p>;
      case "entry":
        return (
          <div style={{ backgroundColor: "#fcf0f0" }} {...attributes}>
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

const node_map = ["title", "overview", "entry"];
const schema: any = {
  document: {
    nodes: [
      { match: { type: "title" }, min: 1, max: 1 },
      { match: { type: "overview" }, min: 1 },
      { match: { type: "entry" }, min: 0, max: 1 }
    ],
    blocks: {
      entry: {
        nodes: [
          { match: { type: "location" }, min: 1, max: 1 },
          { match: { type: "description" }, min: 1 }
        ]
      }
    },
    normalize: (editor, { code, node, child, index }) => {
      console.log("##normalize ", code, node, child, index);
      switch (code) {
        case "child_type_invalid": {
          const type = node_map[index];
          return editor.setNodeByKey(child.key, type);
        }
        case "child_min_invalid": {
          const block = Block.create(node_map[index]);
          return editor.insertNodeByKey(block.key, index, block);
        }
        // case "child_max_invalid": {
        //   // const type = node_map[index];
        //   // return editor.removeNodeByKey(child.key, type);
        //   const nodes = node.nodes;
        //   const overview = nodes.find(v => v.type === "overview");
        //   const textNode = overview.getFirstText();
        //   return editor.moveToRangeOfNode(textNode);
        //   textNode.focus();
        //   console.log("overview", textNode);
        //  const list = node.nodes;
        //   list.forEach(item => {
        //     console.log("   documents", item);
        //   });
        //   const div = document.getElementById("overview");
        //   console.log(div);
        //   if (div) div.focus();
        //const { value } = editor;
        // const { selection } = value;
        // const { start, end, isExpanded } = selection;

        // console.log("     value, selection", value, selection, start, end, isExpanded);
        //return editor.moveTo(1);
        //return editor.setNodeByKey(ch)
        //}
      }
    }
  }
};

export default SmartEditor;
