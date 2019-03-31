//import * as F from "../Factory";
import { FeatureCollection2 } from "@mappandas/yelapa";
import * as _ from "underscore";
import { Block, Text } from "slate";

import { toGeojson } from "./deserializers";
import addLocation from "../actions/addLocation";
import { uploadImage } from "../ImageUtils";

const onDelete = (key: number, uuid: string, fn, editor: any) => {
  console.log("onDelete ref", key);
  const e = editor.removeNodeByKey(key);
  _.delay(f => {
    const fc = toGeojson(uuid, e.value);
    fn(fc, { shouldUpdateView: true });
  }, 200);
};

const onAdd = (key: number, editor: any) => {
  addLocation(editor);
};

const insertImageHandler = (key: number, imageData, editor: any) => {
  //TODO
  // insert photo at key
  editor.command(insertImage, imageData);
};

const insertImage = (editor, src, target) => {
  if (target) {
    editor.select(target);
  }

  const image = Block.create({
    type: "image",
    data: { src }
  });

  const caption = Block.create("caption");

  const figure = Block.create({
    type: "figure",
    nodes: [image, caption]
  });

  uploadImage(src)
    .then(url => {
      editor.setNodeByKey(image.key, {
        type: "image",
        data: { url }
      });
      console.log("uploaded", url);
    })
    .catch(reason => console.log(reason));
  console.log("## insert figure block", figure.toJS());
  editor.insertBlock(figure);
};

export const create = (
  uuid: string,
  fn: (FeatureCollection2, options: any) => void,
  editor: any
) => {
  return {
    onAdd: (key: number) => onAdd(key, editor),
    onDelete: (key: number) => onDelete(key, uuid, fn, editor),
    insertImage: (key: number, imageData: any) =>
      insertImageHandler(key, imageData, editor)
  };
};
