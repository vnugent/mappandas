import * as React from "react";
import { Portal, IconButton, Input } from "@material-ui/core";
import { Link } from "@material-ui/icons";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import classnames from "classnames";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingRight: theme.spacing.unit * 2,
      paddingLeft: theme.spacing.unit * 2,
      position: "absolute",
      height: "40px",
      zIndex: 1,
      top: "500px",
      left: "500px",
      marginTop: "-6px",
      opacity: 0,
      backgroundColor: "#222",
      borderRadius: "6px",
      transition: "opacity 0.5s",
      display: "flex"
    },
    urlInput: {
      color: "#fafafa",
      //padding: theme.spacing.unit,
      margin: 0
    },
    icon: {
      color: "#fafafa",
      margin: 0,
      padding: theme.spacing.unit
    },
    iconActive: {
      color: "#4caf50"
    }
  });

export interface IAppProps {
  classes?: any;
  editor: any;
  onLinkToolbarClick: () => void;
  toolbarProps: {
    visible: boolean;
    showUrlInput: boolean;
    rect: any;
    selection: any;
  };
}

export interface IAppState {
  showUrlInput: boolean;
}

class FloatingToolbar extends React.Component<IAppProps, IAppState> {
  ref = React.createRef() as any | null;

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      showUrlInput: false
    };
  }

  public render() {
    const { classes, toolbarProps, editor } = this.props;
    const root = window.document.getElementById("root");
    const { showUrlInput, visible } = toolbarProps;
    console.log("floating", visible, showUrlInput);
    return (
      <Portal container={root}>
        <div
          ref={ref => (this.ref = ref)}
          className={classes.root}
          style={this.calculatePosition(toolbarProps)}
        >
          {showUrlInput ? (
            <UrlInput
              classes={classes}
              editor={editor}
              onBlur={this.onBlur}
              onEnter={this.onLinkEnter}
            />
          ) : (
            <>
              {this.renderMarkButton("bold", <Bold_Icon />, classes)}
              {this.renderMarkButton("italic", <Italic_Icon />, classes)}
              {this.renderMarkButton("link", <Link />, classes)}{" "}
            </>
          )}
        </div>
      </Portal>
    );
  }

  onBlur = event => this.props.onLinkToolbarClick();

  onLinkEnter = value => {
    this.props.onLinkToolbarClick();
  };

  calculatePosition = p => {
    const { rect, visible } = p;
    if (!visible) return {};
    return {
      opacity: 1,
      top: `${rect.top + window.pageYOffset - this.ref.offsetHeight}px`,
      left: `${rect.left +
        window.pageXOffset -
        this.ref.offsetWidth / 2 +
        rect.width / 2}px`
    };
  };

  renderMarkButton = (type, icon, classes) => {
    const { editor } = this.props;
    const { value } = editor;
    const isActive = value.activeMarks.some(mark => mark.type === type);
    const isLink =
      type === "link" &&
      value.focusBlock &&
      value.focusBlock.nodes.some(node => node.data && node.data.has("url"));

    return (
      <IconButton
        className={classnames(
          classes.icon,
          isActive || isLink ? classes.iconActive : ""
        )}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        {icon}
      </IconButton>
    );
  };

  onClickMark = (event, type) => {
    const { editor } = this.props;
    event.preventDefault();
    if (type === "link") {
      editor.toggleMark(type);
      this.props.onLinkToolbarClick();
    } else {
      editor.toggleMark(type);
    }
  };
}

class UrlInput extends React.Component<
  {
    classes: any;
    editor: any;
    onBlur: (event) => void;
    onEnter: (value) => void;
  },
  { value: string }
> {
  state = {
    value: ""
  };

  render() {
    const { classes, onBlur } = this.props;
    return (
      <Input
        autoFocus={true}
        onBlur={onBlur}
        className={classes.urlInput}
        value={this.state.value}
        placeholder="Paste or type a link ..."
        inputProps={{
          "aria-label": "Link"
        }}
        onChange={this.handleChange}
        onKeyPress={this.handleKeyPress}
      />
    );
  }
  handleChange = event => this.setState({ value: event.target.value });

  handleKeyPress = event => {
    const code = event.keyCode || event.charCode;
    if (code === 13) {
      event.stopPropagation();
      this.props.onEnter(this.state.value);
    }
  };
}

const Icon_Base = props => (
  <span
    style={{
      fontFamily: "Georgia,serif",
      fontSize: "1em",
      fontWeight: "bold",
      fontStyle: props.italic ? "italic" : "normal"
    }}
  >
    {props.children}
  </span>
);

const Bold_Icon = () => <Icon_Base>B</Icon_Base>;
const Italic_Icon = () => <Icon_Base italic={true}>i</Icon_Base>;

export default withStyles(styles)(FloatingToolbar);
