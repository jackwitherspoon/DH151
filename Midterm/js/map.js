// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = 'data/laborinthdata.csv';
let markers = L.featureGroup();
let povertyMarkers = L.featureGroup(); 
let csvdata;

const wpRGB = [51, 255, 255];
const liRGB = [51, 255, 0];

let legend = L.control({position: 'bottomright'});
let info_panel = L.control();

// put this in your global variables
let geojsonPath = 'data/laborinthworld.geojson';
let geojson_data;
let geojson_layer;

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
	readCSV(path);
	getGeoJSON();
});

// function to get the geojson data
function getGeoJSON(){

	$.getJSON(geojsonPath,function(data){
		// put the data in a global variable
		geojson_data = data;

		// call the map function
		mapGeoJSON()
	})
}

// function to map a geojson file
function mapGeoJSON(){

	// create the layer and add to map
	geojson_layer = L.geoJson(geojson_data).addTo(map);

	// fit to bounds
	map.fitBounds(geojson_layer.getBounds())

	createLegend();
}


// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// function to read csv data
function readCSV(){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			// put the data in a global variable
			csvdata = data;

			// map the data for the given date
			mapCSV();
		}
	});
}


function mapCSV(){

	// clear layers in case you are calling this function more than once
	markers.clearLayers();

	// loop through each entry
	csvdata.data.forEach(function(item,index){
		if(item.OverallFairLabor != undefined){
			// circle options
			 let circleOptions = {
				radius: item.OverallFairLabor*2,　// call a function to determine radius size
				weight: 1,
				color: 'white',
				fillColor: 'navy',
				fillOpacity: 0.5
			}
			let marker = L.circleMarker([item.Latitude,item.Longitude], circleOptions)
			.on('mouseover',function(){
				this.bindPopup(`${item['Country']} <br> Labor Indicators Score: ${item['OverallFairLabor']}`).openPopup()
			}) // show data on hover
			markers.addLayer(marker)	
		}
        
        if(item.ExtremePoor != undefined){
            let Pmarker = L.marker([item.Latitude, item.Longitude])
            .on('click', function(){
                this.bindPopup(`${item['Country']} <br> Extreme Poverty Rate: ${item['ExtremePoor']} <br> Moderate Poverty Rate: ${item['ModeratePoor']} <br> Near Poverty Rate: ${item['NearPoor']}`).openPopup()
            })
            povertyMarkers.addLayer(Pmarker)
        } 
	});

	markers.addTo(map)
    povertyMarkers.addTo(map)

    let layers = {
        "Working Poverty": povertyMarkers,
        "Fair Labor": markers
    }

    L.control.layers(null,layers).addTo(map)

	map.fitBounds(markers.getBounds())
}

function getColor(ExtremePoor, OverallFairLabor){
	let liOpacity = OverallFairLabor/10;
	let wpOpacity = ExtremePoor/100;
	
	
}

//convert rgb to hex
function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }





  function mapGeoJSON(){

	// create the layer and add to map
	geojson_layer = L.geoJson(geojson_data, {
		style: getStyle //call a function to style each feature
	}).addTo(map);

	// fit to bounds
	map.fitBounds(geojson_layer.getBounds())

	// create the geojson layer
	geojson_layer = L.geoJson(geojson_data,{
		style: getStyle,
		onEachFeature: onEachFeature // actions on each feature
	}).addTo(map);

	// create the infopanel
	createInfoPanel();
}

// style each feature
function getStyle(feature){
	return {
		stroke: true, // adds an outline
		color: 'white', // outline color
		weight: 1, // outline width
		fill: true,
		fillColor: getColor(feature.properties['ExtremePoor']), // instead of a single color, make it based on the population value!
		fillOpacity: 0.8
	}
}

// return the color for each feature based on population count
function getColor(d) {

	return d > 25 ? '#800026' :
		   d > 10  ? '#BD0026' :
		   d > 5  ? '#E31A1C' :
		   d > 2.5  ? '#FC4E2A' :
		   d > 5  ? '#FD8D3C' :
		   d > 1   ? '#FEB24C' :
		   d > 0   ? '#FED976' :
					  '#FFEDA0';
}










function createLegend(){
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
		breaks = brew.getBreaks(),
		labels = [],
		from, to;
		
		for (var i = 0; i < breaks.length; i++) {
			from = breaks[i];
			to = breaks[i + 1];
			if(to) {
				labels.push(
					'<i style="background:' + brew.getColorInRange(from) + '"></i> ' +
					from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
				}
			}
			
			div.innerHTML = labels.join('<br>');
			return div;
		};
		
		legend.addTo(map);
}


















// Function that defines what will happen on user interactions with each feature
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

// on mouse over, highlight the feature
function highlightFeature(e) {
	var layer = e.target;

	// style to use on mouse over
	layer.setStyle({
		weight: 2,
		color: '#666',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info_panel.update(layer.feature.properties)

	info_panel.update() // resets infopanel
}




// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
	geojson_layer.resetStyle(e.target);
	info_panel.update() // resets infopanel
}



// on mouse click on a feature, zoom in to it
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}




function createInfoPanel(){

	info_panel.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info_panel.update = function (properties) {
		// if feature is highlighted
		if(properties){
			this._div.innerHTML = `<b>${properties.name}</b><br>${fieldtomap}: ${properties[fieldtomap]}`;
		}
		// if feature is not highlighted
		else
		{
			this._div.innerHTML = 'Hover over a borough';
		}
	};

	info_panel.addTo(map);
}

