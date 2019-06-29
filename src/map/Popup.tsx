import * as React from "react";
import { withStyles, createStyles } from "@material-ui/core"

interface IAppProps {
  //data: IActiveFeature | null;
}

interface IAppState { }





const styles = () => createStyles({
  root: {
    background: "#fafafa",
    position: "absolute",
    padding: "10px",
    borderRadius: "4px",
    backgroundColor: "#e0f7fa",
    opacity: 0.95,
    border: "2px solid white"
  }
});

const Popup = ({ classes, x, y, index, object, picked, layer }) => {
  if (index === -1 || !object) {
    return null;
  }
  const { layer_attributes } = layer.props;
  const displayName = layer_attributes && layer_attributes.getLabel ? layer_attributes.getLabel(object) : object.properties.name;
  //const p = object.properties;
  return (
    <div
      key={index}
      className={classes.root}
      //className="tooltip interactive"
      style={{ left: x + 10, top: y - 40 }}
    >
      {displayName}
    </div>
  );

}

export default withStyles(styles)(Popup);
