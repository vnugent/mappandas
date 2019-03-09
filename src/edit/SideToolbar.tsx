import * as React from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import {
  AddCircleOutlined,
  CancelOutlined,
  PhotoCameraOutlined
} from "@material-ui/icons";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import classnames from "classnames";

const styles = (theme: Theme) =>
  createStyles({
    toolFab: {
      position: "absolute",
      display: "flex",
      zIndex: 1000,
      marginLeft: -theme.spacing.unit * 8.5,
      marginTop: -12
    },
    active: {
        background: "rgba(255,255,255,0.85)",
        borderRadius: 5,
        padding: 2
    }
  });
export interface SideToolbarProps {
  classes: any;
  editor: any;
  dataKey: number;
  handlers: {
    onAdd: (key: number) => void;
    onDelete: (key: number) => void;

  };
}

interface S {
  collapse: boolean;
}

class SideToolbar extends React.Component<SideToolbarProps, S> {
  constructor(props: SideToolbarProps) {
    super(props);
    this.state = { collapse: true };
  }
  toggle = () => this.setState({ collapse: !this.state.collapse });

  render() {
    const { classes, editor, dataKey, handlers } = this.props;
    const { collapse } = this.state;
    const focusBlock = editor.value.focusBlock;
    const text = focusBlock.nodes.first().getFirstText().text;
    if (focusBlock.key !== dataKey || text) {
      // only show toolbar at focus and empty node
      return null;
    }
    return (
      <div
        className={classes.toolFab}
        contentEditable={false}
      >
        <Tooltip
          title="Add a new location or image "
          aria-label="Add a new location or image"
          placement="bottom-end"
        >
          <IconButton color="secondary" onClick={this.toggle}>
            {collapse ? (
              <AddCircleOutlined fontSize="large" />
            ) : (
              <CancelOutlined fontSize="large" />
            )}
          </IconButton>
        </Tooltip>
        {!collapse && ToolbarExpanded(classes, this.toggle, handlers, dataKey)}
      </div>
    );
  }
}
const ToolbarExpanded = (classes, toggle, handlers, dataKey) => {
  return (
    <div className={classnames(classes.root, classes.active)}
    >
      <Tooltip title="Add a location to the map" aria-label="Add a new location">
        <IconButton
          className={classes.menuButton}
          aria-label="New entry"
          onClick={() => {
              console.log("#add new clicked");
              //toggle();
              handlers.onAdd(dataKey)}}
        >
          ==
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Add an image - coming soon!"
        aria-label="Add an image - coming soon!"
      >
        <IconButton
          className={classes.menuButton}
          aria-label="Add an image"
        >
          <PhotoCameraOutlined fontSize="large" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default withStyles(styles)(SideToolbar);
