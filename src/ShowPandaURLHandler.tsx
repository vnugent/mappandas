import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import * as restClient from "./RestClient";
import * as GeoHelper from "./GeoHelper";

interface IShowPandaProps extends RouteComponentProps {
  onDataLoaded: Function;
}

interface IShowPandaState {}

export const Context = React.createContext<IShowPandaState>({
  uuid: "",
  geojson: undefined
});

export default class ShowPandaURLHandler extends React.Component<
  IShowPandaProps,
  IShowPandaState
> {
  constructor(props: IShowPandaProps) {
    super(props);
  }

  componentDidMount() {
    const uuid = this.props.match.params["uuid"];
    const editable: boolean =
      this.props.match.params["edit"] === "edit" ? true : false;
    this.getGeojsonFromCacheOrRemote(uuid, editable);
  }

  componentWillUnmount() {
  }
  shouldComponentUpdate(
    nextProps: IShowPandaProps,
    nextState: IShowPandaState
  ) {
    const current = this.props.match["uuid"];
    const next = nextProps.match.params["uuid"];
    console.log(
      `ShowPandaURLHandler.shouldComponentUpdate()? ${current} -> ${next}`
    );
    return current !== next;
  }

  getGeojsonFromCacheOrRemote = (uuid: string, editable: boolean) => {
    const cache = localStorage.getItem(uuid);
    if (!cache) {
      console.log("Not found in cache");
      restClient
        .get(uuid)
        .then(
          payload =>
            payload &&
            this.props.onDataLoaded(
              GeoHelper.parse(payload, { json: true }),
              editable
            )
        );
    } else {
      const data = GeoHelper.parse(cache);
      console.log("## found in cache", data);
      this.props.onDataLoaded(data, editable);
    }
  };

  render() {
    return null;
  }
}
