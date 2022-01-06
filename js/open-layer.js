import airports from './airports.js'

// const style = 'http://192.168.10.24/styles/basic-preview/style.json'
// const style = './js/maptiler-bright.json'
// const style = './js/style.json'
// const style = './js/style-local.json'
const style = 'http://localhost:3650/api/maps/basic/style.json'

const map = new ol.Map({
  target: 'map',
  // interactions: ol.interaction.defaults({ doubleClickZoom: false }),
  view: new ol.View({
    center: ol.proj.fromLonLat([-0.182063, 51.153662]),
    zoom: 13
  })
});
// openlayer map style plugin - apply map and the style above
olms.apply(map, style);




// Create Airport Array to add to the map
const airportLonLatArray = airports.details.map( airport => {
  return new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([
      airport.geometry.coordinates[0], airport.geometry.coordinates[1]
    ]))
  })
})

// create points tobe added as a layer to the map as a new vector layer
const points = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: airportLonLatArray
  }),
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({
        color: 'red'
      })
    })
  }),
  zIndex: 100
});
// adds the single point of interest on to Gatwick
map.addLayer(points);




// add a Circle overlay over Gatwick Airport
let centerLongitudeLatitude = ol.proj.fromLonLat([-0.182063, 51.153662]);
let viewProjection = map.getView().getProjection();
let pointResolution = ol.proj.getPointResolution(viewProjection , 1, centerLongitudeLatitude );
let radius = 2600 / pointResolution;

let Circle = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [new ol.Feature(new ol.geom.Circle(centerLongitudeLatitude, radius))]
  }),
  style: [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 2
      }),
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 255, 0.1)'
      })
    })
  ],
  zIndex: 6,
});
// adds the Cicle layer object to the map
map.addLayer(Circle)