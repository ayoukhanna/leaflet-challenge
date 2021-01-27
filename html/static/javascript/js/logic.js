//queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//  GET request
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + ": "+feature.properties.mag+
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
  function getColor(feature){
    if (feature.properties.mag > 3)
    return "red"
    else if (feature.properties.mag > 2.5)
    return "purple"
    else if (feature.properties.mag > 2)
    return "orange"
    else if (feature.properties.mag > 1.5)
    return "yellow"
    else if (feature.properties.mag > 1)
    return "blue"
    else if (feature.properties.mag > .5)
    return "white" 
    else return "green"
  }
  //  GeoJSON layer
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature, 
    pointToLayer: function(feature,latlng) {
      return L.circleMarker(latlng)

    },
    style: function(feature,latlng){
      return {
        radius:feature.properties.mag * 4, 
        fillColor: getColor(feature),
        color:"black",
        opacity : 1,
        fillOpacity : 1,
        weight : 0.3
        
          
      
      }
    }
  });

  // createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // baseMaps 
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // overlay object 
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // streetmap and earthquakes layers
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // layer control
  // Pass in baseMaps and overlayMaps
  // Add layer control 
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, .5 , 1.0, 1.5, 2.0, 2.5, 3]
        labels = [];
        colors = ["green", "white", "blue", "yellow", "orange", "purple", "red"]

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
}
