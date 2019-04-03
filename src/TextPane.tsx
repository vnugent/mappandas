import * as React from "react";
import { withStyles, Typography } from "@material-ui/core";
import { createStyles, Theme } from "@material-ui/core/styles";
import { FeatureCollection2 } from "@mappandas/yelapa";
import classnames from "classnames";
import { IPost } from "./types/CustomMapTypes";
import SmartEditor from "./edit/SmartEditor";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: "100%"
    },
    footer: {
      alignSelf: "flex-end",
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit * 3,
      flexShrink: 3
    },
    scrollableEditor: {
      paddingBottom: theme.spacing.unit * 8,
      overflowY: "auto"
    },
    slateWrapperHack: {
      paddingLeft: theme.spacing.unit * 8,
      paddingRight: theme.spacing.unit * 6,
      paddingBottom: theme.spacing.unit * 6,
      background: "#fafafa"
    }
  });

export interface IAppProps {
  classes?: any;
}

export interface IAppState {}

class TextPane extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
  }

  public render() {
    const { classes, children } = this.props;
    return (
      <div className={classes.container}>
        <div className={classnames(classes.scrollableEditor, "style-4")}>
          <div className={classes.slateWrapperHack}>{children}</div>
        </div>
        <Typography variant="caption" align="right" className={classes.footer}>
          Contact us: <a href="mailto:hola@mappandas.com">hola@mappandas.com</a>
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(TextPane);
