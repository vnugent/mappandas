import * as React from "react";
import {
  AppBar,
  Typography,
  Button,
  Toolbar,
  withStyles,
  createStyles,
  Theme
} from "@material-ui/core";
import { FeatureCollection2 } from "@mappandas/yelapa";

const styles = (theme: Theme) =>
  createStyles({
    padding: {
      flexGrow: 1
    },
    title: {
      fontFamily: "serif",
      fontWeight: "bold",
      letterSpacing: "0.1em"
    },
    appBar: {
      position: "fixed",
      boxShadow: "none",
      backgroundColor: "white",
      [theme.breakpoints.up("md")]: {
        width: "50%"
      },
      [theme.breakpoints.down("md")]: {
        width: "100%"
      },
      left: 0,
      zIndex: 2000
    },
    editorSubMenu: {
      display: "flex",
      justifyContent: "flex-end",
      margin: 0,
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingRight: theme.spacing.unit * 3
    }
  });

export interface IAppProps {
  classes?: any;
  data: FeatureCollection2;
  onCreateNewClick: () => void;
}

export interface IEditorProps {
  classes?: any;
  data: FeatureCollection2;
  onPublishClick: () => void;
}

export interface IAppState {}

class Editor extends React.Component<IEditorProps, IAppState> {
  constructor(props: IEditorProps) {
    super(props);
  }

  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.editorSubMenu}>
        <div style={{ flexGrow: 2 }} />
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.padding}
          disabled={!this.isPublishable()}
          onClick={this.props.onPublishClick}
        >
          Ready to Publish
        </Button>
      </div>
    );
  }
  // allow publishing if there's some text in title or overview
  isPublishable = () => {
    const { properties, features } = this.props.data;
    return (
      properties.title ||
      properties.summary.length > 1 ||
      features.length > 0
    );
  };
}

class TopLevelAppBar extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
  }

  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.appBar}>
        <AppBar
          position="sticky"
          style={{
            backgroundColor: "transparent"
          }}
        >
          <Toolbar>
            <Typography
              className={classes.title}
              variant="h6"
              color="inherit"
              noWrap
              onClick={() => {
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera;
              }}
            >
              Map Pandas&nbsp;
              <span style={{ fontColor: "#757575", fontSize: "0.8em" }}>
                <sup>Beta</sup>
              </span>
            </Typography>
            <div className={classes.padding} />
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              className={classes.button}
              onClick={this.props.onCreateNewClick}
            >
              New Story
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(TopLevelAppBar);
const EditorAppBar = withStyles(styles)(Editor);
export { EditorAppBar };
