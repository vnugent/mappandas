import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import * as GeoHelper from "./GeoHelper";

interface IProps extends RouteComponentProps {
  onInitialized: Function;
}

interface IState { }

export default class DefaultUrLHandler extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    const state = this.props.location.state;
    if (state && state.dontMoveMap) {
      // reset the state flag
      this.props.history.replace({
        pathname: this.props.location.pathname,
        state: {}
      });
      return;
    }

    const urlParams = new URLSearchParams(this.props.location.search);
    const layout = parseLayout(urlParams.get("layout"));
    console.log("#layout", layout);
    this.props.onInitialized(GeoHelper.INITIAL_VIEWSTATE(), layout);
  }

  componentDidUpdate(preProps: IProps) {
    const prevUrlParams = new URLSearchParams(preProps.location.search);
    const prevLayout = parseLayout(prevUrlParams.get("layout"));

    const urlParams = new URLSearchParams(this.props.location.search);
    const layout = parseLayout(urlParams.get("layout"));


    if (layout !== prevLayout) {
      this.props.onInitialized(GeoHelper.INITIAL_VIEWSTATE(), layout);

      //console.log("#newlayout", layout, prevLayout)
    }
  }

  render() {
    return null;
  }
}

const parseLayout = (paramRaw: string | null) => {
  const param = paramRaw ? paramRaw.toLowerCase() : "map";
  if (param === "classic" || param === "map" || param === "column") {
    return param;
  }
  return "default";
}