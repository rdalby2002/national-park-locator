const NPS_API_KEY = "QknvTF8nyaOfZvolB7zyEiWeLS7BcVcFZ1omLTe6";
const MAPS_API_KEY = "AIzaSyCNoCGvv588RGUOYyIPoRXZlS1SezWenwk";
var resultsListEl = $("#results-list");
var npsBaseUrl = "https://developer.nps.gov/api/v1";
var selectedStateAbbr = localStorage.getItem("stateAbbr");
var selectedState = localStorage.getItem("state");
const resultLocationHdr = document.getElementById("location-hdr");
let textDirPanel = document.getElementById('text-directions');
let clientLocation = '';
let startInputBox = document.getElementById('start-input-box');
let backToSelectAState = document.getElementById('select-a-state-rtn-btn');


//Returns to select a state page
backToSelectAState.addEventListener('click', () => {
    window.location.href = '../national-park-locator/index.html';
});



function init(map, directionsRenderer, directionsService, clientLocation) {

    console.log(window.location.pathname)
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
                resultsListEl.append($("<li class='park-btn orange-text deep-orange darken-2 text-lighten-5 center-align'><button id=btn-" + x + ">" + data.data[x].fullName + " </button></li>"));

            }

            if (clientLocation === null) {
                let dataArr = data;
                getLocation(map, directionsRenderer, directionsService, {}, dataArr)
            } else {
                for (let i = 0; i < data.data.length; i++) {

                    document.getElementById('btn-' + i).addEventListener('click', () => {
                        let lat = Number(data.data[i].latitude);
                        let lng = Number(data.data[i].longitude);

                        let endPos = { lat: lat, lng: lng };
                        console.log(endPos);

                        let parkInfoList = document.getElementById('park-info-list');
                        parkInfoList.style.display = "flex";

                        //Retreives img src for each park
                        let imgLocation = document.getElementById('park-info-img')
                        let imgSrc = data.data[i].images[0].url;
                        let imgAlt = data.data[i].images[0].altText
                        imgLocation.setAttribute('alt', imgAlt);
                        imgLocation.setAttribute('src', imgSrc);

                        //Retrieves and sets the park title
                        let parkInfoTitle = document.getElementById('park-info-title');
                        let parkTitle = data.data[i].fullName;
                        parkInfoTitle.innerText = parkTitle;

                        //Retrieves and sets the park descirption
                        let parkInfoDesc = document.getElementById('park-info-description');
                        let parkDescription = data.data[i].description
                        parkInfoDesc.innerText = parkDescription;

                        //Retrieves and sets the park activities
                        let parkInfoActivities = document.getElementById('park-info-activities')
                        let activitiesArray = [];
                        let parkActivitiesTitle = document.getElementById('park-activites-title')


                        if (data.data[i].activities[0] === undefined) {
                            parkInfoActivities.innerText = '';
                            parkActivitiesTitle.style.display = 'none';
                        } else {
                            for (let x = 0; x < data.data[i].activities.length; x++) {
                                let parkActivities = data.data[i].activities[x].name
                                activitiesArray.push(" " + parkActivities);
                            }
                            parkInfoActivities.innerText = activitiesArray;
                            parkActivitiesTitle.style.display = 'block';
                        }

                        // Handles writing park url to page
                        let parkInfoUrlTitle = document.getElementById('park-info-url-title');
                        let parkInfoUrl = document.getElementById('park-info-url');
                        let parkUrl = data.data[i].url;

                        if (parkUrl) {
                            parkInfoUrl.style.display = "list-item";
                            parkInfoUrlTitle.style.display = "list-item";
                            parkInfoUrl.setAttribute('href', parkUrl);
                            parkInfoUrl.classList.add('deep-orange-text', 'text-darken-2')
                            parkInfoUrl.innerText = parkUrl;
                        } else {
                            parkInfoUrl.innerText = "";
                            parkInfoUrl.style.display = "none";
                            parkInfoUrlTitle.style.display = "none";
                        }

                        localStorage.setItem('destination', JSON.stringify(endPos));

                        calcRoute(map, directionsRenderer, directionsService, clientLocation, data);
                    })
                }


            }
        })

    console.log(clientLocation)
}

// This is used if a client doesnt let the browser know their location. They can input their own.
function getLocation(map, directionsRenderer, directionsService, clientLocation, data) {
    let dataArr = data;

    for (let i = 0; i < dataArr.data.length; i++) {

        document.getElementById('btn-' + i).addEventListener('click', () => {
            let lat = Number(dataArr.data[i].latitude)
            let lng = Number(dataArr.data[i].longitude);

            let endPos = { lat: lat, lng: lng };
            console.log(endPos);

            let parkInfoList = document.getElementById('park-info-list');
            parkInfoList.style.display = "flex";

            //Retreives img src for each park
            let imgLocation = document.getElementById('park-info-img')
            let imgSrc = data.data[i].images[0].url;
            let imgAlt = data.data[i].images[0].altText
            imgLocation.setAttribute('alt', imgAlt);
            imgLocation.setAttribute('src', imgSrc);

            //Retrieves and sets the park title
            let parkInfoTitle = document.getElementById('park-info-title');
            let parkTitle = data.data[i].fullName;
            parkInfoTitle.innerText = parkTitle;

            //Retrieves and sets the park descirption
            let parkInfoDesc = document.getElementById('park-info-description');
            let parkDescription = data.data[i].description
            parkInfoDesc.innerText = parkDescription;

            //Retrieves and sets the park activities
            let parkInfoActivities = document.getElementById('park-info-activities')
            let activitiesArray = [];
            let parkActivitiesTitle = document.getElementById('park-activites-title')


            if (data.data[i].activities[0] === undefined) {
                parkInfoActivities.innerText = '';
                parkActivitiesTitle.style.display = 'none';
            } else {
                for (let x = 0; x < data.data[i].activities.length; x++) {
                    let parkActivities = data.data[i].activities[x].name
                    activitiesArray.push(" " + parkActivities);
                }
                parkInfoActivities.innerText = activitiesArray;
                parkActivitiesTitle.style.display = 'block';
            }

            // Handles writing park url to page
            let parkInfoUrlTitle = document.getElementById('park-info-url-title');
            let parkInfoUrl = document.getElementById('park-info-url');
            let parkUrl = data.data[i].url;

            if (parkUrl) {
                parkInfoUrl.style.display = "list-item";
                parkInfoUrlTitle.style.display = "list-item";
                parkInfoUrl.setAttribute('href', parkUrl);
                parkInfoUrl.classList.add('deep-orange-text', 'text-darken-2')
                parkInfoUrl.innerText = parkUrl;
            } else {
                parkInfoUrl.innerText = "";
                parkInfoUrl.style.display = "none";
                parkInfoUrlTitle.style.display = "none";
            }

            localStorage.setItem('destination', JSON.stringify(endPos));
            customSearchButton.click();
        })
    }

    let geocoder = new google.maps.Geocoder();

    let inputEl = document.createElement("input");
    let buttonEl = document.createElement("button");
    inputEl.setAttribute('type', 'text')
    inputEl.setAttribute('placeholder', 'Enter Start Location')
    inputEl.id = 'start-input';
    buttonEl.id = 'start-button-custom-search';
    buttonEl.innerText = 'Search';
    buttonEl.setAttribute('class', 'deep-orange darken-2 orange-text text-lighten-5')
    startInputBox.appendChild(inputEl);
    startInputBox.appendChild(buttonEl);

    let customSearchInput = document.getElementById('start-input')
    customSearchInput.addEventListener('keypress', function (e) {
        if (e.keyCode == 13) {
            customSearchButton.click();
        }
    });

    let customSearchButton = document.getElementById('start-button-custom-search')
    customSearchButton.addEventListener('click', () => {
        let customSearchDoc = document.getElementById('start-input');
        let customSearch = customSearchDoc.value;

        if (customSearch === null) {
            console.log('No search params');
            return
        } else {
            let requestGeo = { address: customSearch }
            let geoRequestResults = geocoder.geocode(requestGeo).then((results) => {
                let geoLat = results.results[0].geometry.location.lat();
                let geoLng = results.results[0].geometry.location.lng();

                let geoReturn = { lat: geoLat, lng: geoLng };
                console.log(results);
                console.log(results.results[0].geometry.location.lat());
                console.log(geoRequestResults);
                console.log(customSearch);
                calcRoute(map, directionsRenderer, directionsService, geoReturn, dataArr);
            })

        }
    })
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

function calcRoute(map, directionsRenderer, directionsService, startPos, data) {
    let endPos = JSON.parse(localStorage.getItem('destination'));
    let mapBox = document.getElementById('map-center-box');

    console.log(endPos);
    console.log("calcRoute has ran");
    console.log(startPos);
    mapBox.style.display = 'flex';
    textDirPanel.style.display = "block";

    if (endPos === null) {
        if (data.data.length >= 1) {

            let lat = Number(data.data[0].latitude)
            let lng = Number(data.data[0].longitude);

            endPos = { lat: lat, lng: lng };
            localStorage.setItem('destination', JSON.stringify(endPos));
        }
    }

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
        } if (status == 'ZERO_RESULTS') {
            let noDirections = document.getElementById('no-directions-aval');
            noDirections.style.display = 'block';
            textDirPanel.style.display = "none";

            map.setCenter(start)
            map.setZoom(10)
            directionsRenderer.setMap(null);
            directionsRenderer.setPanel(null);

            setTimeout(() => {
                noDirections.style.display = 'none';
            }, 2000)

        }
        console.log(result);
    });
    console.log("calculated route");
    console.log(map);

}



function mapController(map, directionsRenderer, directionsService) {
    console.log("mapController");
    if (selectedState === 'Select a US state.') {
        window.location.href = '../national-park-locator/index.html';
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    }

                    console.log('client location - map controller' + JSON.stringify(pos));
                    map.setCenter(pos);
                    map.setZoom(18);

                    clientLocation = pos;

                    init(map, directionsRenderer, directionsService, clientLocation);
                },
                () => {
                    //handleLocationError(map, directionsRenderer, directionsService);
                    clientLocation = null;
                    init(map, directionsRenderer, directionsService, clientLocation)

                }

            )
        }
    }
}