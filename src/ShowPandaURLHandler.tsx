import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Value } from "slate";

import { initialValue } from "./edit/slate-default";
import * as restClient from "./RestClient";

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

  shouldComponentUpdate(
    nextProps: IShowPandaProps,
    nextState: IShowPandaState
  ) {
    const current = this.props.match["uuid"];
    const next = nextProps.match.params["uuid"];
    return current !== next;
  }

  getGeojsonFromCacheOrRemote = (uuid: string, editable: boolean) => {
    restClient.get(uuid).then(post => {
      const slateContent = Value.fromJSON(post.content);
      post.content = Value.isValue(slateContent) ? slateContent : initialValue;
      this.props.onDataLoaded(post, editable);
    });
  };

  render() {
    return null;
  }
}
