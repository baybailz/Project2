console.log("enter java script")



Plotly.d3.csv('fire_size.csv', function(err, rows){
    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

    var data = [{
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: unpack(rows, 'State'),
        z: unpack(rows, 'Fire_Size'),
      //   text: unpack(rows),
      //   zmin: 0,
      //   zmax: 17000,
        colorscale: 'auto',

        colorbar: {
            title: 'Area Covered',
          //   thickness: 0.2,
            width: 2.0
        },
        marker: {
            line:{
                color: 'rgb(255,255,255)',
                width: 2
            }
        }
    }];


    var layout = {
        title: 'US Wildfire by the State',
        geo:{
            scope: 'usa',
            showlakes: true,
            lakecolor: 'rgb(255,255,255)'
        }
    };

    Plotly.plot(myDiv, data, layout, {showLink: false});
});