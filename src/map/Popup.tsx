import * as React from "react";
import { IActiveFeature } from "src/types/CustomMapTypes";

interface IAppProps {
  data: IActiveFeature | null;
}

interface IAppState {}

class Popup extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
  }

  render() {
    if (this.props.data === null) {
      return null;
    }
    const { x, y, index, object } = this.props.data;
    if (index === -1 || !object) {
      return null;
    }
    const p = object.properties;
    return (
      <div
        key={index}
        className="tooltip interactive"
        style={{ left: x + 20, top: y - 40 }}
      >
        {p && p.name}
      </div>
    );
  }
}

export default Popup;
