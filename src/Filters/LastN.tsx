import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Avatar, IconButton, Tooltip } from "@material-ui/core";
import {
  Face as FaceIcon,
  KeyboardArrowRight,
  KeyboardArrowLeft
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";

import SwipeableViews from "react-swipeable-views";

import { IPanda } from "../types/CustomMapTypes";
import * as RestClient from "../RestClient";

const styles = theme => ({
  activePanda: {
    cursor: "pointer",
    display: "inline-block",
    padding: 3,
    borderRadius: "5px 15px 8px",
    backgroundColor: theme.palette.secondary.light
  },
  defaultPanda: {
    cursor: "pointer",
    display: "inline-block",
    padding: 3
  }
});

const SpringConfig = {
  delay: "0s",
  duration: "1s",
  easeFunction: "cubic-bezier(0,.66,.56,.95)"
};

interface ILastNProps extends RouteComponentProps {
  currentPanda?: IPanda;
  classes: any;
}

interface ILastNState {
  data: Array<any>;
  index: number;
  selectedIndex: string;
}

class LastN extends React.Component<ILastNProps, ILastNState> {
  private static MAX_LIMIT = 10;
  private interval: any;
  StyledLastNStyledLastN;
  constructor(props: ILastNProps) {
    super(props);
    this.state = {
      data: [],
      index: 0,
      selectedIndex: ""
    };
  }

  componentDidMount() {
    this.getAsyncData();
    this.interval = setInterval(() => {
      //this.getAsyncData();
    }, 25000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getAsyncData = () => {
    RestClient.getLastN(LastN.MAX_LIMIT).then(_data => {
      this.setState({ data: _data });
    });
  };

  onPandaClick = uuid => {
    this.setState({ selectedIndex: uuid });
    this.props.history.push(`/p/${uuid}`);
  };

  myChip = ({ entry, classes }) => (
    <div
      onClick={() => this.onPandaClick(entry._id)}
      className={
        this.props.currentPanda && this.props.currentPanda.uuid === entry._id
          ? classes.activePanda
          : classes.defaultPanda
      }
    >
      <Tooltip
        title={entry.description ? entry.description.substring(0, 50) : ""}
        placement="bottom"
      >
        <div>
          <Avatar>
            <FaceIcon fontSize="small" />
          </Avatar>
        </div>
      </Tooltip>
    </div>
  );

  list = (): Array<any> => {
    return this.state.data.map(entry => {
      return (
        <this.myChip
          classes={this.props.classes}
          key={entry._id}
          entry={entry}
        />
      );
    });
  };

  render() {
    return (
      <div className="feed-container">
        <IconButton onClick={this._leftClick}>
          <KeyboardArrowLeft />
        </IconButton>
        <SwipeableViews
          index={this.state.index}
          enableMouseEvents={true}
          containerStyle={{ padding: 5, width: "80px" }}
          style={{
            padding: "5px",
            borderRadius: "30px",
            width: "100%"
          }}
          onChangeIndex={this._onSwipe}
          threshold={0.2}
          hysteresis={0.1}
          springConfig={SpringConfig}
        >
          {this.state.data.length > 0 ? this.list() : <div>Loading...</div>}
        </SwipeableViews>
        <IconButton onClick={this._rightClick}>
          <KeyboardArrowRight />
        </IconButton>
      </div>
    );
  }

  _leftClick = () => {
    if (this.state.index > 0) this.setState({ index: this.state.index - 1 });
  };

  _rightClick = () => {
    if (this.state.index < this.state.data.length - 4)
      this.setState({ index: this.state.index + 1 });
  };

  _onSwipe = (newIndex, latest) => {
    console.log(newIndex, latest);
    this.setState({ index: newIndex });
  };
}

const StyledLastN = withStyles(styles)(LastN);
export default withRouter(StyledLastN);
