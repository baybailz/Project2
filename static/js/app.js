function buildMetadata(year) {

  console.log("I am inside build metadata")

  d3.json(`/metadata/${year}`).then(function(d) {

    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    PANEL.selectAll("h6").data(d).enter().append("h6")
      .text(function(d) { return `
        Acres Burned: ${d["Acres_Burned"]} 
        Cumulative Days of Burning: ${d["Cumulative_Days_of_Burning"]}
        Number of Fires: ${d["Number_of_Fires"]}
        `}); 
  });
}
 
function buildCharts(year) {

  console.log("I am inside build charts");


  d3.json(`/years/${year}`).then((d) => {

    console.log(d)


    var causes = []
    var avgfiresize = []
  
    d.forEach(function(onefire) {
      causes.push(onefire["Cause_Descr"]);
      avgfiresize.push(onefire["Fire_Size"])
    })


    console.log(causes)
    console.log(avgfiresize)
  
  var barTrace = {
    x: causes,
    y: avgfiresize,
    type: "bar",
    marker: {
      color: 'rgb(228, 132, 5)'
    }
    }

  var barData = [barTrace]
  
  var barLayout = {
    title: "Cause of Fires",
    xaxis: {title: "Cause of Fire"},
    yaxis: {title: "Average Acres Burned"}
  }
  Plotly.newPlot("bar", barData, barLayout)
  });

  d3.json(`/bigfires/${year}`).then((d) => {

    console.log(d)
  
    var doy = []
    var topfires = []
    var name = []
    var desired_maximum_marker_size = 100;
  
    d.forEach(function(onetop) {
      doy.push(onetop["Discovery_DOY"]);
      topfires.push(onetop["Fire_Size"]);
      name.push(onetop["Fire_name"])
    })
  
  console.log(doy)
  console.log(topfires)

  var bubbleTrace = {
    x: doy,
    y: topfires,
    mode: "markers",
    text: name,
    marker: {
      size: topfires,
      sizemode: 'area',
      sizeref: 2.0 * Math.max(...topfires) / (desired_maximum_marker_size**2),
      color: topfires,
      colorscale: "'YIOrRd'"
    }
  }
  
  var bubbleData = [bubbleTrace]

  var bubbleLayout = {
    title: "Top Ten Largest Fires",
    xaxis: {title: "Day of the Year"},
    yaxis: {title: "Fire Size"}
  }
  
  
  Plotly.newPlot("bubble", bubbleData, bubbleLayout)
});

  d3.json(`/coords/${year}`).then((d) => {

    var lat = []
    var fireSize = []
    var long = []
    var fname = []
    
    console.log("Building map")
    
    
    d.forEach(function(loc) {
      lat.push(loc["Lat"]);
      fireSize.push(loc["Fire_Size"]);
      long.push(loc["Long"]);
      fname.push(loc["Fire_name"]);
    })

    console.log("Lat and long")
    console.log(lat)
    console.log(long)

    var data = [{
      type: 'scattergeo',
      mode: 'markers',
      hoverinfo: 'text',
      text: fname,
      locationmode: 'USA-states',
      lat: lat,
      lon: long,
    }]
    
    var layout = {
      showlegend: false,
      geo: {
          scope: 'usa',
          projection: {
            type: 'albers usa'
        },
        showland: true,
        landcolor: 'rgb(217, 217, 217)',
        subunitwidth: 1,
        countrywidth: 1,
        subunitcolor: 'rgb(255,255,255)',
        countrycolor: 'rgb(255,255,255)'
    }
    }
    
  Plotly.plot(map, data, layout, {showLink: false})
  })
}


function init() {

  console.log("I am inside init");

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/years").then((fireYears) => {


    fireYears.forEach((d) => {
      
      selector
        .append("option")
        .text(d)
        .property("value", d);
    });

    // Use the first sample from the list to build the initial plots
    const firstYear = fireYears[0];


    buildMetadata(firstYear);
    buildCharts(firstYear);

  });
}

function optionChanged(newYear) {

  console.log("I am inside option changed");
  // Fetch new data each time a new sample is selected
  buildCharts(newYear);
  buildMetadata(newYear);
}

// Initialize the dashboard
init();
