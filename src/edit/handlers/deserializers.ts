import { FeatureCollection2 } from "@mappandas/yelapa";
import { Feature } from "geojson";
import { Data } from "slate";
import { geocoder_lookup1 } from "../../Mapbox";

export const locationToFeature = async (text: string) => {
  return await geocoder_lookup1(text);
};

/**
 * Turn Slate document to FeatureCollection
 */
export const toGeojson = (uuid, value): FeatureCollection2 => {
  const { document } = value;
  const locationCards = document.nodes.filter(node => node.type === "card");
  const overviews = document.nodes.filter(node => node.type === "overview");
  const features = locationCards ? listToFeatures(locationCards) : [];
  return {
    type: "FeatureCollection",
    properties: {
      uuid: uuid,
      title: document.nodes.first().getFirstText().text,
      summary: textNodesToArrayOfString(overviews)
    },
    features: features
  };
};

const listToFeatures = (cards): Feature[] => {
  return cards
    .filter(entry => {
      // current value is different than cache value
      // don't include this feature in global geojson
      const data = entry.nodes.first().data;
      return (
        data.has("feature") && data.get("text") === entry.getFirstText().text
      );
    })
    .map(entry => {
      const data = entry.nodes.first().data;
      const feature = data.get("feature");
      feature.properties = {
        name: data.get("text"),
        description: textNodesToArrayOfString(
          entry.getBlocksByType("description")
        )
      };
      return feature;
    })
    .toArray();
};

const textNodesToArrayOfString = (node: any) =>
  node
    .map(node => node.getFirstText().text)
    .filter(text => text.trim() !== "")
    .toArray();
