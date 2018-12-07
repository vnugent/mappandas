const MAP_STYLE = {
  version: 10,
  name: "Basic",
  metadata: {
    "mapbox:autocomposite": true
  },
  sources: {
    mapbox: {
      url: "mapbox://styles/mapbox/streets-v10",
      type: "vector"
    },
    points: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [-122.45, 37.78] }
          }
        ]
      }
    }
  },
  layers: [
    {
      id: "my-layer",
      type: "circle",
      source: "points",
      paint: {
        "circle-color": "#f00",
        "circle-radius": "4"
      }
    }
  ]
};

export default MAP_STYLE;
