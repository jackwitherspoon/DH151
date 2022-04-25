let data = [
    {
        'id':0,
        'title':'UCLA Westwood',
        'des':'1st account',
        'lat': 34.08194242900244,
        'lon': -118.44873937962109
    },
    {
        'id':1,
        'title':'UCLA Santa Monica',
        'des':'2nd account',
        'lat': 34.0370411876037,
        'lon': -118.4862593814626
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
        'lat': 33.81272538061891,
        'lon': -118.34337412243741
    },
    {
        'id':4,
        'title':'San Pedro Peninsula',
        'des':'5th account',
        'lat': 33.74167652489106, 
        'lon': -118.30489961026827
    },
    {
        'id':5,
        'title':'Long Beach Memorial',
        'des':'6th account',
        'lat': 33.82195185633215, 
        'lon': -118.18695624761943
    },
    {
        'id':6,
        'title':'Childrens Hospital Los Angeles',
        'des':'7th account',
        'lat': 34.11033079980408,
        'lon': -118.29143115474785
    }

]







var map = L.map('map').setView([data[0].lat,data[0].lon], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// before looping the data, create an empty FeatureGroup
let myMarkers = L.featureGroup();





// function to fly to a location by a given id number
function flyToIndex(index){
	map.flyTo([data[index].lat,data[index].lon],17)
}


// loop through data
data.forEach(function(item){
	// create marker
	let marker = L.marker([item.lat,item.lon]).bindPopup(item.title)

	// add marker to featuregroup
	myMarkers.addLayer(marker)

	// add data to sidebar with onclick event
	$('.sidebar').append(`<div class="sidebar-item" onclick="flyToIndex(${item.id})">${item.title}</div>`)
})








// after loop, add the FeatureGroup to map
myMarkers.addTo(map)




data.forEach(function(item){
    var circle = L.circle([item.lat, item.lon], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);
});





let layers = {
	"My Markers": myMarkers
}


// add layer control box
L.control.layers(null,layers).addTo(map)




























































<<<<<<< HEAD






=======
>>>>>>> 25ffcfccba1a0c05887e9ae38973d5c121234c63
