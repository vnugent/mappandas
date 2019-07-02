import DeckGL, { IconLayer, GeoJsonLayer, ScreenGridLayer, HexagonLayer } from 'deck.gl';
import {PhongMaterial} from '@luma.gl/core';
import { Value } from "slate";


import { initialValue } from "../edit/slate-default";
import { documentToGeojson } from "../document2geojson";

import * as restClient from "../RestClient";

  
const material = new PhongMaterial({
    ambient: 0.8,
    diffuse: 0.4,
    shininess: 30,
    specularColor: [51, 51, 51]
  });

const CONFIG = [
    {
        uuid: "1580",
        type: "geojson",
        category: "Experience",
        label: "Neighborhood",
        color: [99, 57, 64],
        dataUrl: "/data/pdx-neighborhoods.geojson",
        data: null,
        getLabel: feature => feature.properties.MAPLABEL,
        autoHighlight: true
    },
    {
        uuid: "1600",
        type: "grid",
        category: "Experience",
        label: "Crime",
        color: [99, 57, 64],
        dataUrl: "/data/pdx-crime.json",
        data: null,
        getLabel: feature => feature.properties.MAPLABEL,
    },
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
        uuid: "158b2a30-98c2-11e9-a22f-57399ae5c160",
        category: "Experience",
        label: "Dining out",
        icon: "dining",
        color: [99, 57, 64]
    },
    {
        uuid: "0923a460-6c13-11e9-a958-3ddcfa2a9806",
        category: "Home",
        label: "My search",
        color: [99, 57, 116]
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
        switch (entry.type) {
            case "geojson":
                const geojson = await restClient.getTextFile(entry.dataUrl);
                entry.data = geojson;
                map.set(entry.uuid, makeGeojsonLayer(entry, false))
                return;
            case "grid":
                const json = await restClient.getTextFile(entry.dataUrl);
                //entry.data = json;
                entry.data = json.filter(row=>(row.OpenDataLon && 0 !== row.OpenDataLon.length) && (row.OpenDataLat && 0 !== row.OpenDataLat.length));
                console.log("crime", entry.data.length)
                map.set(entry.uuid, makeHexagonLayer(entry, false))
                return;
            default:
                map.set(entry.uuid, makeIconLayer(entry, true));
                return;
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
        return [d.geometry.coordinates[0], d.geometry.coordinates[1], 5]
    },
    getIcon: d => entry.icon ? entry.icon : "marker",
    getSize: entry.category === "Home" ? 25 : 15,
    getColor: entry.color,
    getPolygonOffset: ({layerIndex}) => [0, -layerIndex * 2000]
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

const makeHexagonLayer = (entry, visible) => {
    return new HexagonLayer({
        id: 'hexagon-layer',
        data: entry.data,
        layer_attributes: entry,
        //pickable: true,
        extruded: true,
        radius: 50,
        elevationScale: 1,
        coverage:0.8,
        colorRange:[
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]],
        //elevationRange: [0, 3000],
        visible,
        opacity: 1,
        getPosition: d => {
            //console.log(d.OpenDataLon, d.OpenDataLat);
            return [Number(d.OpenDataLon), Number(d.OpenDataLat)]
        },
        material
    });
}

const makeScreenGridLayer = (entry, visible) => {
    return new ScreenGridLayer({
        id: 'screen-grid-layer',
        data: entry.data,
        layer_attributes: entry,
        pickable: false,
        opacity: 0.5,
        cellSizePixels: 15,
        cellMarginPixels: 5,
        colorRange: [
            [241, 238, 246],
            [208, 209, 230],
            [166, 189, 219],
            [116, 169, 207],
            [43, 140, 190],
            [4, 90, 141]
        ],
        visible,
        getPosition: d => [d.OpenDataLon, d.OpenDataLat],
        getWeight: d => 4
    });
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
        switch (config.type) {
            case "geojson":
                return data.set(uuid, makeGeojsonLayer(config, !layer.props.visible));
            case "grid":
                return data.set(uuid, makeHexagonLayer(config, !layer.props.visible));
            default:
                return data.set(uuid, makeIconLayer(config, !layer.props.visible));
        }
    }
    return data;
}