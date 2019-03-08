//import * as F from "../Factory";
import { FeatureCollection2 } from "@mappandas/yelapa";
import * as _ from "underscore";

import { toGeojson } from "./deserializers";
import addLocation from "../actions/addLocation";

const onDelete = (key: number, uuid: string, fn, editor: any) => {
  console.log("onDelete ref", key);
  const e = editor.removeNodeByKey(key);
  _.delay(f => {
    const fc = toGeojson(uuid, e.value);
    fn(fc);
  }, 200);
};

const onAdd = (key: number, editor: any) => {
  addLocation(editor);
  //   const newEntry = F.createEntry();
  //   console.log("### onAdd()");
  //   const list = editor.value.document.getParent(key);
  //   editor
  //     .insertNodeByKey(list.key, list.nodes.size, newEntry)
  //     .moveToStartOfNode(newEntry.nodes.first());
};

export const create = (
  uuid: string,
  fn: (FeatureCollection2) => void,
  editor: any
) => {
  return {
    onAdd: (key: number) => onAdd(key, editor),
    onDelete: (key: number) => onDelete(key, uuid, fn, editor)
  };
};
