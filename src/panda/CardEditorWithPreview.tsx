import * as React from "react";
import { Tabs, Tab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { createStyles, Theme } from "@material-ui/core/styles";

import { FeatureCollection2 } from "@mappandas/yelapa";
import PandaCardView from "./PandaCardView";
import PandaEditor from "./PandaEditor";

const uuidv1 = require("uuid/v1");

export interface IAppProps {
  classes?: any;
  onContentChange: (fc: FeatureCollection2) => void;
  data: FeatureCollection2;
  editable: boolean;
}

export interface IAppState {
  value: number;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      display: "flex",
      flexFlow: "column",
      alignItems: "stretch",
      alignContent: "center"
    }
  });

class CardEditorWithPreview extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      value: 0
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  public render() {
    const { editable, classes, data } = this.props;
    const uuid = data.properties ? data.properties.uuid : uuidv1();
    return (
      <div className={classes.root}>
        <Tabs value={this.state.value} onChange={this.handleChange}>
          {editable && <Tab label="Write" />}
          <Tab label="Preview" />
        </Tabs>
        <PandaEditor
          key={uuid}
          hide={this.state.value !== 0}
          data={this.props.data}
          onContentChange={this.props.onContentChange}
        />
        <PandaCardView
          hide={this.state.value !== 1}
          data={this.props.data}
          previewMode={true}
        />
      </div>
    );
  }

  // allow publishing if there's 1 entry
  isPublishable = () => this.props.data.features.length > 0;
}

export default withStyles(styles)(CardEditorWithPreview);
