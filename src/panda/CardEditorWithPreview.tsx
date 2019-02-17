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
    marginTop: 100,
    width: "100%",
    padding: theme.spacing.unit * 2,
    overflow: "auto",
    borderWidth: "medium",
    borderStyle: "dashed",
    borderColor: "#e0f2f1"
  },
  content: {
    padding: "10px",
    height: "80%",
    margin: theme.spacing.unit
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
        <div className={classes.content}>
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
