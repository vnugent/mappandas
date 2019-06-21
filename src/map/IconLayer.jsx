import { IconLayer } from '@deck.gl/layers';

export const makeIconLayer = (features, onHoverFn, onClickFn, selection) => {
    const points = features.filter(
        f => f.geometry.type.toUpperCase() === "POINT"
    );
    return new IconLayer({
        id: "panda-icon-layer",
        data: points,
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
        sizeScale: 3,
        autoHighlight: true,
        highlightColor: [139, 195, 74],
        getPosition: d => d.geometry.coordinates,
        getIcon: d => "marker",
        getSize: d => isSelected(d, selection) ? 24 : 15,
        getColor: d => isSelected(d, selection) ? [139, 195, 74] : [255, 128, 0],
        onHover: onHoverFn ? onHoverFn : null,
        onClick: onClickFn ? onClickFn : null
    });
}

const isSelected = (feature, selection) => {
    const id = feature.properties.dataId;
    return id === selection.id && selection.on ? true : false
}