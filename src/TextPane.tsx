import * as React from "react";
import { withStyles, Typography } from "@material-ui/core";
import { createStyles, Theme } from "@material-ui/core/styles";
import { FeatureCollection2 } from "@mappandas/yelapa";
import classnames from "classnames";
// import { serializeEntry } from "./edit/handlers/deserializers";

//import CardEditorWithPreview from "./panda/CardEditorWithPreview";
import SmartEditor from "./edit/SmartEditor";
import { EditorAppBar } from "./AppBars";
//import * as GeoHelper from "./GeoHelper";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      //boxSizing: "border-box",
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
      paddingBottom: theme.spacing.unit * 6
      ///marginTop: theme.spacing.unit * 5
      //overflowX: "visible",
    }
  });

export interface IAppProps {
  classes?: any;
  data: FeatureCollection2;
  onEditorUpdate: (fc: FeatureCollection2, options: any) => void;
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
        <div className={classnames(classes.scrollableEditor, "style-4")}>
          <div className={classes.slateWrapperHack}>
            <SmartEditor
              key={data.properties.uuid}
              uuid={data.properties.uuid}
              onLocationUpdate={this.props.onEditorUpdate}
            />
          </div>
        </div>
        {/* <CardEditorWithPreview
          data={data}
          editable={true}
          onContentChange={this.props.onEditorUpdate}
        /> */}
        <Typography variant="caption" align="right" className={classes.footer}>
          Contact us: <a href="mailto:hola@mappandas.com">hola@mappandas.com</a>
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(TextPane);
