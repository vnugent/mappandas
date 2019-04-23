import * as React from "react";
import { Tooltip, Link as A } from "@material-ui/core";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";

const styles = (theme: Theme) =>
  createStyles({
    root: {},
    tooltip: {
      fontSize: "1em",
      padding: theme.spacing.unit,
      color: theme.palette.common.black,
      backgroundColor: "#ffff8d",
      [theme.breakpoints.up("md")]: {
        maxWidth: "400px"
      }
    }
  });

export interface IAppProps {
  classes?: any;
  attributes: any;
  node: any;
  readonly: boolean;
}

export interface IAppState {}

class Link extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
  }

  public render() {
    const { attributes, children, classes, node, readonly } = this.props;
    const { data } = node;
    var href: string;
    try {
      href = new URL(data.get("url")).href;
    } catch (error) {
      href = "http://" + data.get("url");
    }

    return (
      <Tooltip
        {...attributes}
        interactive
        title={readonly ? "" : <A color="inherit" href={href} underline="always">{href}</A>}
        classes={{ tooltip: classes.tooltip }}
      >
        <A color="inherit" href={href} underline="always">
          {children}
        </A>
      </Tooltip>
    );
  }
}

export default withStyles(styles)(Link);
