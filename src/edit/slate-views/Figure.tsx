import * as React from "react";
import { Typography } from "@material-ui/core";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";

const styles = (theme: Theme) =>
  createStyles({
    root: {
    }
  });

export interface IAppProps {
  classes?: any;
  attributes: any;
  isFocused: boolean
}

export interface IAppState {}

class Figure extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { classes, attributes, children, isFocused } = this.props;
    console.log("##Figure isFocused", isFocused);
    return (
      <figure className={classes.root} {...attributes}>
        {children}
      </figure>
    );
  }
}

export default withStyles(styles)(Figure);
