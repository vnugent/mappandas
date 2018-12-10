import { ModeHandler } from "nebula.gl";

export default class MyDrawPointHandler extends ModeHandler {
  handleClick({ groundCoords }) {
    if (!groundCoords) {
      console.log("groundCoords is null");
      return null;
    }
    const geometry = {
      type: "Point",
      coordinates: groundCoords
    };
    console.log(">>> MyDrawPointHandler.handleClick() ", geometry);
    //console.log("   ", super.getAddFeatureAction())
    return super.getAddFeatureAction(geometry);
  }
}
