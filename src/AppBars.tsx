import * as React from "react";
import {
  AppBar,
  Button,
  Toolbar,
  Menu,
  MenuItem,
  withStyles,
  createStyles,
  Theme,
  IconButton,
  Divider
} from "@material-ui/core";
import { MoreVert, VerticalSplit, ViewStream, Place } from "@material-ui/icons";

import { withRouter, RouteComponentProps } from "react-router-dom";
import classnames from "classnames";
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
      backgroundColor: "#fafafa",
      left: 0,
      zIndex: 1000,
      width: "100%"
    },
    stdWidth: {
      width: "100%"
    },
    responsiveWidth: {
      [theme.breakpoints.up("sm")]: {
        width: "50%"
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%"
      },
    },
    editorSubMenu: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      margin: 0,
      paddingTop: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 3,
      paddingBottom: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3
    },
    button: {
      //    marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit
    },
    hamburgerMenuItem: {
      paddingLeft: theme.spacing.unit * 6,
      paddingRight: theme.spacing.unit * 6
    }
  });

export interface IAppProps extends RouteComponentProps {
  classes?: any;
  readonly: boolean;
  isPublishable: boolean;
  layout: string;
  onCreateNewClick: () => void;
  onPublishClick: () => void;
}

export interface IEditorProps {
  classes?: any;
  data: FeatureCollection2;
  onPublishClick: () => void;
}

export interface IAppState {
  anchorEl: any;
}

class Editor extends React.Component<IEditorProps, IAppState> {
  constructor(props: IEditorProps) {
    super(props);
  }

  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.editorSubMenu}>
        <a href="https://app.mappandas.com/p/97cb72b0-4215-11e9-9cf2-afccc66ce6e3">
          Example one
        </a>
        &nbsp;&nbsp;
        <a href="https://app.mappandas.com/p/85cf6470-47a8-11e9-962c-61a624428919">
          Example two
        </a>
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
      properties.title || properties.summary.length > 1 || features.length > 0
    );
  };
}

class TopLevelAppBar extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  public render() {
    const {
      classes,
      layout,
      onCreateNewClick,
      onPublishClick,
      isPublishable,
      readonly
    } = this.props;
    const { anchorEl } = this.state;
    return (
      <div className={classnames(classes.appBar)} >
        <AppBar
          position="sticky"
          style={{
            backgroundColor: "transparent"
          }}
        >
          <Toolbar>
            {/* <Typography
              className={classes.title}
              variant="h6"
              color="inherit"
              noWrap
              onClick={() => {
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera;
              }}
            >
              MP&nbsp;
              <span style={{ fontColor: "#757575", fontSize: "0.8em" }}>
                <sup>beta</sup>
              </span>
            </Typography> */}
            <div className={classes.padding} />
            {!readonly && "Draft"}
            <div className={classes.padding} />
            {!readonly && (
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                className={classes.button}
                disabled={isPublishable}
                onClick={onPublishClick}
              >
                Publish
              </Button>
            )}
            <IconButton
              aria-label="More"
              aria-owns={open ? "long-menu" : undefined}
              aria-haspopup="true"
              color="secondary"
              onClick={this.handleClick}
            >
              <MoreVert fontSize="small" />
            </IconButton>
            <Menu
              id="simple-menu"
              disableAutoFocusItem={true}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
            >
              <MenuItem
                className={classes.hamburgerMenuItem}
                onClick={() => {
                  this.setState({ anchorEl: null });
                  onCreateNewClick();
                }}
              >
                New story
              </MenuItem>
              <Divider />
              {this.layoutSubmenu()}
              <Divider />

              <MenuItem
                className={classes.hamburgerMenuItem}
                onClick={this.handleClose}
                component="a"
                href="https://mappandas.com"
              >
                About
              </MenuItem>
              <Divider />
              <MenuItem
                className={classes.hamburgerMenuItem}
                onClick={this.handleClose}
                component="a"
                href="https://app.mappandas.com/p/7cc926e0-7331-11e9-bf02-255f99646d1a"
              >
                Top 5 Gluten Free / Plant-Based Cafes in Vancouver
              </MenuItem>
              <MenuItem
                className={classes.hamburgerMenuItem}
                onClick={this.handleClose}
                component="a"
                href="https://app.mappandas.com/p/2a541f40-758f-11e9-8f52-a595fccd4a3f"
              >
                14 Once in a Lifetime Destinations
              </MenuItem>
              <MenuItem
                className={classes.hamburgerMenuItem}
                onClick={this.handleClose}
                component="a"
                href="https://app.mappandas.com/p/eeddbed0-6c1a-11e9-b5fc-7bffb42812ac"
              >
                24 hours in Bogotá, Colombia
              </MenuItem>
              <MenuItem
                className={classes.hamburgerMenuItem}
                onClick={this.handleClose}
                component="a"
                href="https://app.mappandas.com/p/0923a460-6c13-11e9-a958-3ddcfa2a9806"
              >
                Joe Spanish featured listings
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </div>
    );
  }



  layoutSubmenu = () => {
    const { classes, layout } = this.props;
    const menuItems = [
      { key: "column", content: this.format(layout === "column", "Column layout"), icon: <VerticalSplit color="secondary" /> },
      { key: "map", content: this.format(layout === "map", "Map layout"), icon: <Place color="secondary" /> },
      { key: "classic", content: this.format(layout === "classic", "Classic layout"), icon: < ViewStream color="secondary" /> }
    ]
    return (menuItems.map(item => <MenuItem
      className={classes.hamburgerMenuItem}
      onClick={() => this.handleLayout(item.key)}
    >{item.icon}&nbsp;{item.content}
    </MenuItem>)
    );
  }

  format = (active: boolean, text: string) => {
    return (active ? (<b>{text}</b>) : text)
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLayout = (key: string) =>
    (this.setState({ anchorEl: null }, () => {
      //const this.props.locati
      this.props.history.push("?layout=" + key)
    })
    )


}



export default withStyles(styles)(withRouter(TopLevelAppBar));
const EditorAppBar = withStyles(styles)(Editor);
export { EditorAppBar };
