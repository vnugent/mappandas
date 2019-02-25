import * as React from "react";
import { withStyles, Typography } from "@material-ui/core";
import { createStyles, Theme } from "@material-ui/core/styles";
import { FeatureCollection2 } from "@mappandas/yelapa";

import CardEditorWithPreview from "./panda/CardEditorWithPreview";
import { EditorAppBar } from "./AppBars";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      boxSizing: "border-box",
      flexDirection: "column",
      height: "100%",
      width: "100%",
      paddingLeft: theme.spacing.unit * 3
    },
    footer: {
      alignSelf: "flex-end",
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit * 3,
      flexShrink: 3
    }
  });

export interface IAppProps {
  classes?: any;
  data: FeatureCollection2;
  onEditorUpdate: (fc: FeatureCollection2) => void;
  onPublishButtonClick: () => void;
}

export interface IAppState {}

class TextPane extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
  }

  public render() {
    const { classes, data } = this.props;
    return (
      <div className={classes.container}>
        <EditorAppBar
          data={data}
          onPublishClick={this.props.onPublishButtonClick}
        />
        <CardEditorWithPreview
          data={data}
          editable={true}
          onContentChange={this.props.onEditorUpdate}
        />
        <Typography variant="caption" align="right" className={classes.footer}>
          Contact us: <a href="mailto:hola@mappandas.com">hola@mappandas.com</a>
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(TextPane);
