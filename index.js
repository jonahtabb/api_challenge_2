//Set Constants
const baseURL = "http://api.airvisual.com/v2/"
const apiKey = "a1d8a74d-2f39-4e75-a89f-70fa6578cbd9"

const NearestCityDataSlug = "nearest_city?key="
const mainCardsContainer = document.getElementById("main-cards-container");
const stateSelectorField = document.getElementById("select-state");
const citySelectorField = document.getElementById("select-city");
const addCityButton = document.getElementById("add-city-button")

//Set initial state of selector fields
stateSelectorField.disabled = true;
citySelectorField.disabled = true;
addCityButton.disabled = true;

let removeCardButtons = []; //Current list of cards displayed on the dom (Specifically, each card's 'remove card' button element)
let selectedStateName = "" ; //Currently selected State name

citySelectorField.onchange = getCityData;
stateSelectorField.onchange = getCurrentState ;  //Note to self: don't use () for 'onchange' because we want reference the function but not immediately call it when it initially gets read. These type of functions pass event info into the function.
// NEED TO ADD THIS FUNCTIONALITY addCityButton.onclick = 

//Get the supported states on page load!
getSupportedStates()

async function getSupportedStates () {
    let resStates = await fetch(`${baseURL}states?country=USA&key=${apiKey}`);
    let resData = await resStates.json();
    let supportedStates = await resData.data;
    addStatesToList(supportedStates);
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

async function getCityData (e) {
    let cityName = e.target.value;
    if(cityName !== "Choose..."){
        let resCity = await fetch(`${baseURL}city?city=${cityName}&state=${selectedStateName}&country=USA&key=${apiKey}`);
        cityData = await resCity.json();
        // console.log(cityData);
        addCityButton.disabled = false;
        createVisualBar(cityData);
    }else {addCityButton.disabled = true}

}



//Initialize a function to remove a card when the remove card button is clicked
function removeCard (e){
    let currentCard = e.target.parentNode;
    let cardsContainer = e.target.parentNode.parentNode;
    currentCard.style.opacity = '0';
    setTimeout(function(){cardsContainer.removeChild(currentCard)}, 500)
    console.log("Remove Card Has Been Triggered for " + currentCard);
    // cardsContainer.removeChild(currentCard);
}

function createVisualBar(n){
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

    //Create the outer card for the city
    let cityCard = document.createElement('div');
    cityCard.className = "card p-3 m-4";
    //Set up properties to fade out when removed
    cityCard.style.transitionDuration = "499ms";
    cityCard.style.transitionProperty ="opacity"
    cityCard.style.opacity="1"

    //Set custom dom attributes for city and state to reference on events
    cityCard.setAttribute("state-name", "" + n.data.state + "") ;
    cityCard.setAttribute("city-name", "" + n.data.city + "") ;

    removeCardButtons = document.getElementsByClassName("remove-card")

    //Create remove card button
    let removeCardButton = document.createElement('div');
    removeCardButton.className = "btn btn-secondary remove-card" ;
    removeCardButtons = document.getElementsByClassName("remove-card");
    

    //Create City/State Title and add to the city card
    let cityTitle = document.createElement('h2');
    cityTitle.innerText = `${n.data.city}, ${n.data.state}`;

    //Append card to static dom element
    mainCardsContainer.prepend(cityCard);
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
    let tempFarString = Math.floor(tempFar.toString());
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

    });
}
