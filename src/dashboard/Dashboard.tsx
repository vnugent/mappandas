import * as React from "react";
import { withRouter, Redirect, RouteComponentProps } from "react-router-dom";
import { Theme, withStyles, createStyles, Tabs, Tab } from "@material-ui/core";

import Latest from "./Lastest";
import Profile from "./Profile";

import ResponsiveLayout from "../ResponsiveLayout";
import withAuth from "../withAuth";
import Can from "../Can";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      // display: "flex",
      // alignItems: "center"
      paddingBottom: theme.spacing.unit * 4
    },
    tabs: {
      borderBottom: "1px solid #e8e8e8",
      textTransform: "none"
    }
  });

export interface IAppProps extends RouteComponentProps {
  classes: any;
  auth: any;
}

export interface IAppState {
  tabIndex: number;
}

class Dashboard extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      tabIndex: 0
    };
  }

  handleChange = (event, newValue) => {
    this.setState({ tabIndex: newValue });
  };

  public render() {
    const { classes, auth } = this.props;
    const { tabIndex } = this.state;
    return (
      <div className={classes.root}>
        Dashboard
        <ResponsiveLayout>
          <Tabs value={tabIndex} onChange={this.handleChange}>
            <Tab label="Lastest" />
            <Tab label="Profile" />
          </Tabs>
          {tabIndex === 0 && (
            <Latest authUser={auth.user} ownerId={auth.user.id} />
          )}
          {tabIndex === 1 && (
            <Profile authUser={auth.user} updateAuthUserAPI={auth.updateUser} />
          )}
        </ResponsiveLayout>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(withAuth(Dashboard)));
