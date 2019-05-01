//import * as F from "../Factory";
import { FeatureCollection2 } from "@mappandas/yelapa";
import * as _ from "underscore";
import { Block, Text } from "slate";

import addLocation from "../actions/addLocation";
import { uploadImage } from "../ImageUtils";

const onDelete = (key: number, uuid: string, fn, editor: any) => {
  const e = editor.removeNodeByKey(key);
  _.delay(f => {
    fn(null, editor);
  }, 200);
};

const onAdd = (key: number, editor: any) => {
  addLocation(editor);
};

const insertImageHandler = (
  key: number,
  imageData,
  editor: any,
  uuid: string
) => {
  //TODO
  // insert photo at key
  editor.command(insertImage, imageData, uuid);
};

const insertImage = (editor, src, uuid) => {
  const image = Block.create({
    type: "image",
    data: { src }
  });

  const caption = Block.create("caption");

  const figure = Block.create({
    type: "figure",
    nodes: [image, caption]
  });

  const options = {
    context: {
      uuid: uuid
    }
  };
  uploadImage(src, options)
    .then(url => {
      editor.insertBlock(figure).setNodeByKey(image.key, {
        type: "image",
        data: { url }
      });
    })
    .catch(reason => {
      window.alert(
        "Oops... something went wrong while uploading the image. Please try again!"
      );
    });
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
      insertImageHandler(key, imageData, editor, uuid)
  };
};
