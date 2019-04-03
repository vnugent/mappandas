import * as React from "react";
import { Typography } from "@material-ui/core";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";

const styles = (theme: Theme) =>
  createStyles({
    root: {}
  });

export interface IAppProps {
  classes?: any;
  attributes: any;
}

export interface IAppState {}

class Location extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { attributes, children, classes } = this.props;
    return (
      <div
        className={classes.root}
        {...attributes}
      >
        <Typography
          variant="h4"
          color="textPrimary"
          gutterBottom
          style={{ fontFamily: "serif", fontWeight: 600 }}
        >
          {children}
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(Location);
