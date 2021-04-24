
const baseURL = "http://api.airvisual.com/v2/"
const apiKey = "a1d8a74d-2f39-4e75-a89f-70fa6578cbd9"
const supportedCountriesSlug = "countries?key="
const NearestCityDataSlug = "nearest_city?key="

const mainCardsContainer = document.getElementById("main-cards-container")


async function getSupportedCountries () {
    console.log("getData Function Has Started");
    let resCountries = await fetch(baseURL+supportedCountriesSlug+apiKey);
    let data = await resCountries.json();
    console.log(data);
    return data;
}

// getSupportedCountries()

async function getNearestCityData () {
    console.log("getNearestCityData Function Has Started");
    let nearestCityData = await fetch(baseURL+NearestCityDataSlug+apiKey);
    nearestCityData = await nearestCityData.json();
    console.log(nearestCityData);
    createVisualBar(nearestCityData);
    // console.log(nearestCityData.data.current.pollution.aqius);
}

function createVisualBar(n){

    //Create the outer card for the city
    let cityCard = document.createElement('div');
    cityCard.className = "card p-3";

    //Create City Title
    let cityTitle = document.createElement('h2');
    cityTitle.innerText = `${n.data.city}, ${n.data.state}`;

    //Create Air Quality Index Title
    let aqiTitle = document.createElement('h3');
    aqiTitle.innerText = `Air Quality Index: ${n.data.current.pollution.aqius}`;

    //Convert aqi to percent of 300
    let aqi = n.data.current.pollution.aqius;
    // let aqi = 51; // for testing, comment out the above line and use this number
    let aqiPercent = Math.floor((aqi/300) * 100);
    let aqiPercentString = `${aqiPercent}%`;

    //Convert the temp to F
    let tempFar = ((n.data.current.weather.tp) * (9/5)) + 32 ;
    let tempFarString = Math.floor(tempFar.toString());
    let tempFarPercentString= `${tempFar}%`
    console.log(tempFarPercentString);
   
    //Set Bar color
    let barColorAqi = "rgba(255, 255, 255, 0)"
    if (aqi < 51) {barColorAqi = "Green"}
    else if (aqi < 101) {barColorAqi = "Yellow"}
        
    console.log(aqiPercentString);

    //Create the aqi bar container
    let barContainerAqi = document.createElement('div');
    barContainerAqi.className = "visual-bar-container";
    
    //Create the aqi inner bar
    let barInnerAqi = document.createElement('div');
    barInnerAqi.className = "visual-bar-inside visual-bar-aqi";
    barInnerAqi.style.width = aqiPercentString;
    barInnerAqi.style.backgroundColor = barColorAqi;

    //Create Temperature Title
    let tempTitle = document.createElement('h3');
    tempTitle.innerText = `Temp (F): ${tempFarString} deg`;

    //Create the temp bar container
    let barContainerTemp = document.createElement('div');
    barContainerTemp.className = "visual-bar-container";

    //Create the temp bar inner container
    let barInnerTemp = document.createElement('div');
    barInnerTemp.className = "visual-bar-inside visual-bar-temp";
    barInnerTemp.style.width = tempFarPercentString;

    //Append Elements

    mainCardsContainer.appendChild(cityCard);
    cityCard.appendChild(cityTitle);

    cityCard.appendChild(aqiTitle);
    cityCard.appendChild(barContainerAqi);
    barContainerAqi.appendChild(barInnerAqi);

    cityCard.appendChild(tempTitle);
    cityCard.appendChild(barContainerTemp);
    barContainerTemp.appendChild(barInnerTemp);
    console.log(barInnerTemp);
    

}

getNearestCityData()




// async function getListOfPhotoCities (){
//     let incomingData = await fetch("https://api.teleport.org/api/urban_areas");
//     photoCityList = await incomingData.json();
//     doesSomethingWithData(photoCityList)

//     console.log(photoCityList._links);
// }

// getListOfPhotoCities();
