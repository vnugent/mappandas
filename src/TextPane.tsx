import * as React from "react";
import { withStyles, Typography } from "@material-ui/core";
import { createStyles, Theme } from "@material-ui/core/styles";
import { FeatureCollection2 } from "@mappandas/yelapa";
// import { serializeEntry } from "./edit/handlers/deserializers";

//import CardEditorWithPreview from "./panda/CardEditorWithPreview";
import SmartEditor from "./edit/SmartEditor";
import { EditorAppBar } from "./AppBars";
//import * as GeoHelper from "./GeoHelper";


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
        <SmartEditor uuid={data.properties.uuid} onLocationUpdate={this.props.onEditorUpdate} />
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

  onEntryUpdate = (data: any) => {
    console.log(
      "### onEntryUpdate()",
      data.location.toJSON(),
      data.mDescription.toJSON()
    );
    // serializeEntry(data).then(f => {
    //   console.log(f);
    //   if (!f) {
    //     return;
    //   }
    // //   const {location, mDescription} = data;

    // //   this.locationMap.set(location.key, f);

    // //   const newFC: FeatureCollection2 = {
    // //       type: "FeatureCollection",
    // //       properties: {
    // //           uuid: this.props.data.properties.uuid
    // //       },
    // //       features: List(this.props.data.features).push(f).toArray()
    // //   }
    // //   this.props.onEditorUpdate(newFC);
    // }); 
  };

  toFC = () => {

  }
}

export default withStyles(styles)(TextPane);
