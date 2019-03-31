import * as React from "react";
import { Editor } from "slate-react";
import { Block, Value } from "slate";
import { FeatureCollection2 } from "@mappandas/yelapa";
import * as _ from "underscore";

import placeholderPlugins from "./placeholders";

import * as F from "./Factory";

import onEnter from "./onEnter";
import onDash from "./onDash";
import onBackspace from "./onBackspace";
import * as ToolbarHandler from "./handlers/toolbarHander";
import SideToolbar from "./SideToolbar";
import { geocoderLookupAndCache, toGeojson } from "./handlers/deserializers";

import {
  Title,
  Overview,
  Entry,
  Location,
  Description,
  Image,
  Caption,
  Figure
} from "./slate-views";

export interface IAppProps {
  uuid: string;
  onLocationUpdate: (fc: FeatureCollection2, options?: any) => void;
}

export interface IAppState {
  value: any;
  openPhotoDialog: boolean;
}

//const existingValue = localStorage.getItem("content");

const KEY_ENTER = "Enter";
const KEY_DASH = "=";
const KEY_BACKSPACE = "Backspace";

const plugins = placeholderPlugins;

class SmartEditor extends React.Component<IAppProps, IAppState> {
  private editorRef: any;
  private toolbarHandler: any;
  constructor(props: IAppProps) {
    super(props);

    this.state = { value: initialValue, openPhotoDialog: false };
    this.editorRef = React.createRef();
  }

  setRef = ref => {
    this.editorRef = ref;
    if (!ref) return;
    this.toolbarHandler = ToolbarHandler.create(
      this.props.uuid,
      this.props.onLocationUpdate,
      this.editorRef
    );
  };

  onKeyDown = (event, editor, next) => {
    //const { onEntryUpdate } = this.props;
    const args = { event, editor, next, onEntryUpdate: this._onEntryUpdate };
    switch (event.key) {
      case KEY_ENTER:
        return onEnter(args);
      case KEY_DASH:
        return onDash(event, editor, next);
      case KEY_BACKSPACE:
        return onBackspace(event, editor, next);
    }
    return next();
  };

  _onEntryUpdate = data => {
    const editor = this.editorRef;
    if (editor) {
      geocoderLookupAndCache(data, this.editorRef)
        .then(f => {
          const fc = toGeojson(this.props.uuid, editor.value);
          console.log();
          this.props.onLocationUpdate(fc, { shouldUpdateView: true });
        })
        .catch(e => null);
    }
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

  onChange = (event, editor) => {
    const { value } = event;
    // console.log(" ===== onChange() ===== ");
    // console.log("  ", event);
    // console.log("  operation", event.operations.toJSON());
    // console.log("   focusBlock", event.value.focusBlock.toJSON());
    // console.log("    selection", this.editorRef.selection);
    // console.log(" ====================== ");

    // Check to see if the document has changed before saving.
    if (value.document != this.state.value.document) {
      this.props.onLocationUpdate(toGeojson(this.props.uuid, value));
      const content = JSON.stringify(value.toJSON());
      localStorage.setItem("content", content);
    }

    this.setState({ value });
  };

  printDebug = (e: any) => {
    const document = this.editorRef.value
      ? this.editorRef.value.document
      : undefined;
    if (document) {
      console.log(" ========= Document nodes =========");
      console.log(document.toJSON({ preserveKeys: true }));
      document.nodes.forEach(node => {
        console.log("---");
        console.log(node.toJSON({ preserveKeys: true }));
        this._printNode(node.nodes, 3);
      });
    }
  };

  printSelection = (e: any) => {
    const selection = this.editorRef.value
      ? this.editorRef.value.selection
      : undefined;
    if (selection) {
      console.log(" ");
      console.log(" ========= Document nodes =========");
      console.log("   ", selection.toJSON());
    }
  };

  componentDidMount() {
    // this.timer = setInterval(() => {
    //   this.props.onLocationUpdate(
    //     toGeojson(this.props.uuid, this.editorRef.value)
    //   );
    // }, 3500);
  }

  componentWillUnmount() {
    //  clearInterval(this.timer);
  }

  public render() {
    return (
      // <button onClick={this.printSelection}>Selection</button>

      //<button onClick={this.printDebug}>Document</button>
      <Editor
        ref={this.setRef}
        autoFocus={true}
        defaultValue={this.state.value}
        schema={schema}
        plugins={plugins}
        renderNode={this.renderNode}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
        onFocus={event => {
          //console.log("#onFocus() ", event);
        }}
      />
    );
  }

  renderNode = (props, editor, next) => {
    const { attributes, children, node, isFocused } = props;

    const sideToolbar = (
      <SideToolbar
        key={attributes["data-key"]}
        editor={editor}
        dataKey={attributes["data-key"]}
        handlers={this.toolbarHandler}
      />
    );
    switch (node.type) {
      case "title":
        return (
          <Title
            attributes={attributes}
            children={children}
            sideToolbar={sideToolbar}
          />
        );
      case "overview":
        return (
          <Overview
            attributes={attributes}
            children={children}
            sideToolbar={sideToolbar}
          />
        );
      case "description":
        return (
          <Description
            attributes={attributes}
            children={children}
            sideToolbar={sideToolbar}
          />
        );
      case "card":
        return (
          <Entry
            attributes={attributes}
            children={children}
            handlers={this.toolbarHandler}
            editor={this.editorRef}
          />
        );
      case "location":
        return <Location attributes={attributes} children={children} />;
      case "image": {
        const url = node.data.get("url");
        const src = url ? url : node.data.get("src");
        return (
          <Image
            src={src}
            isSelected={isFocused}
            attributes={attributes}
            children={children}
          />
        );
      }
      case "figure":
        return <Figure attributes={attributes} children={children} />;

      case "caption":
        return <Caption attributes={attributes} children={children} />;

      default:
        return next();
    }
  };
}

const initialValueAsJson = require("./value.json");

// const initialValue = existingValue
//   ? Value.fromJSON(JSON.parse(existingValue))
//   : Value.fromJSON(initialValueAsJson);
const initialValue = Value.fromJSON(initialValueAsJson);
//const node_map = ["title", "overview", "list"];
const schema: any = {
  document: {
    last: { type: "overview" },

    // nodes: [
    // //   { match: { type: "title" }, min: 1, max: 1 },
    //   //{ match: { type: "overview" } },
    //   //{ match: { type: "list" }, min: 0, max: 1 }
    // ],
    normalize: (editor, { code, node, child, index }) => {
      console.log("##normalize document ", code, node, child, index);
      switch (code) {
        // case "child_min_invalid": {
        //   var title = Block.create("title");
        //   return editor.insertNodeByKey(node.key, index, title).focus();
        // }
        case "last_child_type_invalid": {
          const block = F.createOverview();
          return editor.insertNodeByKey(node.key, node.nodes.size, block);
        }
      }
    }
  },
  blocks: {
    figure: {
      nodes: [
        { match: { type: "image" }, min: 1, max: 1 },
        { match: { type: "caption" }, min: 1, max: 1 }
      ],
      normalize: (editor, { code, node, child, index }) => {
        console.log("##normalize figure", code, node, child, index);
        //   switch (code) {
        //     case "child_max_invalid": {
        //       return editor.splitBlock(2);
        //     }
        //   }
      }
    },
    image: {
      isVoid: true
    },
    card: {
      nodes: [
        { match: { type: "location" }, min: 1, max: 1 },
        { match: { type: "description" }, min: 1 }
      ],
      next: {
        type: "overview"
      },

      normalize: (editor, { code, node, child, index }) => {
        const node_map = ["location", "description"];

        console.log("##normalize location card ", code, node, child, index);
        switch (code) {
          case "child_type_invalid": {
            const type = node_map[index];
            return editor.setNodeByKey(child.key, type);
          }
          case "child_min_invalid": {
            var block = Block.create(node_map[index]);
            return editor.insertNodeByKey(node.key, index, block);
            //return editor;
          }
          case "next_sibling_type_invalid": {
            var block = F.createOverview();
            console.log("## ", node.toJS());
            return editor.insertNodeByKey(node.key, index+1, block);          }
          case "child_max_invalid": {
            return editor;
          }
        }
      }
    }
  }
};

export default SmartEditor;
