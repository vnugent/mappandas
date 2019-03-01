import { Block, Text } from "slate";
import { List } from "immutable";

export const initializeList = () =>
  Block.create({ type: "list", nodes: List.of(createEntry()) });

export const createEntry = () =>
  Block.create({
    type: "entry",
    nodes: List.of(
      Block.create({type: "location"}),
      Block.create({ type: "description" })
    )
  });

export const createOverview = () =>
  Block.create({
    type: "overview",
    nodes: List.of(Text.create({ type: "text" }))
  });
