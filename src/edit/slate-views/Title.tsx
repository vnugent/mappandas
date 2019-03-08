import * as React from "react";
import { Typography } from "@material-ui/core";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing.unit * 2,
      boxSizing: "border-box"
    },
    toolbar: {
      marginRight: theme.spacing.unit * 5,
      borderRadius: 8,
      border: "thin solid #e0e0e0",
      marginTop: -28,
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
}

export interface IAppState {}

class Title extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { attributes, children, classes } = this.props;
    return (
      <Typography
        className={classes.root}
        {...attributes}
        variant="h3"
        color="textPrimary"
        gutterBottom
        style={{ fontWeight: "medium", fontFamily: "serif" }}
      >
        {children}
      </Typography>
    );
  }
}

export default withStyles(styles)(Title);
