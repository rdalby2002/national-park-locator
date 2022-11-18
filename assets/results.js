const NPS_API_KEY = "QknvTF8nyaOfZvolB7zyEiWeLS7BcVcFZ1omLTe6";
const MAPS_API_KEY = "AIzaSyCNoCGvv588RGUOYyIPoRXZlS1SezWenwk";
var resultsListEl = $("#results-list");
var npsBaseUrl = "https://developer.nps.gov/api/v1";
var selectedState = localStorage.getItem("state");

fetch (npsBaseUrl + "/parks?stateCode=" + selectedState + "&api_key=" + NPS_API_KEY)
        .then(function(response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log("Name: " + data.data[0].fullName);
            console.log("Latitude: " + data.data[0].latitude);
            console.log("Longitude: " + data.data[0].longitude);

            for (let x in data.data) {
                resultsListEl.append($("<li>" + data.data[x].fullName + "</li>"));
            }
        })