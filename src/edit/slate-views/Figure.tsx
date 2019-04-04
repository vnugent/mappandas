import * as React from "react";
import { Typography } from "@material-ui/core";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      paddingTop: theme.spacing.unit * 4,
      paddingBottom: theme.spacing.unit * 4,
      [theme.breakpoints.up("md")]: {
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2
      }
    }
  });

export interface IAppProps {
  classes?: any;
  attributes: any;
}

export interface IAppState {}

class Figure extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { classes, attributes, children } = this.props;
    return (
      <figure className={classes.root} {...attributes}>
        {children}
      </figure>
    );
  }
}

export default withStyles(styles)(Figure);
