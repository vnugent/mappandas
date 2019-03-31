import { Block, Text } from "slate";
import { List } from "immutable";

export const initializeList = (nodes?: any) =>
  Block.create({ type: "list", nodes: nodes ? nodes : List.of(createEntry()) });

export const createEntry = () =>
  Block.create({
    type: "card",
    nodes: List.of(
      Block.create({
        type: "location",
        nodes: List.of(Text.create({ type: "text" }))
      }),
      Block.create("description")
    )
  });

export const createOverview = () =>
  Block.create({
    type: "overview",
    nodes: List.of(Text.create({ type: "text" }))
  });
