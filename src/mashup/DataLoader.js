import DeckGL, { IconLayer } from 'deck.gl';
import { Value } from "slate";

import { initialValue } from "../edit/slate-default";
import { documentToGeojson } from "../document2geojson";

import * as restClient from "../RestClient";

const CONFIG = [
    {
        uuid: "a45eb070-9434-11e9-9efd-7b5d9aa7ba90",
        category: "Essential",
        label: "Grocery",
        color: [255, 128, 0]
    },
    {
        uuid: "5a4bccd0-976c-11e9-aa16-2d55e69cda75",
        category: "Essential",
        label: "Public schools",
        color: [46, 134, 193]
    },
    {
        uuid: "0923a460-6c13-11e9-a958-3ddcfa2a9806",
        category: "Home",
        label: "My search",
        color: [99, 57, 116]
    }
]
export const loadAll = () => {
    // data.forEach(async entry=>{
    //     const post = await restClient.get(entry.uuid);
    //     entry.data = post;
    // })
    const map = new Map();

    CONFIG.forEach(entry => {
        map.set(entry.uuid, makeIconLayer(entry, true));
    });
    return map;
}

const makeIconLayer = (entry, visible) => new IconLayer({
    id: "panda-icon-layer-" + entry.label,
    layer_attributes: entry,
    data: asyncLoad(entry.uuid).then(data => data),
    pickable: true,
    iconAtlas: "/icon-atlas.png",
    iconMapping: {
        marker: {
            x: 0,
            y: 0,
            width: 128,
            height: 128,
            anchorY: 128,
            mask: true
        }
    },
    visible: visible ? true: false,
    sizeScale: 3,
    autoHighlight: true,
    highlightColor: [139, 195, 74],
    getPosition: d => d.geometry.coordinates,
    getIcon: d => "marker",
    getSize: 15,
    getColor: entry.color,
});

const asyncLoad = async (uuid) => {
    const panda = await restClient.get(uuid);
    const slateContent = Value.fromJSON(panda.content);
    panda.content = Value.isValue(slateContent) ? slateContent : initialValue;
    const geojson = documentToGeojson(panda.content.document);
    console.log("#geojson", geojson);
    return geojson.features;
}

const isSelected = (feature, selection) => {
    const id = feature.properties.dataId;
    return id === selection.id && selection.on ? true : false
}

export const toggleLayer = (uuid, data) => {
    const config = CONFIG.find(item => item.uuid === uuid);
    if (config) {
        const layer = data.get(uuid);
        return data.set(uuid, makeIconLayer(config, !layer.props.visible));
    }
    return data;
}