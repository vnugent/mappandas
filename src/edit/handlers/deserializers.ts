import { FeatureCollection2 } from "@mappandas/yelapa";
import { Feature } from "geojson";
import { Data } from "slate";
import { geocoder_lookup1 } from "../../Mapbox";

export const locationToFeature = async (text: string) => {
  return await geocoder_lookup1(text);
};

export const geocoderLookupAndCache = async (entry, editor) => {
  const { location, mDescription } = entry;
  const mlines = mDescription.map(node => {
    return node.getFirstText().text;
  });
  const locationStr = location.getFirstText().text;
  if (locationStr === location.data.get("text")) {
    console.log("location text has not changed");
    return;
  }
  if (locationStr.trim() === "") {
    editor.setNodeByKey(location.key, {
      data: {}
    });
    console.log("Empty location text -> reset cached feature");
    return;
  }

  try {
    const feature = await locationToFeature(locationStr);

    if (!feature) return undefined;

    feature.properties = {
      name: locationStr,
      description: mlines.toArray()
    };
    editor.setNodeByKey(location.key, {
      data: Data.create({
        text: locationStr,
        feature: feature
      })
    });

    return feature;
  } catch (error) {
    return undefined;
  }
};

/**
 * Turn Slate document to FeatureCollection
 */
export const toGeojson = (uuid, value): FeatureCollection2 => {
  const { document } = value;
  const listNode = document.nodes.filter(node => node.type === "list").first();
  const overviews = document.nodes.filter(node => node.type === "overview");
  const features = listNode ? listToFeatures(listNode) : [];
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

const listToFeatures = (list): Feature[] => {
  return list.nodes
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
