import * as React from "react";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";

const styles = (theme: Theme) =>
  createStyles({
    root: {}
  });

export interface IAppProps {
  classes?: any;
  attributes: any;
  node: any;
}

export interface IAppState {}

class Link extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
  }

  public render() {
    const { attributes, children, classes, node } = this.props;
    const { data } = node;

    return (
      <a {...attributes} href={data.get("url")}>
        {children}
      </a>
    ); 
  }
}

export default withStyles(styles)(Link);
