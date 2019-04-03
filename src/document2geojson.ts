import { Feature, FeatureCollection } from "geocoder";
import { Block, Data } from "slate";

import { geocoder_lookup1 } from "./Mapbox";

/**
 * Convert Slate document to FeatureCollection
 * @param location
 * @param editor
 */
export const onUpdateHandler = (location, editor) => {
  const { document } = editor.value;

  const listOfCards = document.nodes.filter(node => node.type === "card");
  const features = listOfCards ? listToFeatures(listOfCards) : [];
};

export const handleCurrentLocationUpdate = async (location, editor) => {
  if (!location) {
    return Promise.resolve();
  }
  const { data, text } = location;
  const cacheText = data.get("text");
  if (cacheText === text) {
    // text hasn't changed
    return;
  }
  console.log(" - location text has changed looking up", text);
  const feature = await geocoder_lookup1(text);
  console.log("   result ", feature);
  const newLoc = Block.create({
    type: "location",
    nodes: location.nodes,
    data: { text, feature }
  });
  editor.setNodeByKey(location.key, newLoc);
  return Promise.resolve();
};

export const documentToGeojson = (document): FeatureCollection => {
  const listOfCards = document.nodes.filter(node => node.type === "card");
  const features = listOfCards ? listToFeatures(listOfCards) : [];
  return {
    type: "FeatureCollection",
    features: features
  };
};



const listToFeatures = (cards): Feature[] => {
  return cards
    .filter(entry => entry.nodes.first().data.has("feature"))
    .map(entry => {
      const data = entry.nodes.first().data;
      const feature = data.get("feature");

      feature.properties = {
        name: data.get("text"),
        description: ""
      };
      return feature;
    })
    .toArray();
};

export const computeGeojson = async (location, editor, sucessFn) => {
  try {
    await handleCurrentLocationUpdate(location, editor);
    const fc = documentToGeojson(editor.value.document);
    sucessFn(fc);
  } catch (error) {
    return Promise.reject(error);
  }
};
