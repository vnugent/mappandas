import * as React from "react";
import { Typography } from "@material-ui/core";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import classnames from "classnames";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: "relative",

      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      fontFamily: "Georgia,Cambria,Times New Roman,Times,serif",
      fontSize: "1.5em",
      lineHeight: "1.8em",
      color: "rgba(0,0,0,.84)"
    },
    title: {
      [theme.breakpoints.up("md")]: {
        paddingTop: theme.spacing.unit * 6
      },
      letterSpacing: "-0.6px",
      fontWeight: 400,
      fontSize: "2.875em",
      lineHeight: "1.5em"
    }
  });

export interface IAppProps {
  classes?: any;
  attributes: any;
  sideToolbar: any;
  editor: any;
  node: any;
}

export interface IAppState {}

class Overview extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { children, classes, attributes } = this.props;

    const firstLine = this.myIndex() === 0;
    return (
      <div
        className={classnames(classes.root, firstLine ? classes.title : "")}
        {...attributes}
      >
        {this.props.sideToolbar}
        {children}
      </div>
    );
  }

  myIndex = () => {
    const { editor, node } = this.props;
    return editor.value.document.nodes.indexOf(this.props.node);
  };
}

export default withStyles(styles)(Overview);
