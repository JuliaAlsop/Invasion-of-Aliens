d3.csv("assets/data/ufo_location.csv").then(function(res) {
    var data = res.reduce(function(obj, v) {
        obj[v.shape] = (obj[v.shape] || 0) + 1;
        return obj;
    }, {})
    const keys = Object.keys(data)
    const values = Object.values(data)
    var arrData = [];
    var greatest = 0;
    var smallest = 0;
    for(let i = 0 ; i < keys.length ; i++){
        let obj = ({
            shape : keys[i],
            total_value : values[i]
        })
        arrData.push(obj)
        if(values[i] > greatest){
          greatest = values[i]
        }

        if(values[i] < smallest){
          smallest = values[i]
        }
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

    d3.json("assets/data/military_bases.geojson").then(function(res) {    
      createFeatures(featuress, res);
    }).catch(function(err){
      console.log(err)
    })

  
    createLollipop(arrData);
    createWorldCloud(arrData);
    createViolin(smallest, greatest, arrData, keys)
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

function createViolin(small, great, data, myKeys){
  var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#violin")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Build and Show the Y scale
  var y = d3.scaleLinear()
    .domain([ small, great])          // Note that here the Y scale is set manually
    .range([height, 0])
  svg.append("g").call( d3.axisLeft(y) )

  // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myKeys)
    .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // Features of the histogram
  var histogram = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
        .value(d => d)

  // Compute the binning for each group of the dataset
  var sumstat = data;
  // var sumstat = d3.nest()  // nest function allows to group the calculation per level of a factor
  //   .key(function(d) { return d.shape;})
  //   .rollup(function(d) {   // For each key..
  //     input = d.map(function(g) { return g.total_value;})    // Keep the variable called Sepal_Length
  //     bins = histogram(input)   // And compute the binning on it.
  //     return(bins)
  //   })
  //   .entries(data)

    

  // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
  var maxNum = great
  // for ( i in sumstat ){
  //   allBins = sumstat[i].value
  //   lengths = allBins.map(function(a){return a.length;})
  //   longuest = d3.max(lengths)
  //   if (longuest > maxNum) { maxNum = longuest }
  // }

  // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
  var xNum = d3.scaleLinear()
    .range([0, x.bandwidth()])
    .domain([-maxNum,maxNum])

  // Add the shape to this svg!
  svg
    .selectAll("myViolin")
    .data(sumstat)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + x(d.shape) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.total_value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .attr("d", d3.area()
            .x0(function(d){ return(xNum(-d.total_value)) } )
            .x1(function(d){ return(xNum(d.total_value)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
        )

}

function createWorldCloud(data){
  // set the dimensions and margins of the graph
  var myWords = data;
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 1000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#worldCloud").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
  // Wordcloud features that are different from one word to the other must be here
  var layout = d3.layout.cloud()
  .size([width, height])
  .words(myWords.map(function(d) { return {text: d.shape, size:30}; }))
  .padding(5)        //space between words
  .rotate(function() { return ~~(Math.random() * 2) * 90; })
  .fontSize(function(d) { return d.size; })      // font size of words
  .on("end", draw);
  layout.start();

  // This function takes the output of 'layout' above and draw the words
  // Wordcloud features that are THE SAME from one word to the other can be here
  function draw(words) {
  svg
  .append("g")
    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size; })
      .style("fill", "#69b3a2")
      .attr("text-anchor", "middle")
      .style("font-family", "Impact")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
  }
}

function createFeatures(ufoSightingData,res) {

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
    military_bases.push(geojsonFeature6)
    military_bases.push(geojsonFeature7)
  
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
    
    var military_bases_data = L.geoJSON(res, {
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
        document.getElementById("lollipop").style.display = 'block';
        document.getElementById("map").style.display = 'none';
        document.getElementById("violin").style.display = 'none';
        document.getElementById("worldCloud").style.display = 'none';
    }

    function show_map(){
      document.getElementById("lollipop").style.display = 'none';
      document.getElementById("map").style.display = 'block';
      document.getElementById("violin").style.display = 'none';
      document.getElementById("worldCloud").style.display = 'none';
    }

    function worldCloud(){
      document.getElementById("lollipop").style.display = 'none';
      document.getElementById("map").style.display = 'none';
      document.getElementById("violin").style.display = 'none';
      document.getElementById("worldCloud").style.display = 'block';
    }

    function violin(){
      document.getElementById("lollipop").style.display = 'none';
      document.getElementById("map").style.display = 'none';
      document.getElementById("violin").style.display = 'block';
      document.getElementById("worldCloud").style.display = 'none';
    }