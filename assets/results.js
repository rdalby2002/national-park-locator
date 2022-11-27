const NPS_API_KEY = "QknvTF8nyaOfZvolB7zyEiWeLS7BcVcFZ1omLTe6";
const MAPS_API_KEY = "AIzaSyCNoCGvv588RGUOYyIPoRXZlS1SezWenwk";
var resultsListEl = $("#results-list");
var npsBaseUrl = "https://developer.nps.gov/api/v1";
var selectedStateAbbr = localStorage.getItem("stateAbbr");
var selectedState = localStorage.getItem("state");
const resultLocationHdr = document.getElementById("location-hdr");
let textDirPanel = document.getElementById('text-directions');
let mapBox = document.getElementById('map-box-button')
let clientLocation = '';



//Map initialization
const locationButton = document.createElement("button");
// init();
//window.init = mapController();



function init(map, directionsRenderer, directionsService, clientLocation) {
    console.log("init has ran");


    resultLocationHdr.append(selectedState);

    fetch(npsBaseUrl + "/parks?stateCode=" + selectedStateAbbr + "&api_key=" + NPS_API_KEY)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log("Name: " + data.data[0].fullName);
            console.log("Latitude: " + data.data[0].latitude);
            console.log("Longitude: " + data.data[0].longitude);


            for (let x in data.data) {
                resultsListEl.append($("<li><button id=btn-" + x + ">" + data.data[x].fullName + " </button></li>"));
                document.getElementById('btn-' + x).addEventListener('click', () => {

                    let lat = Number(data.data[x].latitude);
                    let lng = Number(data.data[x].longitude);

                    let endPos = { lat: lat, lng: lng };
                    console.log(endPos);



                    calcRoute(map, directionsRenderer, directionsService, clientLocation, endPos);
            })
            }

            console.log(clientLocation)

        });


}

function initMap() {
    console.log("initMap has ran");
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.85, lng: -87.65 },
        zoom: 8,
        disableDefaultUI: true,
    });
    mapController(map, directionsRenderer, directionsService);
};

function calcRoute(map, directionsRenderer, directionsService, startPos, endPos) {
    console.log("calcRoute has ran");
    console.log(startPos);
    console.log(endPos);

    mapBox.style.display = "none";
    var start = startPos;
    var end = endPos;
    var request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    };
    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            directionsRenderer.setMap(map)
            directionsRenderer.setDirections(result);
            directionsRenderer.setPanel(textDirPanel);
        }
        console.log(result);
    });
    console.log("calculated route");
    console.log(map);

}

locationButton.textContent = "Pan to Current Location";
locationButton.classList.add("custom-map-control-button");
mapBox.appendChild(locationButton)

function mapController(map, directionsRenderer, directionsService) {
    console.log("mapController");
    if (navigator.geolocation) {
        let p = navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }

                console.log('client location - map controller' + JSON.stringify(pos));
                map.setCenter(pos);
                map.setZoom(18);

                //locationButton.addEventListener("click", calcRoute.bind(null, map, directionsRenderer, directionsService, pos), false);
                clientLocation = pos;

                init(map, directionsRenderer, directionsService, clientLocation);
            })
    }
}


// Page initialization