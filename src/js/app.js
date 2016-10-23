document.addEventListener("DOMContentLoaded", function() {

  //code largely based on http://stackoverflow.com/questions/18425440/displaying-map-using-d3-js-and-geojson/38552478#38552478

  //---DECLARATIONS---

  //Width and height
  var w = 960;
  var h = 500;

  //GeoJSON file list
  var list_2010 = ['/data/2010/total_population.csv', '/data/2010/race.csv'];

  function plotData(filepath, year) {

    //Define map projection
    var projection = d3.geo.mercator()
                           .translate([0, 0])
                           .scale(1);

    //Define path generator
    var path = d3.geo.path()
                     .projection(projection);
    
    //Load in GeoJSON data
    d3.json("/data/geojson/west_windsor_shape.json", function(json) {

      //Create SVG element
      var svg = d3.select(`section.year-${year}`)
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h)
                  .attr('viewBox', '0 0 960 500')
                  .attr('preserveAspectRatio', 'xMidYMid meet');

      // Calculate bounding box transforms for entire collection
      var b = path.bounds(json),
      s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h),
      t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];

      // Update the projection    
      projection
        .scale(s)
        .translate(t);

      //Bind data and create one path per GeoJSON feature
      svg.selectAll("path")
         .data(json.features)
         .enter()
         .append("path")
         .attr("d", path)
         .style("fill", "steelblue");
      });

    //Load the actual data onto the shape
    d3.csv(filepath, function(data) {

      for(var index in data) {
        var entry = data[index];

        if(entry.NAME.toLowerCase() === 'west windsor township') {
          console.log('filepath is: ' + filepath);
          console.log(entry);
        }
      }
    });
  };

  //---FUNCTION CALLS---

  for(var i = 0; i < list_2010.length; i++) {

    plotData(list_2010[i], "2010");
  }

});