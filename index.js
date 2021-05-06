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

//Dark Mode Toggle
const btn = document.querySelector("#dark-theme-button");
const staticDarkThemeElements = document.querySelectorAll(".choose-container-upper, .form-select, #add-city-button:hover, p, a, a.hover");
console.log(staticDarkThemeElements);
btn.addEventListener("click", function () {
    let dynamicDarkThemeElements = document.querySelectorAll(".card-custom, .remove-card");
    staticDarkThemeElements.forEach(node => node.classList.toggle("dark-theme"));
    dynamicDarkThemeElements.forEach(node => node.classList.toggle("dark-theme"));
    document.body.classList.toggle("dark-theme");
}); //New card dark theme statement near line 233

//Google Places API
const gPlaceApiKey= "AIzaSyBgiBdaU5dfZ9PE4O9gfHKMlpLvDGFYIuU"
const gPlaceBaseURL = "https://maps.googleapis.com/maps/api/place/"

const NearestCityDataSlug = "nearest_city?key="
const mainCardsContainer = document.getElementById("main-cards-container");
const stateSelectorField = document.getElementById("select-state");
const citySelectorField = document.getElementById("select-city");
const addCityButton = document.getElementById("add-city-button");
const errorBarContainer= document.getElementById("error-bar-container");

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

//Load Error Display bar on page load!
function errorDisplayBar (error) {

    if (document.getElementById("error-display-bar") != null ){
        let errorDisplayBar = document.getElementById("error-display-bar");
        let errorText = document.getElementById("error-display-text");
        errorText.innerText = (error);
        console.log(errorText.innerText);
        errorDisplayBar.style.display = "flex";
        setTimeout(() => {errorDisplayBar.style.opacity = "1"}, 100 );
        setTimeout(() => {errorDisplayBar.style.opacity = "0"}, 4000);
        setTimeout(() => {errorDisplayBar.style.display = "none"}, 5000);
        
    } else {
        let errorDisplayBar = document.createElement('div');
        errorDisplayBar.className = "col-xxl";
        errorDisplayBar.id = "error-display-bar";
        let errorText = document.createElement('p');
        errorText.id ="error-display-text";
        errorText.innerText = "Sorry, we have encountered an error!  Please try refreshing the page."
        errorBarContainer.appendChild(errorDisplayBar);
        errorDisplayBar.appendChild(errorText);
    }
}

//Create the error display bar on load
errorDisplayBar();

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
    console.log(`selected state is: ${selectedStateName}`);
    if(selectedStateName !== "Choose..."){
        citySelectorField.disabled = true;
        getSupportedCities(selectedStateName);
    } else{
        citySelectorField.disabled = true;
        addCityButton.disabled = true;
    }
}

//Get a state is selected, fetch supported cities
async function getSupportedCities(state) {
    let resCities = await fetch(`${baseURL}cities?state=${state}&country=USA&key=${apiKey}`);
    let resData = await resCities.json();
    let supportedCities = resData.data;
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
            
        } else {
            errorDisplayBar(`You have already added ${selectedCityName}, ${selectedStateName} to your dashboard!`)
            // alert("You've already added this city to your dashboard!")
        }
}

//Initialize a function to remove a card when the remove card button is clicked
function removeCard (e){
    let currentCard = e.target.parentNode.parentNode.parentNode.parentNode;
    let cardsContainer = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
    currentCard.style.opacity = '0';
    setTimeout(function(){cardsContainer.removeChild(currentCard)}, 500)
    console.log(`Remove Card Has Been Triggered for ${currentCard.firstChild}`);
    console.log(currentCard.firstChild);
}

async function createCityDataCard(n){
    let fetchedPhoto = await photoFetcher(`${selectedCityName}${selectedStateName}`);
    //Create the container for each card
    let cityCardContainer = document.createElement('div');
    cityCardContainer.className = "col-xl-6";
    //Set up transition properties
    cityCardContainer.style.transitionDuration = "700ms";
    cityCardContainer.style.transitionProperty ="opacity"
    cityCardContainer.style.opacity="0" ;

    //Create the outer card for the city
    let cityCard = document.createElement('div');
    cityCard.className = "row card-custom mx-auto h-100";
    if(document.body.classList.contains("dark-theme")){
        cityCard.classList.toggle("dark-theme")
    }

    //Set custom dom attributes for city and state to reference on events.  These are used to easily access the cards from anywhere in the file using query selector using a query like this document.querySelectorAll(`div[cityName = "${selectedCityName}"]`
    cityCard.setAttribute("stateName", "" + n.data.state + "") ;
    cityCard.setAttribute("cityName", "" + n.data.city + "") ;

    //Create main left column
    let cityCardColA = document.createElement('div');
    cityCardColA.className = "col-7 px-0 pe-1"
    //Create main left column contents
    let cityCardColA1 = document.createElement('h3');
    cityCardColA1.className = "card-header-custom";
    cityCardColA1.innerText = `${n.data.city}, ${n.data.state}`;
    let cityCardColA2 = document.createElement('div');
    cityCardColA2.className = "col";
    let cityCardColA2A = document.createElement('div');
    cityCardColA2A.className = "row mx-auto h-100";

    //Create main right column
    let cityCardColB = document.createElement('div');
    cityCardColB.className = "col px-0";
    //Create main right column contents
    let cityCardColB1 = document.createElement('div');
    cityCardColB1.className = "card-image-container";

    cityCardColB1.setAttribute("style", "background-image: url("+ fetchedPhoto +")")

    if(fetchedPhoto.includes("no-image-avail")){
        cityCardColB1.setAttribute("style", "background-size: contain")
    } 
    //Create Remove Card Button
    let removeCardButton = document.createElement('button');
    removeCardButton.className = "btn btn-secondary remove-card";
    removeCardButtons = document.getElementsByClassName("remove-card")
    if(document.body.classList.contains("dark-theme")){
        removeCardButton.classList.toggle("dark-theme")
    }
    

    //Append card to static dom element
    mainCardsContainer.prepend(cityCardContainer);
        cityCardContainer.appendChild(cityCard);
            cityCard.appendChild(cityCardColA);
                cityCardColA.appendChild(cityCardColA1);
                cityCardColA.appendChild(cityCardColA2);
                    cityCardColA2.appendChild(cityCardColA2A);
            cityCard.appendChild(cityCardColB);
                cityCardColB.appendChild(cityCardColB1);
                    cityCardColB1.appendChild(removeCardButton);

    //Create an onclick trigger for this card
    removeCardButton.onclick = removeCard;

    //Initialize data points array
    let weatherDataArray = [];
    class weatherDataObject {
        constructor (abbrev, name, dataPoint, percentString, city, state) {
            this.abbrev = abbrev;
            this.name = name;
            this.dataPoint = dataPoint;
            this.percentString = percentString;
            this.city = city;
            this.state = state;
        }
    }

    //Process AQI Data (Air Quality Index)
    let aqi = (n.data.current.pollution.aqius).toFixed(1);
    let aqiPercent = Math.floor((aqi/150) * 100);
    let aqiPercentString = `${aqiPercent}%`;
    weatherDataArray.push(new weatherDataObject("aqi", "Air Quality Index", aqi, aqiPercentString));

    //Process Temp Data
    let tempFar = (((n.data.current.weather.tp) * (9/5)) + 32).toFixed(1) ;
    let tempFarPercent = Math.floor((tempFar/110) * 100);
    let tempFarPercentString= `${tempFarPercent}%`
    weatherDataArray.push(new weatherDataObject("temp", "Temp (F)", tempFar, tempFarPercentString));

    //Process Humidity Data
    let humidity = n.data.current.weather.hu ;
    let humidityString = `${humidity}%` ;
    weatherDataArray.push(new weatherDataObject ("humidity", "Humidity", humidity, humidityString));

    //Process Wind Speed Data
    let windSpeed = n.data.current.weather.ws ;
    let windSpeedPercent = Math.floor((windSpeed/50) * 100);
    let windSpeedString = `${windSpeedPercent}%`;
    weatherDataArray.push(new weatherDataObject ("windSpeed", "Wind Speed", windSpeed, windSpeedString));

    //Iterate through data and create dom elements

    weatherDataArray.forEach(weatherDataObject => {
        let outerDataBox = document.createElement('div');
        if (weatherDataObject.abbrev == "aqi") {
            outerDataBox.className = "col p-0 air-quality-index-box";
        } else if (weatherDataObject.abbrev == "temp") {
            outerDataBox.className = "col p-0 temperature-box";
        } else if (weatherDataObject.abbrev == "humidity") {
            outerDataBox.className = "col p-0 humidity-box";
        } else if (weatherDataObject.abbrev == "windSpeed"){
            outerDataBox.className = "col p-0 wind-box";
        }
        //Create Data flex box
        let innerDataFlex = document.createElement('div');
        innerDataFlex.className = "col d-flex flex-column justify-content-between h-100";

        //Create the data point Title
        let dataHeader = document.createElement('p');
        dataHeader.className = "data-header-text"
        dataHeader.innerText = `${weatherDataObject.name}`;

        //Create Data visual components
        let dataVisualContainer = document.createElement('div');
        dataVisualContainer.className = "row mx-auto align-center";

        let dataBarOuterContainer = document.createElement('div');
        dataBarOuterContainer.className = "col-xs py-2 px-0";
        let dataBarContainer = document.createElement('div');
        dataBarContainer.className = "visual-bar-container";
        let dataBarInner = document.createElement('div');
        dataBarInner.className = "visual-bar-inside" 
        
        //Assign custom color classes
        dataColorClass = (weatherDataObject.abbrev == "aqi"?"aqi"
                        : weatherDataObject.abbrev == "temp"?"temperature"
                        : weatherDataObject.abbrev == "humidity"?"humidity"
                        : "windSpeed")
        dataBarInner.classList.add(dataColorClass) ;
        dataBarInner.style.height = `${weatherDataObject.percentString}`;
        
        let dataCircleOuterContainer = document.createElement('div');
        dataCircleOuterContainer.className = "col-xs py-2 px-0";
        let dataCircle = document.createElement('div');
        dataCircle.className = "data-circle";
        let dataText = document.createElement('p');
        dataText.className = "data-text";
        dataText.innerHTML = `${Math.floor(weatherDataObject.dataPoint)}`;
        dataText.classList.add(dataColorClass);

        //Add all the dom elements to the page
        cityCardColA2A.appendChild (outerDataBox);
            outerDataBox.appendChild(innerDataFlex);
                innerDataFlex.appendChild(dataHeader);
                innerDataFlex.appendChild(dataVisualContainer);
                    dataVisualContainer.appendChild(dataBarOuterContainer);
                        dataBarOuterContainer.appendChild(dataBarContainer);
                            dataBarContainer.appendChild(dataBarInner);
                    dataVisualContainer.appendChild(dataCircleOuterContainer);
                        dataCircleOuterContainer.appendChild(dataCircle);
                            dataCircle.appendChild(dataText);
            
        //Fade In the Card
        setTimeout(() => cityCardContainer.style.opacity="1", 50) ;
    });
}

//Get search for cities by name and then fetch a photo if one exists

async function photoFetcher (citySearch) {
    let fetchedPhoto
    let removeSpaces = await citySearch.replace(/\s+/g, '') ;
    let results = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${removeSpaces}&inputtype=textquery&fields=photos&key=${gPlaceApiKey}`)

    let resultsJson = await results.json();
    if (resultsJson.candidates.length > 0 
        && resultsJson.status === "OK" 
        && resultsJson.candidates[0].hasOwnProperty("photos")) {
        let photoReference = await resultsJson.candidates[0]["photos"][0]["photo_reference"] ;
    
        let photoResult = await fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${gPlaceApiKey}`)
        fetchedPhoto = photoResult.url;
    } else {
        console.log(`Google Maps Api probably does not contain a photo of this place.  Status of returned request is "${resultsJson.status}"`);
        fetchedPhoto = "/assets/no-image-avail.svg"
    }
    return fetchedPhoto;
    
}



