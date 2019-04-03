import * as React from "react";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import classnames from "classnames";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginLeft: "auto",
      marginRight: "auto",
      display: "block",
      maxWidth: "100%"
    },
    selected: {
      boxShadow: "0 0 0 3px #00c853;"
    },
    hovered: {
      boxShadow: "0 0 0 3px #69f0ae;"
    }
  });

export interface IAppProps {
  classes?: any;
  src: any;
  isSelected: boolean;
  attributes: any;
}

export interface IAppState {
  isHovered: boolean;
}

class Image extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = { isHovered: false };
  }

  public render() {
    const { classes, src, isSelected, attributes, children } = this.props;
    return (
      <div {...attributes} contentEditable={false}>
        <img
          src={src}
          className={classnames(
            classes.root,
            !isSelected && this.state.isHovered && classes.hovered,
            isSelected && classes.selected
          )}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.outMouseOut}
          onClick={this.onClick}
        />
      </div>
    );
  }

  onClick = event => {
  };
  onMouseOver = event =>
    !this.props.isSelected && this.setState({ isHovered: true });
  outMouseOut = () => this.setState({ isHovered: false });
}

export default withStyles(styles)(Image);
