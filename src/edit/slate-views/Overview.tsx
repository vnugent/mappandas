import * as React from "react";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import classnames from "classnames";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 4,
      fontFamily: "Georgia,Cambria,Times New Roman,Times,serif",
      [theme.breakpoints.up("md")]: {
        fontSize: "1.5em"
      },
      [theme.breakpoints.down("md")]: {
        fontSize: "1em"
      },
      lineHeight: "1.6em",
      color: "rgba(0,0,0,.84)"
    },
    title: {
      fontFamily:
        "Cormorant Garamond,Georgia,Cambria,Times New Roman,Times,serif",
      [theme.breakpoints.up("md")]: {
        paddingTop: theme.spacing.unit * 6,
        fontSize: "2.875em"
      },
      [theme.breakpoints.down("md")]: {
        fontSize: "1.5em"
      },
      letterSpacing: "-0.6px",
      fontWeight: "bold",
      lineHeight: "1.5em"
    }
  });

export interface IAppProps {
  isFocused: boolean;
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
    const { children, classes, attributes, isFocused } = this.props;
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
    return editor.value.document.nodes.indexOf(node);
  };
}

export default withStyles(styles)(Overview);
