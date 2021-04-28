//Set Constants
const baseURL = "http://api.airvisual.com/v2/"
const apiKey = "a1d8a74d-2f39-4e75-a89f-70fa6578cbd9"

const NearestCityDataSlug = "nearest_city?key="
const mainCardsContainer = document.getElementById("main-cards-container");
const stateSelectorField = document.getElementById("select-state");
const citySelectorField = document.getElementById("select-city");
stateSelectorField.onchange = getCurrentState ;
// citySelectorField.onchange = getCityData();


getSupportedStates()

async function getSupportedStates () {
    let resStates = await fetch(`${baseURL}states?country=USA&key=${apiKey}`);
    let resData = await resStates.json();
    let supportedStates = await resData.data;
    await addStatesToList(supportedStates);
    console.log(supportedStates[0].state);
    await getSupportedCities(supportedStates[0].state);
}

//Ads supported states to drop down list
function addStatesToList(arr) {
    let stateOptions = "";
    arr.forEach(element => {
        stateOptions += `<option>${element.state}</option>`
    });
    stateSelectorField.innerHTML = stateOptions;
}

//Ads supported cities to drop down list
function addCitiesToList(arr) {
    let cityOptions = "";
    arr.forEach(element => {
        cityOptions += `<option>${element.city}</option>`
    });
    citySelectorField.innerHTML = cityOptions;
}

//When stateSelectorField is changed, this function is run.
function getCurrentState() {
    let state = stateSelectorField.value;

    let supportedCities = getSupportedCities(state)
    
}

async function getSupportedCities(state) {
    let resCities = await fetch(`${baseURL}cities?state=${state}&country=USA&key=${apiKey}`);
    let resData = await resCities.json();
    let supportedCities = resData.data;
    addCitiesToList(supportedCities);
    
}

// async function getCityData (cityName, stateName) {
//     let resCity = await fetch(`${baseURL}city?city=${cityName}&${stateName}&country=USA&key=${apiKey}`);
//     cityData = await resCity.json();
//     console.log(cityData);
//     // createVisualBar(nearestCityData);
//     // console.log(nearestCityData.data.current.pollution.aqius);
// }

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
        cityCard.className = "card p-3";

        //Create City/State Title and add to the city card
        let cityTitle = document.createElement('h2');
        cityTitle.innerText = `${n.data.city}, ${n.data.state}`;
        mainCardsContainer.appendChild(cityCard);
        cityCard.appendChild(cityTitle);

        //Process AQI Data (Air Quality Index)
        let aqi = (n.data.current.pollution.aqius).toFixed(1);
        // let aqi = 51; // for testing, comment out the above line and use this number
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
                barColor = "blue"
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





//Original code I built to staticly create teh elements:
// //Set Bar color
    // let barColorAqi = "rgba(255, 255, 255, 0)"
    // if (aqi < 51) {barColorAqi = "Green"}
    // else if (aqi < 101) {barColorAqi = "Yellow"}
        
    // //Create the aqi bar container
    // let barContainerAqi = document.createElement('div');
    // barContainerAqi.className = "visual-bar-container";
    
    // //Create the aqi inner bar
    // let barInnerAqi = document.createElement('div');
    // barInnerAqi.className = "visual-bar-inside visual-bar-aqi";
    // barInnerAqi.style.width = aqiPercentString;
    // barInnerAqi.style.backgroundColor = barColorAqi;

    // //Create Temperature Title
    // let tempTitle = document.createElement('h3');
    // tempTitle.innerText = `Temp (F): ${tempFarString} deg`;

    // //Create the temp bar container
    // let barContainerTemp = document.createElement('div');
    // barContainerTemp.className = "visual-bar-container";

    // //Create the temp bar inner container
    // let barInnerTemp = document.createElement('div');
    // barInnerTemp.className = "visual-bar-inside visual-bar-temp";
    // barInnerTemp.style.width = tempFarPercentString;

    //Append Elements



    // mainCardsContainer.appendChild(cityCard);
    // cityCard.appendChild(cityTitle);


    // cityCard.appendChild(aqiTitle);
    // cityCard.appendChild(barContainerAqi);
    // barContainerAqi.appendChild(barInnerAqi);

    // cityCard.appendChild(tempTitle);
    // cityCard.appendChild(barContainerTemp);
    // barContainerTemp.appendChild(barInnerTemp);
    // console.log(barInnerTemp);


// async function getListOfPhotoCities (){
//     let incomingData = await fetch("https://api.teleport.org/api/urban_areas");
//     photoCityList = await incomingData.json();
//     doesSomethingWithData(photoCityList)

//     console.log(photoCityList._links);
// }

// getListOfPhotoCities();
