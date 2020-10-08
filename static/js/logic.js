// Perform a GET request to the query URL
d3.csv("static/data/ufo_location.csv").then(function(res) {
  var featuress = [];
    for(let i = 0; i < res.length ; i++){
      let valu = Object.values(res[i]);
      var geojsonFeature = {
        "type": "Feature",
        "properties": res[i],
        "geometry": {
            "type": "Point",
            "coordinates": [ valu[10],valu[9], 5.5]
        }
      }; 
      featuress.push(geojsonFeature)
    }
    createFeatures(featuress);
})
.catch(function(error){
    console.log(error) 
})

function createFeatures(ufoSightingData) {

  var military_bases = [];
  var geojsonFeature1 = {
    "type": "Feature",
    "properties": {city:'Washington', shape:"Fort Lee", duration:"Virginia", latitude:"47.751076", longitude:"-120.740135"},
    "geometry": {
        "type": "Point",
        "coordinates": [ -120.740135, 47.751076,5.5]
    }
  };
  var geojsonFeature2 = {
    "type": "Feature",
    "properties": {city:'Los Angeles', shape:"Fort Lee", duration:"Virginia", latitude:"34.052235", longitude:"-118.243683"},
    "geometry": {
        "type": "Point",
        "coordinates": [-118.243683, 34.052235, 5.5]
    }
  }; 
  var geojsonFeature3 = {
    "type": "Feature",
    "properties": {city:'London', shape:"Fort Lee", duration:"Virginia", latitude:"34.052235", longitude:"-120.243683"},
    "geometry": {
        "type": "Point",
        "coordinates": [ 34.052235, -120.243683,6]
    }
  }; 
  var geojsonFeature4 = {
    "type": "Feature",
    "properties": {city:'New York', shape:"Fort Lee", duration:"Virginia", latitude:"40.712776", longitude:"-74.005974"},
    "geometry": {
        "type": "Point",
        "coordinates": [ -74.005974, 40.712776,5.5]
    }
  }; 
  var geojsonFeature5 = {
    "type": "Feature",
    "properties": {city:'New jersey', shape:"Fort Lee", duration:"Virginia", latitude:"40.712776", longitude:"-73.005974"},
    "geometry": {
        "type": "Point",
        "coordinates": [ -73.005974,40.712776, 5.5]
    }
  }; 
  military_bases.push(geojsonFeature1)
  military_bases.push(geojsonFeature2)
  military_bases.push(geojsonFeature3)
  military_bases.push(geojsonFeature4)
  military_bases.push(geojsonFeature5)

  var ufoSightings = L.geoJSON(ufoSightingData, {
    onEachFeature: function(feature, layer) {
      let valu = Object.values(feature.properties);
      layer.bindPopup("<h3>Duration in Seconds: " + valu[5] +"</h3><h3>Shape: "+ valu[4] +
        "</h3><h3>Location: " + valu[1] +"</h3><hr><p>" + valu[6] + "</p>");
    },
    
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: getRadius(2),
        fillColor: getColor(2),
        fillOpacity: .6,
        color: "#000",
        stroke: true,
        weight: .8
    })
  }
  });
  
  var military_bases_data = L.geoJSON(military_bases, {
    onEachFeature: function(feature, layer) {
      let valu = Object.values(feature.properties);
      layer.bindPopup("<h3>Location: "+ valu[0] + "</h3><h3>Site Name: "+ valu[1] +
        "</h3><hr><p>" + valu[3] + "</p>");
    },
    
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: getRadius(3),
        fillColor: getColor(5),
        fillOpacity: .6,
        color: "#000",
        stroke: true,
        weight: .9
    })
  }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(ufoSightings, military_bases_data);
}


function createMap(ufoSightings, military_bases_data) {
    var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    });
    // Define a baseMaps object to hold our base layers
    // Pass in our baseMaps 
    var baseMaps = {
      "Positron": positron
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "UFO Sightseeings": ufoSightings,
      "Military Bases" : military_bases_data
    };

    // Create our map, giving it the outdoors, earthquakes and tectonic plates layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71],
      zoom: 3.25,
      layers: [positron, ufoSightings, military_bases_data]
    }); 

  
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  //Create a legend on the bottom left
  var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function(myMap){
      var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
}
   

  //Create color range for the circle diameter 
  function getColor(d){
    return d > 5 ? "#a54500":
    d  > 4 ? "#FF0000":
    d > 3 ? "#ff6f08":
    d > 2 ? "#ff9143":
    d > 1 ? "#ffb37e":
             "#ffcca5";
  }

  //Change the maginutde of the earthquake by a factor of 25,000 for the radius of the circle. 
  function getRadius(value){
    return value*25000
  }