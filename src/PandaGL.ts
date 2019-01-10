import { CompositeLayer, GeoJsonLayer, IconLayer } from "deck.gl";
import { Feature, FeatureCollection } from "geojson";
import { featureCollection } from "@turf/helpers";

interface IProps {
  props: any;
}
export default class PandaGL extends CompositeLayer implements IProps {
  static defaultProps = {
    data: []
  };

  props: any;

  static layername = "PandaGL";

  static LIGHT_SETTINGS = {
    lightsPosition: [-125, 50.5, 5000, -122.8, 48.5, 8000],
    ambientRatio: 0.2,
    diffuseRatio: 0.5,
    specularRatio: 0.3,
    lightsStrength: [2.0, 0.0, 1.0, 0.0],
    numberOfLights: 2
  };

  constructor(props: any) {
    super(props);
  }

  makeGeoJSONLayer(fc: FeatureCollection) {
    return new GeoJsonLayer({
      id: "panda-geojson-layer",
      data: fc,
      pickable: true,
      stroked: false,
      filled: true,
      wireframe: true,
      extruded: true,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: [255, 128, 0],
      // getLineColor: d => colorToRGBArray(d.properties.color),
      lightSettings: PandaGL.LIGHT_SETTINGS,
      getRadius: 400,
      getLineWidth: 2,
      getElevation: 10
    });
  }

  makePointLayer(points: Feature[]) {
    return new IconLayer({
      id: "panda-icon-layer",
      data: points,
      pickable: true,
      iconAtlas: "/icon-atlas.png",
      iconMapping: {
        marker: {
          x: 0,
          y: 0,
          width: 128,
          height: 128,
          anchorY: 128,
          mask: true
        }
      },
      sizeScale: 10,
      getPosition: d => d.geometry.coordinates,
      getIcon: d => "marker",
      getSize: 10,
      getColor: d => [255, 128, 0],
      onHover: ({ object, x, y }) => {
        // const tooltip = `${object.name}\n${object.address}`;
      }
    });
  }

  renderLayers() {
    if (!this.props.data || this.props.data.length < 1) {
      return null;
    }

    const features: Feature[] = this.props.data;
    const points: Feature[] = features.filter(
      f => f.geometry.type.toUpperCase() === "POINT"
    );
    const polygons: Feature[] = features.filter(
      f =>
        f.geometry.type.toUpperCase() === "POLYGON" ||
        f.geometry.type.toUpperCase() === "LINESTRING"
    );
    console.log("## PandaGL.renderLayers()", points, polygons);
    return [
      points.length > 0 && this.makePointLayer(points),
      polygons.length > 0 && this.makeGeoJSONLayer(featureCollection(polygons))
    ];
    // return [
    //   points.length > 0 && this.makePointLayer(points),
    //   polygons.length > 0 && this.makeEditableLayer(featureCollection(polygons))
    // ];
  }
}
