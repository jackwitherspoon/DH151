// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;



// path to csv data
let path = "data/california_hosptials.csv";

// global variables
let markers = L.featureGroup();



// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	readCSV(path);
});





// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}






// function to read csv data
function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			
			// map the data
			mapCSV(data);

		}
	});
}







function mapCSV(data){

	// circle options
	let circleOptions = {
		radius: 5,
		weight: 1,
		color: 'white',
		fillColor: 'blue',
		fillOpacity: 1
	}

	// loop through each entry
	data.data.forEach(function(item,index){
		// create a marker
		let marker = L.circleMarker([item.latitude,item.longitude],circleOptions)
		.on('mouseover',function(){
			this.bindPopup(`${item.title}<br><img src="${item.thumbnail_url}">`).openPopup()
		})

		// add marker to featuregroup
		markers.addLayer(marker)
	})

	// add featuregroup to map
	markers.addTo(map)

	// fit map to markers
	map.fitBounds(markers.getBounds())
}





















let data1 = [
    {
        'id':0,
        'title':'UCLA Westwood',
        'des':'1st account',
        'lat': 34.0662157,
        'lon': -118.4453161
    },
    {
        'id':1,
        'title':'UCLA Santa Monica',
        'des':'2nd account',
        'lat': 34.0275,
        'lon': -118.4861105
    },
    {
        'id':2,
        'title':'Little Company of Mary',
        'des':'3rd account',
        'lat': 33.83949688645028,
        'lon': -118.35749907244943
    },
    {
        'id':3,
        'title':'Torrance Memorail',
        'des':'4th account',
        'lat': 33.8389091,
        'lon': -118.3568268
    },
    {
        'id':4,
        'title':'San Pedro Peninsula',
        'des':'5th account',
        'lat': 33.7381859, 
        'lon': -118.3037796
    },
    {
        'id':5,
        'title':'Long Beach Memorial',
        'des':'6th account',
        'lat': 33.7887993, 
        'lon': -118.1448746
    },
    {
        'id':6,
        'title':'Childrens Hospital Los Angeles',
        'des':'7th account',
        'lat': 34.0981051,
        'lon': -118.2906117
    }

]





// before looping the data, create an empty FeatureGroup
let myMarkers = L.featureGroup();





// function to fly to a location by a given id number
function flyToIndex(index){
	map.flyTo([data1[index].lat,data1[index].lon],17)
}


// loop through data
data1.forEach(function(item1){
	// create marker
	let marker = L.marker([item1.lat,item1.lon]).bindPopup(item1.title)

	// add marker to featuregroup
	myMarkers.addLayer(marker)

	// add data to sidebar with onclick event
	$('.sidebar').append(`<div class="sidebar-item" onclick="flyToIndex(${item1.id})">${item1.title}</div>`)
})






// Creating markers
var hydMarker = new L.Marker([34.0662157,-118.4453161]);

















