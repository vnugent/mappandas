import { ModeHandler } from "nebula.gl";

export default class MyDrawPointHandler extends ModeHandler {
  handleClick({ groundCoords }) {
    if (!groundCoords) {
      return null;
    }
    const geometry = {
      type: "Point",
      coordinates: groundCoords
    };
    return super.getAddFeatureAction(geometry);
  }
}
