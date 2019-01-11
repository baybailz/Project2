function buildMetadata(year) {

    console.log("I am inside build metadata");
    // @TODO: Complete the following function that builds the metadata panel
  
    d3.json(`/metadata/${year}`).then(function(d) {
      // this would return a json
      // console.log(d)
      // this would return an array of 7 lists 
      // console.log(Object.entries(d));
  
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
  
      // console.log(mData);
      // console.log('I am in between mData and Panel')
      // console.log(PANEL)
      // console.log;
  
      // console.log("this here immediately is the mData")
      // console.log(mData)
  
      // + ", " + d["Cumulative Days of Buring"]; 
  
      PANEL.selectAll("h6").data(d).enter().append("h6")
        .text(function(d) { return `
          Acres Burned: ${d["Acres_Burned"]} 
          Cumulative Days of Burning: ${d["Cumulative_Days_of_Burning"]}
          Number of Fires: ${d["Number_of_Fires"]}
          `}); 
  
    });
  
  
  
  
      // Use `.html("") to clear any existing metadata
  
      // Use `Object.entries` to add each key and value pair to the panel
    
  
      // BONUS: Build the Gauge Chart
      // buildGauge(data.WFREQ);
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
  
      // var acres = d.Fire_Size
      // var fire_d = d[2][2]
  
      // console.log("Printing data")
      // console.log(acres)
      // console.log(fire_d)
      
    
    // "d" is the api return 
    
    var barTrace = {
      x: causes,
      y: avgfiresize,
      type: "bar",
      marker: {
        color: 'rgb(228, 132, 5)'
      }
      };
  
    var barData = [barTrace]
    
    var barLayout = {
      title: "Cause of Fires",
      xaxis: {title: "Cause of Fire"},
      yaxis: {title: "Average Acres Burned"}
    };
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
    }; 
    
    var bubbleData = [bubbleTrace]
  
    var bubbleLayout = {
      title: "Top Ten Largest Fires",
      xaxis: {title: "Day of the Year"},
      yaxis: {title: "Fire Size"}
    };
    
    
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)
    
  
    // var pieTrace = {
    //   values: fire_d,
    //   labels: fire_d,
    //   marker: {
    //     colorscale: "Earth"
    //   },
    //   type: "pie"
    // }; 
  
    // var pieLayout = {
  
    // };
  
    // var pieData = [pieTrace] 
  
    // Plotly.newPlot("pie", pieData, pieLayout)
  
  })
  
      // @TODO: Build a Bubble Chart using the sample data
  
      // @TODO: Build a Pie Chart
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).
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
    console.log(newYear)
    // Fetch new data each time a new sample is selected
    buildCharts(newYear);
    buildMetadata(newYear);
  }
  
  // Initialize the dashboard
  init();