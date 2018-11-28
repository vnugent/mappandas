import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import ShowPanda from "./ShowPanda";
import * as restClient from "./RestClient";
// import { FeatureCollection } from "geojson";

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
      uuid: props.match.params["uuid"],
      geojson: undefined
    };
  }

  componentDidMount() {
    restClient.get(this.state.uuid).then(response => {
      console.log("## api result: ", response);
      this.setState({ geojson: response });
    });
  }

  render() {
    console.log("##ShowPandaURLHandler()", this.state.geojson);
    return this.state.geojson ? (
      <ShowPanda geojson={this.state.geojson} />
    ) : null;
  }
}
