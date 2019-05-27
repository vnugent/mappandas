import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Theme, withStyles, createStyles } from "@material-ui/core";

import Latest from "./Lastest";
import ResponsiveLayout from "../ResponsiveLayout";
import { AuthConsumer } from "../authContext";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      // display: "flex",
      // alignItems: "center"
      paddingBottom: theme.spacing.unit * 4
    }
  });

export interface IAppProps extends RouteComponentProps {
  classes: any;
}

export interface IAppState {}

class Dashboard extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { classes } = this.props;
    return (
      <AuthConsumer>
        {({ user }) => {
          const textId = this.plainUserId(user);
          if (textId) {
            user.textId = textId;
          }
          return (
            <div className={classes.root}>
              Dashboard
              <ResponsiveLayout>
                <Latest authUser={user} ownerId={textId} />
              </ResponsiveLayout>
            </div>
          );
        }}
      </AuthConsumer>
    );
  }

  plainUserId = user => {
    const { id } = user;
    if (id) {
      const ss = id.split("|");
      return ss.length === 2 ? ss[1] : null;
    }
    return null;
  };
}

export default withStyles(styles)(withRouter(Dashboard));
