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
  if (locationStr.trim() === "" || locationStr === location.data.get("text")) {
    console.log("location text has not changed");
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
  return {
    type: "FeatureCollection",
    properties: {
      uuid: uuid,
      title: document.nodes.first().getFirstText().text,
      summary:  textNodesToArrayOfString(overviews)
    },
    features: listNode ? listToFeatures(listNode) : []
  };
};

const listToFeatures = (list): Feature[] => {
  return list.nodes
    .filter(entry => entry.nodes.first().data.has("feature"))
    .map(entry => {
      const data = entry.nodes.first().data;
      const feature = data.get("feature");
      feature.properties = {
        name: data.get("text"),
        description: textNodesToArrayOfString(entry
          .getBlocksByType("description"))
      };
      return feature;
    })
    .toArray();
};

const textNodesToArrayOfString = (node: any) => node.map(node => node.getFirstText().text)
.filter(text => text.trim() !== "")
.toArray()
