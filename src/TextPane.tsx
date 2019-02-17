import * as React from "react";
import {
  AppBar,
  Button,
  Toolbar,
  //   Tooltip,
  withStyles
} from "@material-ui/core";
import { FeatureCollection2 } from "@mappandas/yelapa";

import CardEditorWithPreview from "./panda/CardEditorWithPreview";

const styles = theme => ({
  root: { display: "flex", height: "100%" },
  grow: {
    flexGrow: 1
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2000
  },
  mainAction: {
    display: "flex"
  },
  appBar: {
    boxShadow: "none",
    backgroundColor: "transparent",
    zIndex: 1000,
    marginBottom: 20,
  }
});

export interface IAppProps {
  classes?: any;
  data: FeatureCollection2;
  onEditorUpdate: (fc: FeatureCollection2) => void;
}

export interface IAppState {}

class TextPane extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { classes, data } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              //disabled={!sharable}
              //onClick={this.props.onShare}
            >
              Publish
            </Button>
          </Toolbar>
        </AppBar>
        <CardEditorWithPreview
          data={data}
          editable={true}
          onContentChange={this.props.onEditorUpdate}
        />
      </div>
    );
  }
}

export default withStyles(styles)(TextPane);
