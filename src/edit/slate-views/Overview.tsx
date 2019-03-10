import * as React from "react";
import { Typography } from "@material-ui/core";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2
    }
  });

export interface IAppProps {
  classes?: any;
  attributes: any;
  sideToolbar: any;
}

export interface IAppState {}

class Overview extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { children, classes, attributes } = this.props;
    return (
      <div className={classes.root} {...attributes}>
        {this.props.sideToolbar}
        <Typography
          variant="h5"
          color="textPrimary"
          style={{
            fontWeight: 400,
            fontFamily: "Georgia,Cambria,Times New Roman,Times,serif"
          }}
        >
          {children}
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(Overview);
