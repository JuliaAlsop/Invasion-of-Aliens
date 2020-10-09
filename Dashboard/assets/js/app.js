d3.csv("assets/data/nuforc_2000_2014.csv").then(function(res) {
    var data = res.reduce(function(obj, v) {
        obj[v.shape] = (obj[v.shape] || 0) + 1;
        return obj;
    }, {})
    const keys = Object.keys(data)
    const values = Object.values(data)
    var arrData = [];
    for(let i = 0 ; i < keys.length ; i++){
        let obj = ({
            shape : keys[i],
            total_value : values[i]
        })
        arrData.push(obj)
    }
    
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
    createLollipop(arrData);
})      
.catch(function(error){
    console.log(error) 
})



function createLollipop(data) {
    var margin = {top: 10, right: 30, bottom: 90, left: 40},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#lollipop")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    // X axis
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.shape; }))
    .padding(1);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, 13000])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Lines
    svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
        .attr("x1", function(d) { return x(d.shape); })
        .attr("x2", function(d) { return x(d.shape); })
        .attr("y1", function(d) { return y(d.total_value); })
        .attr("y2", y(0))
        .attr("stroke", "grey")

    // Circles
    svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
        .attr("cx", function(d) { return x(d.shape); })
        .attr("cy", function(d) { return y(d.total_value); })
        .attr("r", "4")
        .style("fill", "#69b3a2")
        .attr("stroke", "black")
}

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
    var geojsonFeature6 = {
      "type": "Feature",
      "properties": {city:'Arizona', shape:"Fort Lee", duration:"Virginia", latitude:"34.048927", longitude:"-111.093735"},
      "geometry": {
          "type": "Point",
          "coordinates": [ -111.093735,34.048927, 5.5]
      }
    };
    var geojsonFeature7 = {
      "type": "Feature",
      "properties": {city:'New mexico', shape:"Fort Lee", duration:"Virginia", latitude:"34.519939", longitude:"-105.870087"},
      "geometry": {
          "type": "Point",
          "coordinates": [ -105.870087,34.519939, 5.5]
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

    function show_lolipop(){
        console.log("here map show")
        document.getElementById("lollipop").style.display = 'block';
        document.getElementById("map").style.display = 'none';
    }

    function show_map(){
        console.log("here map")
        document.getElementById("lollipop").style.display = 'none';
        document.getElementById("map").style.display = 'block';
    }