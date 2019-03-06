import * as React from "react";
import { Toolbar, IconButton, Tooltip } from "@material-ui/core";
import { CloseRounded } from "@material-ui/icons";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import classnames from "classnames";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginTop: 2,
      marginLeft: -theme.spacing.unit * 3,
      paddingLeft: theme.spacing.unit * 3,
      paddingRIght: theme.spacing.unit * 3,
      padding: 2
    },
    hover: {
      backgroundColor: "#eeeeee"
    },
    toolbar: {
      marginRight: theme.spacing.unit * 3,
      borderRadius: 8,
      border: "thin solid #e0e0e0",
      marginTop: -20,
      float: "right",
      background: "white"
      //   justifyContent: "space-beween"
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
    const { attributes, children, classes } = this.props;
    const { hoverClass } = this.state;
    return (
      <div
        {...attributes}
        className={classnames(classes.root, hoverClass)}
        onMouseOver={this.mouseOver}
        onMouseLeave={this.mouseLeave}
      >
        {hoverClass && (
          <Toolbar className={classes.toolbar}>
            <Tooltip title="Add a new location" aria-label="Add a new location">
              <IconButton
                className={classes.menuButton}
                aria-label="New entry"
                onClick={this.onAdd}
              >
                ==
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Delete this location"
              aria-label="Add a new location"
            >
              <IconButton
                className={classes.menuButton}
                aria-label="Delete"
                onClick={this.onDelete}
              >
                <CloseRounded />
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
