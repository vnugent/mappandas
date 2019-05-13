import * as F from "./Factory";
import { Block } from "slate";

const schema = {
  document: {
    last: { type: "overview" },

    normalize: (editor, { code, node, child, index }) => {
      console.log("##normalize document ", code, node, child, index);
      switch (code) {
        case "last_child_type_invalid": {
          const block = F.createOverview();
          return editor.insertNodeByKey(node.key, node.nodes.size, block);
        }
      }
    }
  },
  inlines: {
    link: {
      //   isVoid: true
    },
    normalize: (editor, { code, node, child, index }) => {
      console.log("##normalize inlines ", code, node, child, index);
    }
  },
  blocks: {
    overview: {},
    figure: {
      nodes: [
        { match: { type: "image" }, min: 1, max: 1 },
        { match: { type: "caption" }, min: 1, max: 1 }
      ]
    },
    image: {
      isVoid: true
    },
    canonical: {
    },
    card: {
      nodes: [
        { match: { type: "location" }, min: 1, max: 1 },
        { match: [{ type: "overview" }, { type: "figure" }], min: 1 }
      ],
      next: {
        type: "overview"
      },

      normalize: (editor, { code, node, child, index }) => {
        const node_map = ["location", "overview"];

        console.log("##normalize location card ", code, node, child, index);
        switch (code) {
          case "child_type_invalid": {
            const type = node_map[index];
            return editor.setNodeByKey(child.key, type);
          }
          case "child_min_invalid": {
            const block = Block.create(node_map[index]);
            return editor.insertNodeByKey(node.key, index, block);
          }
          case "next_sibling_type_invalid": {
            const block = F.createOverview();
            return editor.insertNodeByKey(node.key, index + 1, block);
          }
        }
      }
    }
  },
  // rules: {
  //   nodes: [
  //     { match: { type: "canonical" }, max: 1 }]
  // }
};

export default schema;
