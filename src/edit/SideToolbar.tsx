import * as React from "react";
import { IconButton, Tooltip, Portal } from "@material-ui/core";
import {
  AddCircleOutlined,
  CancelOutlined,
  PhotoCameraOutlined,
  LocationOnRounded,
} from "@material-ui/icons";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import classnames from "classnames";
import ImageUploadButton from "./ImageUploadButton";

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
  openPhotoDialog: boolean;
}

class SideToolbar extends React.Component<SideToolbarProps, S> {
  constructor(props: SideToolbarProps) {
    super(props);
    this.state = { collapse: true, openPhotoDialog: false };
  }
  toggle = () => this.setState({ collapse: !this.state.collapse });

  render() {
    const { classes, editor, dataKey, handlers } = this.props;
    const { collapse } = this.state;
    const focusBlock = editor.value.focusBlock;
    if (!focusBlock) {
      return null;
    }
    const text = focusBlock.nodes.first().getFirstText().text;
    if (focusBlock.key !== dataKey || text) {
      // only show toolbar at focus and empty node
      return null;
    }
    return (
      <>
        {/* {this.state.openPhotoDialog && (
          <Portal container={this.props.editor}>
            <UploadDialog onClose={this.onUploadDlgClose} />
          </Portal>
        )} */}
        <div className={classes.toolFab} contentEditable={false}>
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
          {!collapse &&
            ToolbarExpanded(classes, this.toggle, this.onUploadDlgOpen, handlers, dataKey)}
        </div>
      </>
    );
  }

  onUploadDlgClose = () => this.setState({ openPhotoDialog: false });
  onUploadDlgOpen = () =>
    this.setState({ openPhotoDialog: true, collapse: true });
}
const ToolbarExpanded = (classes, toggle, insertImageClick, handlers, dataKey) => {
  return (
    <div className={classnames(classes.root, classes.active)}>
      <Tooltip title="Add a location card" aria-label="Add a location card">
        <IconButton
          className={classes.menuButton}
          aria-label="New entry"
          onClick={() => {
            toggle();
            handlers.onAdd(dataKey);
          }}
        >
          <LocationOnRounded fontSize="large"/>
        </IconButton>
      </Tooltip>
      <ImageUploadButton classes={classes} onUploaded={(file)=>{
            toggle();
            handlers.insertImage(dataKey, file);
        }}>
      </ImageUploadButton>
    </div>
  );
};

export default withStyles(styles)(SideToolbar);
