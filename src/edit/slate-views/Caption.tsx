import * as React from "react";
import { Typography } from "@material-ui/core";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
      marginTop: theme.spacing.unit
    }
  });

export interface IAppProps {
  classes?: any;
  attributes: any;
}

export interface IAppState {}

class Caption extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { classes, attributes, children } = this.props;
    console.log("#children", children)

    return (
      <figcaption className={classes.root} {...attributes}>
        <Typography variant="caption">{children}</Typography>
      </figcaption>
    );
  }
}

export default withStyles(styles)(Caption);
