import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import * as restClient from "./RestClient";
import * as GeoHelper from "./GeoHelper";
// import { LatLngBounds } from "leaflet";

interface IShowPandaProps extends RouteComponentProps {
  onDataLoaded: Function;
}

interface IShowPandaState {
  //   uuid: string;
  //   geojson?: any;
}

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
    console.log("##ShowPandaURHLHandler.componentDidmount() ", uuid);
    this.getGeojsonFromCacheOrRemote(uuid);
  }

  componentWillUnmount() {
    console.log("ShowPandaURLHandlr().willUnmount()");
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
  // componentDidUpdate(prevProps: IShowPandaProps, prevState) {
  //     const current = this.props.match["uuid"];
  //     const prev = prevProps.match.params["uuid"];
  //   console.log("#ComponentDidUpdate()", prev, current);
  //   if ( prev && prev !== current ) {
  //     this.getGeojsonFromCacheOrRemote(prev);
  //   }
  // }

  // static getDerivedStateFromProps(
  //   nextProps: IShowPandaProps,
  //   prevState: IShowPandaState
  // ) {
  //   console.log("PandaURLHandler.getDerivedStateFromProps()", nextProps, prevState);
  //   if (nextProps.match.params["uuid"] !== this.props.match.params["uuid"]) {
  //     const nextUuid = nextProps.match.params["uuid"];
  //     console.log("uuid has changed");
  //     return {
  //       uuid: nextUuid,
  //       geojson: undefined
  //     };
  //   }
  //   return null;
  // }

  getGeojsonFromCacheOrRemote = (uuid: string) => {
    const cache = localStorage.getItem(uuid);
    if (!cache) {
      console.log("Not found in cache");
      restClient.get(uuid).then(data => {
        this.props.onDataLoaded({
          uuid: uuid,
          bbox: GeoHelper.bboxFromGeoJson(data),
          geojson: data
        });
      });
    } else {
      const data = GeoHelper.parse(cache);
      console.log("## found in cache", data);
      this.props.onDataLoaded(data);
    }
  };

  render() {
    return null;
  }
}
