import * as React from "react";
import { Toolbar, IconButton, Tooltip } from "@material-ui/core";
import { CloseRounded } from "@material-ui/icons";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import classnames from "classnames";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      zIndex: 2500,
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2,
      padding: theme.spacing.unit * 2,
      boxSizing: "border-box",
      border: "2px dashed #b2ebf2"
    },
    hover: {
      backgroundColor: "#f5f5f5"
    },
    active: {
      border: "none",
      boxShadow: "1px 2px 4px 2px gray"
    },
    suggestion: {
      marginTop: -38,
      marginLeft: -theme.spacing.unit,
      borderRadius: 4,
      padding: theme.spacing.unit,
      border: "thin solid #e0e0e0",
      float: "left",
      background: "#e0f7fa"
    },
    toolbar: {
      marginRight: theme.spacing.unit,
      borderRadius: 4,
      border: "thin solid #e0e0e0",
      marginTop: -28,
      float: "right",
      background: "white"
    },
    menuButton: {
      border: "thin",
      marginRight: theme.spacing.unit
    }
  });

export interface IAppProps {
  classes?: any;
  attributes: any;
  editor: any;
  handlers: {
    onDelete: (key: number) => void;
    onAdd: (key: number) => void;
  };
}

export interface IAppState {
  hoverClass: any;
}

class Entry extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      hoverClass: undefined
    };
  }

  public render() {
    const { attributes, children, classes, editor } = this.props;
    const { hoverClass } = this.state;
    //const focusBlock = editor.value.focusBlock;
    // parent is "this" entry
    const parentOfinFocus = editor.value.document.getParent(
      editor.value.focusBlock.key
    );

    const active = parentOfinFocus.key === attributes["data-key"];

    const emptyLocationText =
      editor.value.focusBlock.getFirstText().text.trim() === "";

    return (
      <div
        {...attributes}
        className={classnames(
          classes.root,
          hoverClass,
          active ? classes.active : ""
        )}
        onMouseOver={this.mouseOver}
        onMouseLeave={this.mouseLeave}
      >
        {emptyLocationText && active && (
          <span className={classes.suggestion} contentEditable={false}>
            Type a location (Ex. Portland) and hit Enter
          </span>
        )}
        {hoverClass && (
          <Toolbar className={classes.toolbar} contentEditable={false}>
            <Tooltip
              title="Delete this location"
              aria-label="Delete thiS location"
            >
              <IconButton
                className={classes.menuButton}
                aria-label="Delete"
                onClick={this.onDelete}
              >
                <CloseRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          </Toolbar>
        )}
        <div style={{ clear: "left" }}>{children}</div>
      </div>
    );
  }

  mouseOver = (event: any) =>
    this.setState({ hoverClass: this.props.classes.hover });

  mouseLeave = (event: any) => this.setState({ hoverClass: undefined });

  onAdd = (event: any) => {
    const key = this.props.attributes["data-key"];
    this.props.handlers.onAdd(key);
  };

  onDelete = (event: any) => {
    const key = this.props.attributes["data-key"];
    this.props.handlers.onDelete(key);
  };
}

export default withStyles(styles)(Entry);
