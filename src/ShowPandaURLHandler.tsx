import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Value } from "slate";
const uuidv1 = require("uuid/v1");

import { initialValue } from "./edit/slate-default";
import * as restClient from "./RestClient";
import Editor from "./Editor";

interface IShowPandaProps extends RouteComponentProps {
  editNew: boolean;
}

interface IShowPandaState { }

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
  }

  // shouldComponentUpdate(
  //   nextProps: IShowPandaProps,
  //   nextState: IShowPandaState
  // ) {
  //   console.log("#shouldcomponentupdate()")
  //   const current = this.props.match["uuid"];
  //   const next = nextProps.match.params["uuid"];
  //   return current !== next;
  // }

  componentDidUpdate(preProps: IShowPandaProps) {
    console.log("#ShowPanda.CDU()")
    // const prevLayout = parseLayout(prevUrlParams.get("layout"));

    // const urlParams = new URLSearchParams(this.props.location.search);


    // if (layout !== prevLayout) {
    //   //this.props.updateLayout(layout);
    //   const uuid = this.props.match.params["uuid"];


    // }
  }


  render() {
    const { editNew } = this.props;
    const key = this.props.location.key || uuidv1();
    const uuid = this.parseUUID();
    const layout = this.parseLayout();
    const editable = this.parseEditable()
    return <Editor {...!editNew && { key: key }} urlKey={key} uuid={uuid} layout={layout} editNew={editNew} editable={editNew || editable} />;
  }

  parseUUID = () => {
    const uuid = this.props.match.params["uuid"];
    return uuid ? uuid : uuidv1();
  }

  parseEditable = () => this.props.match.params["edit"] === "edit" ? true : false;

  parseLayout = () => {
    const rawParam = new URLSearchParams(this.props.location.search).get("layout");

    const param = rawParam ? rawParam.toLowerCase() : "column";
    if (param === "classic" || param === "map" || param === "column") {
      return param;
    }
    return "column";
  }
}


