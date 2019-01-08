// function buildMetadata(sample) {

//     // apply d3.json to dataset to retrieve selected sample from dropdown.
//     d3.json(`/metadata/${sample}`).then(function(s) {
//       // console.log(Object.entries(s))
  
//       // create variable that connects to metadata section of page and stores metadata for sample
//       var info = d3.select("#sample-metadata");
  
//       // store sample entries in variable.
//       metaD = Object.entries(s);
  
//       // clear out the sample info panel so that it will load new sample data.
//       info.html("")
  
//       // Now select h6 tags in index file and use 'enter' method to append and return 
//       // sample metadata on the page in the information section
//       info.selectAll("h6")
//         .data(metaD)
//         .enter()
//         .append("h6")
//         .text(function(s) {
//         return`${s[0]}: ${s[1]}`;
//       });
//     ;})
//   }
  
//   function buildCharts(sample) {
//     // @TODO: Use `d3.json` to fetch the sample data for the plots
//     d3.json(`/samples/${sample}`).then(function(s) {
//       var ids = s.otu_ids
//       var values = s.sample_values
//       var labels = s.otu_labels
  
//       // console.log(labels);
  
//       // @TODO: Build a Bubble Chart using the sample data
//       // define the trace variable for the bubble plot.
//       var bubbleTrace = {
//         x: ids,
//         y: values,
//         mode: "markers",
//         marker: {
//           size: values,
//           color: ids
//         }
//       };
  
//       // convert trace variable to data variable for Plotly.
//       var bubbleData = [bubbleTrace];
  
//       var bubbleLayout = {
//         xaxis: {title: "ID"}
//       };
  
//       Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
  
//       // @TODO: Build a Pie Chart
//       // HINT: You will need to use slice() to grab the top 10 sample_values,
//       // otu_ids, and labels (10 each).
//       // slice the data to get top 10 samples.
//       var pieData = [{
//         values: values.slice(0,10),
//         labels: ids.slice(0,10),
//         type: "pie"
//       }];
      
//       // convert trace variable to data variable for Plotly.
//       // var pieData = [pieTrace];
  
//       var pieLayout = {
//         height: 600,
//         width: 800
//       };
  
//       Plotly.newPlot("pie", pieData, pieLayout);
//     })
//   }
  
  
//     console.log("I'm inside buildCharts");
  
//     // var sliced = sample.slice(0,10);
  
//     // @TODO: Use `d3.json` to fetch the sample data for the plots
//   //   d3.json(sample).then(function(sliced) {
//   //     var data = [sliced];
//   //     var layout = {
//   //       height: 600,
//   //       width: 800
//   //     };
//   //     Plotly.plot("pie", data, layout);
//   //   });
//   //   ;})
  
  
//   function init() {
//     // Grab a reference to the dropdown select element
//     var selector = d3.select("#selDataset");
  
  
//     // Use the list of sample names to populate the select options
//     d3.json("/names").then((sampleNames) => {
//       sampleNames.forEach((sample) => {
//         selector
//           .append("option")
//           .text(sample)
//           .property("value", sample);
//       });
  
//       // Use the first sample from the list to build the initial plots
//       const firstSample = sampleNames[0];
  
//       buildCharts(firstSample);
//       buildMetadata(firstSample);
//     });
//   }
  
//   function optionChanged(newSample) {
//     console.log(newSample)
//     // Fetch new data each time a new sample is selected
//     buildCharts(newSample);
//     buildMetadata(newSample);
//   }
  
//   // Initialize the dashboard
//   init();