import * as React from "react";
import { Tabs, Tab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { createStyles, Theme } from "@material-ui/core/styles";

import { FeatureCollection2 } from "@mappandas/yelapa";
import PandaCardView from "./PandaCardView";
import PandaEditor from "./PandaEditor";
import * as RestClient from "../RestClient";

const uuidv1 = require("uuid/v1");

export interface IAppProps {
  classes?: any;
  onContentChange: (fc: FeatureCollection2) => void;
  data: FeatureCollection2;
  editable: boolean;
}

export interface IAppState {
  selectedTab: number;
  sampleText: string;
  uuid: string;
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
    },
    tryme: {
      color: theme.palette.secondary.main
    }
  });

class CardEditorWithPreview extends React.Component<IAppProps, IAppState> {
  private timer: any;
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      selectedTab: 0,
      sampleText: "",
      uuid: this.props.data.properties ? this.props.data.properties.uuid : "1"
    };
  }

  static getDerivedStateFromProps(nextProps: IAppProps, prevState: IAppState) {
    const nextUUID = nextProps.data.properties ? nextProps.data.properties.uuid : 1;
    if (nextUUID !== prevState.uuid) {
        return {
            uuid: nextUUID,
            selectedTab: 0
        }
    }
    return {}
  }

//   shouldComponentUpdate(nextProps: , nextState) {
    
//   }

  handleChange = (event, selectedTab) => {
    this.setState({ selectedTab });
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  public render() {
    const { editable, classes, data } = this.props;
    const activeUUID = data.properties ? data.properties.uuid : "1";
    const {selectedTab} = this.state;
    return (
      <div className={classes.root}>
        <Tabs value={this.state.selectedTab} onChange={this.handleChange}>
          {editable && <Tab label="Write" />}
          <Tab label="Preview" />
          <Tab
            label="Try Me!"
            onClick={this.loadExample}
            textColor="secondary"
            classes={{
              root: classes.tryme,
              textColorSecondary: classes.color
            }}
          />
        </Tabs>
        <PandaEditor
          key={activeUUID}
          hide={selectedTab !== 0}
          data={data}
          initialText={this.state.sampleText}
          onContentChange={this.props.onContentChange}
        />
        <PandaCardView
          hide={selectedTab !== 1}
          data={this.props.data}
          previewMode={true}
        />
      </div>
    );
  }

  // allow publishing if there's 1 entry
  isPublishable = () => this.props.data.features.length > 0;

  loadExample = () => {
    RestClient.getTextFile("example1.txt").then(s => {
      const { data } = this.props;
      if (data.properties) data.properties.uuid = uuidv1();
      this.setState({ sampleText: s });
      (this.timer = setTimeout(() => {
        this.setState({ sampleText: "" });
      })),
        600;
    });
  };
}

export default withStyles(styles)(CardEditorWithPreview);
