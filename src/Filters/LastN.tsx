import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import FaceIcon from "@material-ui/icons/Face";

import * as RestClient from "../RestClient";

interface ILastNProps extends RouteComponentProps {}

interface ILastNState {
  data: Array<any>;
}

class LastN extends React.Component<ILastNProps, ILastNState> {
  private static MAX_LIMIT = 10;
  private interval: any;

  constructor(props: ILastNProps) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.getAsyncData();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getAsyncData = () => {
    RestClient.getLastN(LastN.MAX_LIMIT).then(_data => {
      this.setState({ data: _data });
    });
  };

  onPandaClick = uuid => this.props.history.push(`/p/${uuid}`);

  list = (): Array<any> => {
    return this.state.data.map(entry => {
      return (
        <Chip
          key={entry._id}
          avatar={
            <Avatar>
              <FaceIcon />
            </Avatar>
          }
          label={entry._user_id}
          onClick={() => this.onPandaClick(entry._id)}
        />
      );
    });
  };

  render() {
    return (
      <div className="feed-container">
        <p>Panda Feed</p>
        {this.state.data.length > 0 ? this.list() : <div>Loading...</div>}
      </div>
    );
  }
}

export default withRouter(LastN);
