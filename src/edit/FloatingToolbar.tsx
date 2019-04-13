import * as React from "react";
import { Portal, IconButton } from "@material-ui/core";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import classnames from "classnames";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingRight: theme.spacing.unit * 2,
      paddingLeft: theme.spacing.unit * 2,
      position: "absolute",
      zIndex: 1,
      top: "-10000px",
      left: "-10000px",
      marginTop: "-6px",
      opacity: 0,
      backgroundColor: "#222",
      borderRadius: "4px",
      transition: "opacity 0.5s"
    },
    icon: {
      color: "#fafafa",
      padding: theme.spacing.unit
    },
    iconActive: {
        color: "#4caf50",
    }
  });

export interface IAppProps {
  classes?: any;
  editor: any;
  toolbarProps: {
    visible: boolean;
    rect: any;
  };
}

export interface IAppState {}

class FloatingToolbar extends React.Component<IAppProps, IAppState> {
  private ref: any;

  constructor(props: IAppProps) {
    super(props);

    this.state = {
      toolbarProps: {
        visible: false,
        rect: undefined
      }
    };
    this.ref = React.createRef();
  }

  public render() {
    const { classes, toolbarProps } = this.props;
    const root = window.document.getElementById("root");
    return (
      <Portal container={root}>
        <div
          ref={ref => (this.ref = ref)}
          className={classes.root}
          style={this.calculatePosition(toolbarProps)}
        >
          {this.renderMarkButton("bold", <Bold_Icon />, classes)}
          {this.renderMarkButton("italic", <Italic_Icon />, classes)}
        </div>
      </Portal>
    );
  }

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
    return (
      <IconButton
        className={classnames(classes.icon, isActive ? classes.iconActive : "")}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        {icon}
      </IconButton>
    );
  };

  onClickMark = (event, type) => {
    const { editor } = this.props;
    event.preventDefault();
    editor.toggleMark(type);
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
const Italic_Icon = () => <Icon_Base italic={true} >i</Icon_Base>;

export default withStyles(styles)(FloatingToolbar);
