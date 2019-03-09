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
  sideToolbar: any;
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
      <div className={classes.root} {...attributes}>
        {this.props.sideToolbar}
        <Typography
          {...attributes}
          variant="h3"
          color="textPrimary"
          gutterBottom
          style={{
            fontWeight: 400,
            lineHeight: 1.2,
            fontFamily: "Georgia,Cambria,Times New Roman,Times,serif"
          }}
        >
          {children}
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(Title);
