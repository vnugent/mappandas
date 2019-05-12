import * as React from "react";
import { Link as A } from "@material-ui/core";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import * as Validator from "validate.js";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      fontSize: "0.8em",
      padding: theme.spacing.unit,
      borderRadius: 4,
      border: "1px dashed #e0e0e0"
    },
    suggestion: {
      marginTop: -38,
      marginLeft: -theme.spacing.unit,
      borderRadius: 4,
      padding: theme.spacing.unit,
      border: "thin solid #e0e0e0",
      float: "left",
      background: "#e0f7fa"
    }
  });

export interface IAppProps {
  classes?: any;
  attributes: any;
  node: any;
  readonly: boolean;
}

export interface IAppState {}

class CanonicalLink extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
  }

  public render() {
      const {attributes, classes, readonly, children} = this.props;
      if (readonly) return null;
    return (
        <div {...attributes} className={classes.root}><span className={classes.suggestion} contentEditable={false}>
        Canonical link
      </span>{children}</div>
    )
  }
}

export default withStyles(styles)(CanonicalLink);