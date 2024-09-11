// Create the map
var map = L.map('map').setView([0, 0], 2);

// Set JSON url
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// Fetch the earthquake data
fetch(url)
    .then(response => response.json())
    .then(data => {
        data.features.forEach(earthquake => {
            var coords = earthquake.geometry.coordinates;
            var magnitude = earthquake.properties.mag;
            var depth = coords[2];
            var place = earthquake.properties.place;
            var time = new Date(earthquake.properties.time).toLocaleString();

            // Set marker size based on magnitude
            var markerSize = magnitude * 5; 

            // Set marker color based on depth
            var color = depth > 100 ? '#800000' :
            depth > 80 ? '#BF0000' :
            depth > 60 ? '#FF0000' :
            depth > 40 ? '#FF7F7F' :
            depth > 20 ? '#FFFF7F' :
                     '#7FFF7F';

            // Create a circle marker
            L.circleMarker([coords[1], coords[0]], {
                radius: markerSize,
                fillColor: color,
                color: color,
                fillOpacity: 0.5
            }).addTo(map).bindPopup(`Location: ${place}<br>Time: ${time}<br>Magnitude: ${magnitude}<br>Depth: ${depth} km`);
        });
    })
    .catch(error => console.error('Error fetching the earthquake data:', error));

// Create a legend
    var legend = L.control({position: 'bottomright'});

    function getColor(depth) {
    return depth > 100 ? '#800000' :
           depth > 80 ? '#BF0000' :
           depth > 60 ? '#FF0000' :
           depth > 40 ? '#FF7F7F' :
           depth > 20 ? '#FFFF7F' :
                    '#7FFF7F'; // Color for depths 0-20
    }            

// Add the legend to the map
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        var grades = [0, 20, 40, 60, 80, 100]; // Depth ranges

    // Loop through the grades and generate a label with a colored square for each
        for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' + // Get color based on magnitude
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };


legend.addTo(map);