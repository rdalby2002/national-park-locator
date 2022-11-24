const NPS_API_KEY = "QknvTF8nyaOfZvolB7zyEiWeLS7BcVcFZ1omLTe6";
const MAPS_API_KEY = "AIzaSyCNoCGvv588RGUOYyIPoRXZlS1SezWenwk";
var resultsListEl = $("#results-list");
var npsBaseUrl = "https://developer.nps.gov/api/v1";
var selectedStateAbbr = localStorage.getItem("stateAbbr");
var selectedState = localStorage.getItem("state");
const resultLocationHdr = document.getElementById("location-hdr");
let latLongArr = [];



function init() {

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
                resultsListEl.append($("<li>" + data.data[x].fullName + "</li>"));

                latLongArr.push(data.data[x].latitude + ',' + data.data[x].longitude);
            }
            console.log(latLongArr);

        });

        initMap();
}

let map, infoWindow;

function initMap() {
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 41.85, lng: -87.65},
      zoom: 8,
      //mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
    });
  };
// Page initialization
init();
