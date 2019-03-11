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
      padding: theme.spacing.unit * 2,
      boxSizing: "border-box"
    },
    hover: {
      backgroundColor: "#f5f5f5"
    },
    active: {
      border: "1px dashed #b2ebf2"
    },
    toolbar: {
      marginRight: theme.spacing.unit,
      borderRadius: 8,
      border: "thin solid #e0e0e0",
      marginTop: -28,
      float: "right",
      background: "white"
    },
    menuButton: {
      //   flexGrow: 1,
      border: "thin",
      marginRight: 10
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

    const parentOfinFocus = editor.value.document.getParent(
      editor.value.focusBlock.key
    );
    console.log("## parent focus", parentOfinFocus);

    const active = parentOfinFocus.key === attributes["data-key"];

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
        {children}
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
