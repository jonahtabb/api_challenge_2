//For Debugging
//Here is a States Array that matches the fetch response for the async function 'getSupportedStates' 
//...so development and debugging can be done without hitting rate maximums
// See lines ~ 86-88 to activate EITHER 'getSupportedStates()' or 'getSupportedStatesStandIn()'
const supportedStatesStandIn = [
    {state: "Alabama"},
    {state: "Alaska"},
    {state: "Arizona"},
    {state: "Arkansas"},
    {state: "California"},
    {state: "Colorado"},
    {state: "Connecticut"},
    {state: "Delaware"},
    {state: "Florida"},
    {state: "Georgia"},
    {state: "Hawaii"},
    {state: "Idaho"},
    {state: "Illinois"},
    {state: "Indiana"},
    {state: "Iowa"},
    {state: "Kansas"},
    {state: "Kentucky"},
    {state: "Louisiana"},
    {state: "Maine"},
    {state: "Maryland"},
    {state: "Massachusetts"},
    {state: "Michigan"},
    {state: "Minnesota"},
    {state: "Mississippi"},
    {state: "Missouri"},
    {state: "Montana"},
    {state: "Nebraska"},
    {state: "Nevada"},
    {state: "New Hampshire"},
    {state: "New Jersey"},
    {state: "New Mexico"},
    {state: "New York"},
    {state: "North Carolina"},
    {state: "North Dakota"},
    {state: "Ohio"},
    {state: "Oklahoma"},
    {state: "Oregon"},
    {state: "Pennsylvania"},
    {state: "Rhode Island"},
    {state: "South Carolina"},
    {state: "South Dakota"},
    {state: "Tennessee"},
    {state: "Texas"},
    {state: "Utah"},
    {state: "Vermont"},
    {state: "Virginia"},
    {state: "Washington"},
    {state: "Washington, D.C."},
    {state: "West Virginia"},
    {state: "Wisconsin"},
    {state: "Wyoming"}
     ]

//Set Constants
const baseURL = "http://api.airvisual.com/v2/"
const apiKey = "a1d8a74d-2f39-4e75-a89f-70fa6578cbd9"

//Google Places API
const gPlaceApiKey= "AIzaSyBgiBdaU5dfZ9PE4O9gfHKMlpLvDGFYIuU"
const gPlaceBaseURL = "https://maps.googleapis.com/maps/api/place/"

const NearestCityDataSlug = "nearest_city?key="
const mainCardsContainer = document.getElementById("main-cards-container");
const stateSelectorField = document.getElementById("select-state");
const citySelectorField = document.getElementById("select-city");
const addCityButton = document.getElementById("add-city-button");

//Set initial state of selector fields
stateSelectorField.disabled = true;
citySelectorField.disabled = true;
addCityButton.disabled = true;

let removeCardButtons = []; //Current list of cards displayed on the dom (Specifically, each card's 'remove card' button element)
let selectedStateName = "" ; //Currently selected State name
let selectedCityName = "" ; //Currently selected City name

citySelectorField.onchange = setSelectedCityName ;
stateSelectorField.onchange = getCurrentState ;  //Note to self: don't use () for 'onchange' because we want reference the function but not immediately call it when it initially gets read. These type of functions pass event info into the function.
addCityButton.onclick = getCityData;

//Get the supported states on page load! Commented out in favor of the debugging function to load the static array of states.
//getSupportedStates()
getSupportedStatesStandIn() 

async function getSupportedStates () {
    let resStates = await fetch(`${baseURL}states?country=USA&key=${apiKey}`);
    console.log(resStates);
    let resData = await resStates.json();
    console.log(resData);
    if(resData.status == "fail"){
        console.log(`Fetch failed.  Message: ${resData.data.message}`);
    } else {
    let supportedStates = await resData.data;
    addStatesToList(supportedStates);
    }
}

//This function is for debugging so we don't fetch the states each time
function getSupportedStatesStandIn () {
    addStatesToList(supportedStatesStandIn);
}

//Adds supported states to drop down list
function addStatesToList(arr) {
    let stateOptions = `<option>Choose...</option>`;
    arr.forEach(element => {
        stateOptions += `<option>${element.state}</option>`
    });
    stateSelectorField.innerHTML = stateOptions;
    stateSelectorField.disabled = false;
}

//When stateSelectorField is changed, this function is run.
function getCurrentState(e) {
    selectedStateName = e.target.value;
    if(selectedStateName !== "Choose..."){
    getSupportedCities(selectedStateName);
    }
}

//Get a state is selected, fetch supported cities
async function getSupportedCities(state) {
    let resCities = await fetch(`${baseURL}cities?state=${state}&country=USA&key=${apiKey}`);
    let resData = await resCities.json();
    let supportedCities = resData.data;
    // console.log(supportedCities);
    addCitiesToList(supportedCities);
}

//Adds supported cities to drop down list
function addCitiesToList(cities) {
    let cityOptions = `<option>Choose...</option>`;
    cities.forEach(element => {
        cityOptions += `<option>${element.city}</option>`
    });
    citySelectorField.innerHTML = cityOptions;
    citySelectorField.disabled = false;
}

//Set the selectedCityName when a city is selected

function setSelectedCityName(e) {
    selectedCityName = e.target.value;
    console.log(`selected city is: ${selectedCityName}`);
    if (selectedCityName !== "Choose..."){
        addCityButton.disabled = false;
    }else {addCityButton.disabled = true}
}

//Get the data values for the current city
async function getCityData () {
        cityAlreadyExists = document.querySelectorAll(`div[cityName = "${selectedCityName}"]`) ;
        if (cityAlreadyExists.length === 0){
            let resCity = await fetch(`${baseURL}city?city=${selectedCityName}&state=${selectedStateName}&country=USA&key=${apiKey}`);
            cityData = await resCity.json();
            createCityDataCard(cityData);
            photoFetcher(`${selectedCityName}${selectedStateName}`);
        } else {
            alert("You've already added this city to your dashboard!")
        }
}

//Initialize a function to remove a card when the remove card button is clicked
function removeCard (e){
    let currentCard = e.target.parentNode.parentNode;
    let cardsContainer = e.target.parentNode.parentNode.parentNode;
    currentCard.style.opacity = '0';
    setTimeout(function(){cardsContainer.removeChild(currentCard)}, 500)
    console.log("Remove Card Has Been Triggered for " + currentCard);
    // cardsContainer.removeChild(currentCard);
}

function createCityDataCard(n){
    //Initialize data points array
    let weatherDataArray = [];
    function weatherDataObject (abbrev, name, dataPoint, percentString, city, state) {
        this.abbrev = abbrev;
        this.name = name;
        this.dataPoint = dataPoint;
        this.percentString = percentString;
        this.city = city;
        this.state = state;
    }

    //Create the container for each card
    let cityCardContainer = document.createElement('div');
    cityCardContainer.className = "col-md g-4 card-container";
    //Set up transition properties
    cityCardContainer.style.transitionDuration = "499ms";
    cityCardContainer.style.transitionProperty ="opacity"
    cityCardContainer.style.opacity="0" ;

    //Create the outer card for the city
    let cityCard = document.createElement('div');
    cityCard.className = "card p-3";

    
    //Set custom dom attributes for city and state to reference on events.  These are used to easily access the cards from anywhere in the file using query selector using a query like this document.querySelectorAll(`div[cityName = "${selectedCityName}"]`
    cityCard.setAttribute("stateName", "" + n.data.state + "") ;
    cityCard.setAttribute("cityName", "" + n.data.city + "") ;

    removeCardButtons = document.getElementsByClassName("remove-card")

    //Create remove card button
    let removeCardButton = document.createElement('div');
    removeCardButton.className = "btn btn-secondary remove-card" ;
    removeCardButtons = document.getElementsByClassName("remove-card");
    
    //Create City/State Title and add to the city card
    let cityTitle = document.createElement('h2');
    cityTitle.innerText = `${n.data.city}, ${n.data.state}`;

    //Append card to static dom element
    mainCardsContainer.prepend(cityCardContainer);
    cityCardContainer.appendChild(cityCard);
    cityCard.appendChild(cityTitle);
    cityCard.appendChild(removeCardButton);

    //Create an onclick trigger for this card
    removeCardButton.onclick = removeCard;

    //Process AQI Data (Air Quality Index)
    let aqi = (n.data.current.pollution.aqius).toFixed(1);
    let aqiPercent = Math.floor((aqi/300) * 100);
    let aqiPercentString = `${aqiPercent}%`;
    weatherDataArray.push(new weatherDataObject("aqi", "Air Quality Index", aqi, aqiPercentString));

    //Process Temp Data
    let tempFar = (((n.data.current.weather.tp) * (9/5)) + 32).toFixed(1) ;
    let tempFarPercentString= `${tempFar}%`

    weatherDataArray.push(new weatherDataObject("temp", "Temperature (F)", tempFar, tempFarPercentString));

    //Iterate through data and create dom elements

    weatherDataArray.forEach(weatherDataObject => {
        //Create the data point Title
        let Title = document.createElement('h3');
        Title.innerText = `${weatherDataObject.name}: ${weatherDataObject.dataPoint}`;

        //Create the aqi bar container
        let barContainer = document.createElement('div');
        barContainer.className = "visual-bar-container";

        //Set Inner Bar color
        let barColor = "black"
        if (weatherDataObject.abbrev == "aqi") {
            if (weatherDataObject.dataPoint < 51) {barColor = "Green"}
            else if (weatherDataObject.dataPoint < 101) {barColor = "Yellow"}
        }
        else if (weatherDataObject.abbrev == "temp") {
            barColor = "#ffa661"

        }

        //Create the inner bar
        let barInner = document.createElement('div');
        barInner.className = "visual-bar-inside";
        barInner.style.width = weatherDataObject.percentString;
        barInner.style.backgroundColor = barColor;

        //Add all the dom elements to the page
        cityCard.appendChild(Title);
        cityCard.appendChild(barContainer);
        barContainer.appendChild(barInner);

        //Fade In the Card
        setTimeout(() => cityCardContainer.style.opacity="1", 200) ;

    });
}

//Get search for cities by name and then fetch a photo if one exists

async function photoFetcher (citySearch) {
    let removeSpaces = await citySearch.replace(/\s+/g, '') ;
    let results = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${removeSpaces}&inputtype=textquery&fields=photos&key=${gPlaceApiKey}`)

    let resultsJson = await results.json();
    console.log(resultsJson);
    if (resultsJson.candidates.length > 0 
        && resultsJson.status === "OK" 
        && resultsJson.candidates[0].hasOwnProperty("photos")) {
        console.log(resultsJson.candidates[0]["photos"][0]["photo_reference"]);
        let photoReference = await resultsJson.candidates[0]["photos"][0]["photo_reference"] ;
    
        let photoResult = await fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${gPlaceApiKey}`)

        console.log(photoResult.url);
        let imageSample = document.createElement('img');
        imageSample.src = photoResult.url ;
        mainCardsContainer.appendChild(imageSample);
    } else {
        console.log(`Google Maps Api probably does not contain a photo of this place.  Status of returned request is "${resultsJson.status}"`);
    }
}



