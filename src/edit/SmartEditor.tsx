import * as React from "react";
import { Editor } from "slate-react";
import { Value } from "slate";
import { FeatureCollection2 } from "@mappandas/yelapa";
import * as _ from "underscore";

import schema from "./schema";

import placeholderPlugins from "./placeholders";

import onEnter from "./onEnter";
import onDash from "./onDash";
import onBackspace from "./onBackspace";
import * as ToolbarHandler from "./handlers/toolbarHander";
import SideToolbar from "./SideToolbar";
import { toGeojson } from "./handlers/deserializers";
import { LocationPlugin } from "./plugins";
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
  content: any;
  readonly: boolean;
  onLocationUpdate: (location, editor) => void;
  onContentChange: (content) => void;
}

export interface IAppState {}

const KEY_ENTER = "Enter";
const KEY_DASH = "=";
const KEY_BACKSPACE = "Backspace";

class SmartEditor extends React.Component<IAppProps, IAppState> {
  private timer: any;
  private editorRef: any;
  private toolbarHandler: any;
  private plugins: any;

  constructor(props: IAppProps) {
    super(props);

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
    const args = { event, editor, next };
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

  onChange = ({ value }, editor) => {
    if (this.props.readonly) return;
    this.props.onContentChange(value);
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
    this.timer = setInterval(this.saveDraft, 12000);
    if (!this.props.readonly) {
      const locationPlugin = LocationPlugin({
        handler: this.props.onLocationUpdate
      });
      this.plugins = [locationPlugin, placeholderPlugins];
    }
    //   this.props.onLocationUpdate(
    //     toGeojson(this.props.uuid, this.editorRef.value)
    //   );
    // }, 3500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  public render() {
    if (!this.props.content) return null;
    return (
      // <button onClick={this.printSelection}>Selection</button>

      //<button onClick={this.printDebug}>Document</button>
      <Editor
        ref={this.setRef}
        readOnly={this.props.readonly}
        autoFocus={true}
        value={this.props.content}
        schema={schema}
        plugins={this.plugins}
        renderNode={this.renderNode}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
        onFocus={event => {}}
      />
    );
  }

  renderNode = (props, editor, next) => {
    const { attributes, children, node, isFocused } = props;
    const sideToolbar = !this.props.readonly && (
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
            node={node}
            editor={editor}
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
            readonly={this.props.readonly}
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
            readonly={this.props.readonly}
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

  saveDraft = () => {
    // no op at the moment
  };
}

export default SmartEditor;
