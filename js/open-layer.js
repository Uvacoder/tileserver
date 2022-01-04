import airports from './airports.js'

const style = 'http://192.168.10.24/styles/basic-preview/style.json'
// const style = './js/maptiler-bright.json'
// const style = './js/style.json'

const map = new ol.Map({
  target: 'map',
  interactions: ol.interaction.defaults({ doubleClickZoom: false }),
  // view: new ol.View({
  //   constrainResolution: true,
  //   center: ol.proj.fromLonLat([-0.4542955, 51.4700223]),
  //   zoom: 14
  // })
  view:  new ol.View({
    center: ol.proj.fromLonLat([-0.182063, 51.153662]),
    zoom: 14,
    maxZoom: 19
  })	//SunnySide
});

// openlayer map style - apply map and the style defined above
olms.apply(map, style);


// start adding points to the map
let point = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [
      new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([-0.182063, 51.153662]))
      })
    ]
  }),
});
// adds the single point of interest on to Gatwick
map.addLayer(point);

// add a Circle Overlay over Gatwick Airport
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