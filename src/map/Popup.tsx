import * as React from "react";
import { IActiveFeature } from "../types/CustomMapTypes";

interface IAppProps {
  //data: IActiveFeature | null;
}

interface IAppState { }

const Popup = ({ x, y, index, object, picked }) => {
  if (index === -1 || !object) {
    return null;
  }
  const p = object.properties;
  return (
    <div
      key={index}
      className="tooltip interactive"
      style={{ left: x + 10, top: y - 40 }}
    >
      {p && p.name}
    </div>
  );

}

export default Popup;
