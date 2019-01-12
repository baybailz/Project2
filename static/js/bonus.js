
function init() {   

d3.json(`/coords`).then((d) => {

var lat = []
var fireSize = []
var long = []

d.forEach(function(loc) {
  lat.push(loc["Lat"]);
  fireSize.push(loc["Fire_Size"]);
  long.push(loc["Long"])
})

console.log("I am drawing map")

var data = [{
  type: 'scattergeo',
  locationmode: 'USA-states',
  lat: lat,
  lon: long,
  marker: {
    size: fireSize,
    line: {
        color: 'black',
        width: 5
    }
  }
}]

var layout = {
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

Plotly.plot(myDiv, data, layout, {showLink: false});
  })
}


init();