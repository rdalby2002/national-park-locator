// NPS key: QknvTF8nyaOfZvolB7zyEiWeLS7BcVcFZ1omLTe6
// google key: AIzaSyCNoCGvv588RGUOYyIPoRXZlS1SezWenwk
const NPS_API_KEY = "QknvTF8nyaOfZvolB7zyEiWeLS7BcVcFZ1omLTe6";
const MAPS_API_KEY = "AIzaSyCNoCGvv588RGUOYyIPoRXZlS1SezWenwk";
var stateDropdownEl = $("#state-dropdown");
var searchButtonEl = $("#srchBtn");
var resultsList = $("#results-list");
var selectedState = "";
var npsBaseUrl = "https://developer.nps.gov/api/v1";
var parkList = {};

searchButtonEl.on('click', function () {
    event.preventDefault();
    selectedState = stateDropdownEl.val();
    console.log(selectedState);
    localStorage.setItem("state", selectedState);
    document.location = "./results.html";  
});
