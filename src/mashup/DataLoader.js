import DeckGL, { IconLayer, GeoJsonLayer } from 'deck.gl';
import { Value } from "slate";

import { initialValue } from "../edit/slate-default";
import { documentToGeojson } from "../document2geojson";

import * as restClient from "../RestClient";

const CONFIG = [
    {
        uuid: "a45eb070-9434-11e9-9efd-7b5d9aa7ba90",
        category: "Essential",
        label: "Grocery",
        color: [255, 128, 0],
        icon: "cart"
    },
    {
        uuid: "5a4bccd0-976c-11e9-aa16-2d55e69cda75",
        category: "Essential",
        label: "Public schools",
        color: [46, 134, 193],
        icon: "school"
    },
    {
        uuid: "0923a460-6c13-11e9-a958-3ddcfa2a9806",
        category: "Home",
        label: "My search",
        color: [99, 57, 116]
    },
    {
        uuid: "158b2a30-98c2-11e9-a22f-57399ae5c160",
        category: "Experience",
        label: "Dining out",
        icon: "dining",
        color: [99, 57, 64]
    },
    {
        uuid: "1580",
        type: "geojson",
        category: "Experience",
        label: "Neighborhood",
        color: [99, 57, 64],
        data: null,
        getLabel: feature => feature.properties.MAPLABEL,
        autoHighlight: true
    },
]
export const loadAll = () => {
    // data.forEach(async entry=>{
    //     const post = await restClient.get(entry.uuid);
    //     entry.data = post;
    // })
    const map = new Map();

    CONFIG.forEach(entry => {
        if (entry.type === "geojson") {
            //map.set(entry.uuid, makeGeojsonLayer(entry, true));
        } else {
            map.set(entry.uuid, makeIconLayer(entry, true));
        }
    });
    return map;
}

export const loadGeojson = async () => {
    const map = new Map();
    await Promise.all(CONFIG.map(async entry => {

        if (entry.type === "geojson") {
            const geojson = await restClient.getTextFile("/data/pdx-neighborhoods.geojson");
            entry.data = geojson;
            map.set(entry.uuid, makeGeojsonLayer(entry, true))
        } else {
            map.set(entry.uuid, makeIconLayer(entry, true));
        }
    }));
    return map;
    //CONFIG.forEach(entry => {

    //map.set()
}

const makeIconLayer = (entry, visible) => new IconLayer({
    id: "panda-icon-layer-" + entry.label,
    layer_attributes: entry,
    //layer_content: 
    data: asyncLoad(entry.uuid).then(data => {
        entry.content = data.content;
        return data.features
    }),
    pickable: true,
    iconAtlas: "/icon-atlas2.png",
    iconMapping: {
        marker: {
            x: 0,
            y: 0,
            width: 128,
            height: 128,
            anchorY: 128,
            mask: true
        },
        cart: {
            x: 128,
            y: 0,
            width: 128,
            height: 128,
            mask: false
        },
        school: {
            x: 0,
            y: -128,
            width: 128,
            height: 128,
            mask: false
        },
        dining: {
            x: -128,
            y: -128,
            width: 128,
            height: 128,
            mask: false
        }
    },
    visible: visible ? true : false,
    sizeScale: 4,
    //autoHighlight: true,
    highlightColor: [139, 195, 74],
    getPosition: d => {
        return d.geometry.coordinates
    },
    getIcon: d => entry.icon ? entry.icon : "marker",
    getSize: entry.category === "Home" ? 25 : 15,
    getColor: entry.color,
    getElevation: 200,
    parameters: {
        depthTest: false
    }
});

const makeGeojsonLayer = (entry, visible) => {
    return new GeoJsonLayer({
        id: 'geojson-layer',
        layer_attributes: entry,
        data: entry.data,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: false,
        lineWidthScale: 10,
        lineWidthMinPixels: 1,
        visible: visible,
        getFillColor: [160, 160, 180, 40],
        getLineColor: d => [128, 128, 128],
        getRadius: 100,
        getLineWidth: 1,
        getElevation: 30,
        autoHighlight: entry.autoHighlight || false,
        parameters: {
            depthTest: false
        }
    })
}

const asyncLoad = async (uuid) => {
    const panda = await restClient.get(uuid);
    const slateContent = Value.fromJSON(panda.content);
    panda.content = Value.isValue(slateContent) ? slateContent : initialValue;
    const geojson = documentToGeojson(panda.content.document);
    return { features: geojson.features, content: panda.content };
}

const isSelected = (feature, selection) => {
    const id = feature.properties.dataId;
    return id === selection.id && selection.on ? true : false
}

export const toggleLayer = (uuid, data) => {
    const config = CONFIG.find(item => item.uuid === uuid);
    if (config) {
        const layer = data.get(uuid);
        if (config.type === "geojson") {
            return data.set(uuid, makeGeojsonLayer(config, !layer.props.visible));
        }
        return data.set(uuid, makeIconLayer(config, !layer.props.visible));
    }
    return data;
}