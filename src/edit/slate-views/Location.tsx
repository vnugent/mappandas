import * as React from "react";
import { Typography } from "@material-ui/core";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";

const styles = (theme: Theme) =>
  createStyles({
    root: {
        padding: theme.spacing.unit * 2,
    }
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
          variant="h5"
          color="textPrimary"
          gutterBottom
          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
        >
          {children}
        </Typography>
        <hr
          style={{ width: "45px", marginLeft: 0, border: "1px solid #eeeeee" }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Location);
