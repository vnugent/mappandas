import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import ShowPanda from "./ShowPanda";
import * as restClient from "./RestClient";

interface IShowPandaProps extends RouteComponentProps {}

interface IShowPandaState {
  uuid: string;
  geojson?: any;
}

export default class ShowPandaURLHandler extends React.Component<
  IShowPandaProps,
  IShowPandaState
> {
  constructor(props: IShowPandaProps) {
    super(props);
    this.state = {
      uuid: "",
      geojson: undefined
    };
  }

  componentDidMount() {
    console.log("##ShowPandaURHLHandler.componentDidmount()");
    const uuid = this.props.match.params["uuid"];
    this.getGeojsonFromCacheOrRemote(uuid);
  }


  componentDidUpdate(prevProps, prevState) {
    console.log("#ComponentDidUpdate()", this.state);
    if (!this.state.geojson) {
      this.getGeojsonFromCacheOrRemote(this.state.uuid);
    }
  }

  static getDerivedStateFromProps(
    nextProps: IShowPandaProps,
    prevState: IShowPandaState
  ) {
    console.log("getDerivedStateFromProps()", nextProps, prevState);
    if (nextProps.match.params["uuid"] !== prevState.uuid) {
      const nextUuid = nextProps.match.params["uuid"];
      console.log("uuid has changed");
      return {
        uuid: nextUuid,
        geojson: undefined
      };
    }
    return null;
  }

  getGeojsonFromCacheOrRemote = (uuid: string) => {
    const cache = localStorage.getItem(uuid);
    if (!cache) {
      console.log("Not found in cache");
      restClient.get(uuid).then(data => {
        this.setState({
          uuid: uuid,
          geojson: data
        });
      });
    } else {
      console.log("## found in cache");
      this.setState({ uuid: uuid, geojson: JSON.parse(cache) });
    }
  };

  render() {
    console.log("##ShowPandaURLHandler.render()", this.state.geojson);
    return this.state.geojson ? (
      <ShowPanda key={this.state.uuid} geojson={this.state.geojson} />
    ) : null;
  }
}
