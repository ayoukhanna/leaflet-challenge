//queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//  GET request
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

