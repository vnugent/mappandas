import * as React from "react";
import { Portal, IconButton, InputBase } from "@material-ui/core";
import { Link } from "@material-ui/icons";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import classnames from "classnames";
import * as _ from "underscore";
import { isValueObject } from "immutable";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingRight: theme.spacing.unit * 2,
      paddingLeft: theme.spacing.unit * 2,
      position: "absolute",
      height: "40px",
      zIndex: 1,
      top: "-10000px",
      left: "-10000px",
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
    },
    iconDisabled: {
      cursor: "not-allowed",
      color: "grey",
      pointerEvents: "none"
    }
  });

export interface IAppProps {
  classes?: any;
  editor: any;
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
    const { showUrlInput } = this.state;
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
              onBlur={this.processInput}
              onEnter={this.processInput}
            />
          ) : (
            <>
              {this.renderFormatButton("bold", <Bold_Icon />, classes)}
              {this.renderFormatButton("italic", <Italic_Icon />, classes)}
              {this.renderFormatButton(
                "link",
                <Link />,
                classes,
                this.onClickUrl
              )}
            </>
          )}
        </div>
      </Portal>
    );
  }

  /**
   * Hide URL Input box.  Supply a function to be run synchronously after hiding
   */
  hideUrlInput = postFn => {
    const { editor, toolbarProps } = this.props;
    this.setState({ showUrlInput: false }, postFn);
  };

  reselectText = () => {
    const { editor, toolbarProps } = this.props;
    _.delay(() => {
      editor.select(toolbarProps.selection);
    }, 200);
  };

  processInput = value => {
    const { editor, toolbarProps } = this.props;

    if (value.length === 0) {
      this.hideUrlInput(this.reselectText);
    } else {
      this.hideUrlInput(() => {
        editor
          .select(toolbarProps.selection)
          .command("wrapLink", value)
          .moveToEnd();
      });
    }
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

  renderFormatButton = (
    type,
    icon,
    classes,
    onClick?: (event, type, hasLink) => void
  ) => {
    const { editor } = this.props;
    const { value } = editor;
    const shouldDisableLink = this.shouldDisableLink(type);
    var isActive = false;
    try {
      isActive = value.activeMarks.some(mark => mark.type === type);
    } catch (error) {
        //TODO handle https://github.com/ianstormtaylor/slate/issues/2701
    }
    const hasLink =
      type === "link" &&
      value.inlines &&
      value.inlines.some(node => node.data && node.data.has("url"));

    return (
      <IconButton
        className={classnames(
          classes.icon,
          isActive || hasLink ? classes.iconActive : "",
          shouldDisableLink ? classes.iconDisabled : ""
        )}
        onMouseDown={event =>
          onClick
            ? onClick(event, type, hasLink)
            : this.onClickFormat(event, type)
        }
      >
        {icon}
      </IconButton>
    );
  };

  shouldDisableLink = type => {
    const { editor } = this.props;
    const { value } = editor;
    const { fragment } = value;
    return (
      type === "link" &&
      value.focusBlock &&
      (value.focusBlock.type === "location" ||
        this.multipleParagraphsSelected(fragment))
    );
  };

  multipleParagraphsSelected = fragment => {
    const { nodes } = fragment;
    if (
      nodes.size > 1 &&
      nodes.some(node => node.type === "card" || node.type === "figure")
    ) {
      return true;
    }

    if (nodes.size === 1) {
      const topLevelNode = nodes.first();
      if (topLevelNode.type === "card") {
        if (topLevelNode.nodes.some(node => node.type === "location")) {
          return true;
        } else {
          return false;
        }
      }
    }

    if (fragment.text.length > 500) {
      // too much text
      return true;
    }

    return false;
  };

  firstLine = () => {
    const { editor } = this.props;
    const { value } = editor;
    const lineIndex = editor.value.document.nodes.indexOf(value.focusBlock);
    return lineIndex === 0 ? true : false;
  };

  onClickFormat = (event, type) => {
    event.preventDefault();

    const { editor } = this.props;
    editor.toggleMark(type);
  };

  onClickUrl = (event, type, hasLink: boolean) => {
    if (type !== "link") {
      return;
    }
    event.preventDefault();

    if (hasLink) {
      this.props.editor.unwrapInline("link");
    } else {
      this.setState({ showUrlInput: true });
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
      <InputBase
        autoFocus={true}
        onBlur={() => onBlur(this.state.value)}
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
