import airports from './airports.js'

const map = new mapboxgl.Map({
  container: 'map',
  // style: 'http://192.168.10.24/styles/basic-preview/style.json',
  // style: 'https://api.maptiler.com/maps/osm-standard/style.json?key=zeZxj1B2TtSjxOmGaIcR',
  // style: 'https://api.maptiler.com/maps/86ef31f4-f87d-4f92-b21d-f9027e63e8ec/style.json?key=zeZxj1B2TtSjxOmGaIcR',
  style: './js/style.json',
  // center: [-0.631027, 51.215485],
  center: [-0.4542955, 51.4700223], // Heathrow
  zoom: 12 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Add markers to the map.
for (const marker of airports.details) {
  // Create a DOM element for each marker.
  const el = document.createElement('div');
  el.className = 'marker';

  el.addEventListener('click', () => {
    window.alert(marker.properties.title);
  });

  // Add markers to the map.
  new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);
}

map.on('load', () => {
  map.addSource('circleHeathrow', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-0.4542955, 51.4700223]
        }
      }]
    }
  });

  map.addLayer({
    id: "circleHeathrow",
    type: "circle",
    source: "circleHeathrow",
    paint: {
      "circle-radius": {
        stops: [
          [5, 1],
          [15, 1024]
        ],
        base: 2
      },
      "circle-color": "red",
      "circle-opacity": 0.2
    }
  });
})