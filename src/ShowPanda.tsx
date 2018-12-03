import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { Context } from "./ShowPandaURLHandler";

interface IShowPandaProps extends RouteComponentProps {}

interface IShowPandaState {}

export default class ShowPanda extends React.Component<
  IShowPandaProps,
  IShowPandaState
> {
  static contextType = Context;

  constructor(props: IShowPandaProps) {
    super(props);
  }

  render() {
    //    const value = this.context;

    return null;
  }
}
