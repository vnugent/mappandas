import * as React from "react";
import { Tabs, Tab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { FeatureCollection2 } from "@mappandas/yelapa";
import PandaCardView from "./PandaCardView";
import PandaEditor from "./PandaEditor";

export interface IAppProps {
  classes?: any;
  onContentChange: (fc: FeatureCollection2) => void;
  data: FeatureCollection2;
  editable: boolean;
}

export interface IAppState {
  value: number;
}

const styles = (theme: any) => ({
  root: {
    width: "500px",
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
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
    const { classes, editable } = this.props;
    return (
      <div className={classes.root}>
        <Tabs value={this.state.value} onChange={this.handleChange}>
          {editable && <Tab label="Write" />}
          <Tab label="Preview" />
        </Tabs>
        <div style={{ padding: "10px" }}>
          {this.state.value === 0 && (
            <PandaEditor
              data={this.props.data}
              onContentChange={this.props.onContentChange}
            />
          )}
          {this.state.value === 1 && <PandaCardView data={this.props.data} />}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CardEditorWithPreview);
