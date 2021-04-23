
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
    // console.log(data);
    createVisualBar(nearestCityData);
    // console.log(nearestCityData.data.current.pollution.aqius);
}

function createVisualBar(n){
    //Convert aqi to percent of 300
    let aqi = n.data.current.pollution.aqius;
    // let aqi = 51; // for testing, comment out the above line and use this number
    let aqiPercent = Math.floor((aqi/300) * 100);
    let aqiPercentString = `${aqiPercent}%`;
   
    //Set Bar color
    let barColorAqi = "rgba(255, 255, 255, 0)"
    if (aqi < 51) {barColorAqi = "Green"}
    else if (aqi < 101) {barColorAqi = "Yellow"}
        
    console.log(aqiPercentString);

    //Create the outer card for the city
    let cityCard = document.createElement('div');
    cityCard.className = "card p-3";

    //Create the aqi bar container
    let cityCardBarContainerAqi = document.createElement('div');
    cityCardBarContainerAqi.className = "visual-bar-container";
    
    //Create the inner bar
    let cityBarInnerAqi = document.createElement('div');
    cityBarInnerAqi.className = "visual-bar-inside visual-bar-aqi";
    cityBarInnerAqi.style.width = aqiPercentString;
    cityBarInnerAqi.style.backgroundColor = barColorAqi;


    mainCardsContainer.appendChild(cityCard);
    cityCard.appendChild(cityCardBarContainerAqi);
    cityCardBarContainerAqi.appendChild(cityBarInnerAqi);

}

getNearestCityData()




// async function getListOfPhotoCities (){
//     let incomingData = await fetch("https://api.teleport.org/api/urban_areas");
//     photoCityList = await incomingData.json();
//     doesSomethingWithData(photoCityList)

//     console.log(photoCityList._links);
// }

// getListOfPhotoCities();
