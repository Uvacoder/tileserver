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




// sunnyside red / amber areas on map
// let mapDataRed = {
//   type: 'FeatureCollection',
//   crs: { "type": "name", "Properties": { "name": "urn:ogc:def:crs:EPSG::4326" } },
//   totalFeatures: 1,
//   features: [{
//     type: "Feature",
//     id: "ProtectedAreaRed.0",
//     geometry_name: "RedArea",
//     geometry: {
//       type: "Polygon",
//       coordinates: [
//         [
//           [ -1.1002058078992472, 51.382176865511724 ],
//           [ -1.1010611346245336, 51.381903440191536 ],
//           [ -1.1010343125725803, 51.38152027003579 ],
//           [ -1.1009687474269478, 51.38121335955111 ],
//           [ -1.1008942418028775, 51.38081716296102 ],
//           [ -1.1008286765836957, 51.380675796259936 ],
//           [ -1.100664763883323, 51.38074275950581 ],
//           [ -1.1002594523716096, 51.38093434827414 ],
//           [ -1.099916725518632, 51.381090594778726 ],
//           [ -1.099565058187217, 51.38122638003361 ],
//           [ -1.0992819358334953, 51.38132310351574 ],
//           [ -1.0992461732649088, 51.38137890545528 ],
//           [ -1.0992938567988304, 51.381470048471755 ],
//           [ -1.100134282525258, 51.38219546582641 ],
//           [ -1.1002058078992472, 51.382176865511724 ]
//         ]
//       ]
//     },
//     properties: {},
//   }]
// };

// let SSCircle = new ol.layer.Vector({
//   zIndex: 6,
//   source: new ol.source.Vector({
//     features: (new ol.format.GeoJSON().readFeatures(mapDataRed, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }))
//   }),
//   style: [
//     new ol.style.Style({
//       stroke: new ol.style.Stroke({
//         color: 'red',
//         width: 2,
//         lineDash: [2, 5]
//       }),
//       fill: new ol.style.Fill({
//         color: 'rgba(0, 0, 255, 0.1)'
//       })
//     })
//   ],
// });
// // adds the Cicle layer object to the map
// map.addLayer(SSCircle)


// Add random points to the map at 1second intervals
// Gatwick [-0.182063, 51.153662]
const bounds = {
  north: 51.183662,
  south: 51.133662,
  east: -0.202063,
  west: -0.162063,
};
const lngSpan = bounds.east - bounds.west
const latSpan = bounds.north - bounds.south

const source = new ol.source.Vector({
  wrapX: false //  check API for what wrapX is
})

const vector = new ol.layer.Vector({
  source: source, // set the above source to the new vector layer so it's visible on the map
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: 'orange'
      })
    })
  }),
  zIndex: 6
})
map.addLayer(vector) // very important to show the new points!

function generateRandomFeature() {
  const lon = bounds.west + lngSpan * Math.random()
  const lat = bounds.south + latSpan * Math.random()

  const geom = new ol.geom.Point(ol.proj.fromLonLat([lon,lat]))
  const feature = new ol.Feature(geom)

  source.addFeature(feature)
}

source.on('addfeature'), function () {
  map.render();
}

window.setInterval(generateRandomFeature, 2000);