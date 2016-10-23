document.addEventListener("DOMContentLoaded", function() {

  //code largely based on http://stackoverflow.com/questions/18425440/displaying-map-using-d3-js-and-geojson/38552478#38552478

  //---DECLARATIONS---

  //Width and height
  var w = 960;
  var h = 500;

  //CSV file list
  var county_list_2010 = ['/data/county/2010/total_population.csv', '/data/county/2010/race.csv'];

  //CSV file list
  var tract_list_2010 = ['/data/tracts/2010/race.csv'];

  function plotData(filepath, year) {

    //Define map projection
    var projection = d3.geo.mercator()
                           .translate([0, 0])
                           .scale(1);

    //Define path generator
    var path = d3.geo.path()
                     .projection(projection);
    
    //Load in GeoJSON data
    d3.json("/data/tracts/geojson/west_windsor_shape.json", function(json) {

      //Create SVG element
      var svg = d3.select(`section.year-${year}`)
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h)
                  .attr('viewBox', '0 0 960 500')
                  .attr('preserveAspectRatio', 'none');

      // Calculate bounding box transforms for entire collection
      var b = path.bounds(json),
      s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h),
      t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];

      // Update the projection    
      projection
        .scale(s)
        .translate(t);

      var tractShapes = [];

      for(var i = 0; i < json.features.length; i++) {

        var currID = json.features[i].properties.GEOID10;

        // console.log(currID);

        if(tractIDs.indexOf(currID) >= 0) {
          tractShapes.push(json.features[i]);
        }
      }

      //Bind data and create one path per GeoJSON feature
      svg.selectAll("path")
         .data(tractShapes)
         .enter()
         .append("path")
         .attr("d", path)
         .attr("geo_name", function(d) { return d['properties']['NAMELSAD10'];})
         .attr("geo_id", function(d) { return d['properties']['GEOID10'];})
         .attr("class", "tractpath")
         .attr("onclick", "tractClick(event)")
         .style("fill", "steelblue");
      });
  };

  //---FUNCTION CALLS---

  for(var i = 0; i < tract_list_2010.length; i++) {

    plotData(tract_list_2010[i], "2010");
  }

});

  var tractIDs = ['34021000100','34021000200','34021000300','34021000400','34021000500','34021000600','34021000700','34021000800','34021000900','34021001000','34021001101','34021001102'
,'34021001200'
,'34021001300'
,'34021001401'
,'34021001402'
,'34021001500'
,'34021001600'
,'34021001700'
,'34021001800'
,'34021001900'
,'34021002000'
,'34021002100'
,'34021002200'
,'34021002400'
,'34021002500'
,'34021002601'
,'34021002602'
,'34021002701'
,'34021002702'
,'34021002800'
,'34021002902'
,'34021002903'
,'34021002904'
,'34021003001'
,'34021003002'
,'34021003003'
,'34021003004'
,'34021003006'
,'34021003007'
,'34021003008'
,'34021003009'
,'34021003100'
,'34021003201'
,'34021003202'
,'34021003301'
,'34021003302'
,'34021003400'
,'34021003500'
,'34021003601'
,'34021003602'
,'34021003703'
,'34021003704'
,'34021003705'
,'34021003706'
,'34021003800'
,'34021003902'
,'34021003903'
,'34021003904'
,'34021003905'
,'34021004000'
,'34021004201'
,'34021004203'
,'34021004204'
,'34021004301'
,'34021004304'
,'34021004306'
,'34021004307'
,'34021004309'
,'34021004310'
,'34021004403'
,'34021004404'
,'34021004405'
,'34021004406'
,'34021004407'
,'34021004501'
,'34021004502'];

function loadCSVData(filepath) {
  //Load the actual data onto the shape

  d3.csv(filepath, function(data) {

    for(var index in data) {
      var entry = data[index];

      if(tractIDs.indexOf(entry.GEOID) >= 0) {

        // .attr("population_african", function(d) { console.log(d); return d;})
        var paths = $(".tractpath");

        for(var i = 0; i < paths.length; i++) {
          if($(paths[i])[0]['attributes'][2].nodeValue === entry.GEOID) {
            var thePath = $(paths[i]);

            console.log(entry.P003002);

            thePath.attr("population_white", entry.P003002);
            thePath.attr("population_african", entry.P003003);
            thePath.attr("population_indian", entry.P003004);
            thePath.attr("population_asian", entry.P003005);
            thePath.attr("population_hawaiian", entry.P003006);
            thePath.attr("population_other", entry.P003007);
          }
        }
        // $(".tractpath").attr('geo_name') === entry;
      }
    }
  });
};

function tractClick(e) {
  var pathAttrs = $(e)[0]['path'][0]['attributes'];

  var id;
  var name;
  var population_white;
  var population_african;
  var population_indian;
  var population_asian;
  var population_hawaiian;
  var population_other;

  loadCSVData('/data/tracts/2010/race.csv');

  for(var i = 0; i < pathAttrs.length; i++) {
    if(pathAttrs[i].name === 'geo_id') {
      id = pathAttrs[i].nodeValue;
    }

    if(pathAttrs[i].name === 'geo_name') {
      name = pathAttrs[i].nodeValue;
    }

    if(pathAttrs[i].name === 'population_white') {
      population_white = pathAttrs[i].nodeValue;
    }

    if(pathAttrs[i].name === 'population_african') {
      population_african = pathAttrs[i].nodeValue;
    }

    if(pathAttrs[i].name === 'population_indian') {
      population_indian = pathAttrs[i].nodeValue;
    }

    if(pathAttrs[i].name === 'population_asian') {
      population_asian = pathAttrs[i].nodeValue;
    }

    if(pathAttrs[i].name === 'population_hawaiian') {
      population_hawaiian = pathAttrs[i].nodeValue;
    }

    if(pathAttrs[i].name === 'population_other') {
      population_other = pathAttrs[i].nodeValue;
    }
  }

  alert('Geo ID: ' + id + 
        '\n' +
        'Geo Name: ' + name+ 
        '\n' + '\n' + 
        'Population - White: ' + population_white+ 
        '\n' +
        'Population - African American: ' + population_african+ 
        '\n' +
        'Population - American Indian: ' + population_indian+ 
        '\n' +
        'Population - Asian: ' + population_asian+ 
        '\n' +
        'Population - Native Hawaiian: ' + population_hawaiian+ 
        '\n' +
        'Population - Other: ' + population_other);
};