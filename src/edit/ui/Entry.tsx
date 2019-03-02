import * as React from "react";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import classnames from "classnames";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginTop: "2px",
      marginLeft: -theme.spacing.unit * 3,
      paddingLeft: theme.spacing.unit * 3,
      padding: "2px"
    },
    hover: {
        backgroundColor: "#eeeeee",
    }
  });

export interface IAppProps {
  classes?: any;
  attributes: any;
}

export interface IAppState {
  hoverClass: any;
}

class Entry extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      hoverClass: undefined
    };
  }

  public render() {
    const { attributes, children, classes } = this.props;
    return (
      <div
        {...attributes}
        className={classnames(classes.root, this.state.hoverClass)}
        onMouseOver={this.mouseOver}
        onMouseLeave={this.mouseLeave}
      >
        {children}
      </div>
    );
  }

  mouseOver = (event: any) =>
    this.setState({ hoverClass: this.props.classes.hover });

  mouseLeave = (event: any) => this.setState({ hoverClass: undefined });
}

export default withStyles(styles)(Entry);
