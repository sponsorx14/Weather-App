
const CONSTANTS = Object.freeze({
  'WOEID_URL': '/api/location/search/?query=',
  'API_URL': 'https://www.metaweather.com',
  'WEATHER_URL': '/api/location/',
  'CORS_URL': 'https://cors-anywhere.herokuapp.com/',
  'IMAGE_URL': '/static/img/weather/'
});
const cityInput = document.querySelector('#city');
const searchBtn = document.getElementById('search');


const getWoeid = city => (new Promise((resolve, reject) => {
    fetch(`${CONSTANTS.CORS_URL}${CONSTANTS.API_URL}${CONSTANTS.WOEID_URL}${city}`)
        .then(data => data.json())
        .then(data => resolve(data[0].woeid))
        .catch(error => sweetAlert('Oops...', 'No such city', 'error'))
        .then(data => {if(data.value){
          cityInput.value= '';
        }})
}));

const getWeather = woeid => (new Promise((resolve, reject) => {
    fetch(`${CONSTANTS.CORS_URL}${CONSTANTS.API_URL}${CONSTANTS.WEATHER_URL}${woeid}`)
        .then(data => data.json())
        .then(data => resolve(data))
}));

const generateHistory = city => {
  let history = document.createElement('p');
  history.innerHTML += city;
  document.querySelector('.history').append(history);
}

const generateTableData = data => {
  console.log(data);
    let searchedCity = data.title;
    generateHistory(searchedCity);
    let result = '';
    cityInput.value = '';
    data.consolidated_weather.forEach(item => {
        result += `
            <tr>
                <td>${item.applicable_date}</td>
                <td>${Math.round(item.the_temp)}&#8451;</td>
                <td>${item.weather_state_name}</td>
                <td><img src="${CONSTANTS.API_URL}${CONSTANTS.IMAGE_URL}${item.weather_state_abbr}.svg" width="32"></td>
            </tr>
        `
    });

    document.getElementById('data').querySelector('tbody').innerHTML = result;
    document.querySelector('.searches').innerHTML = searchedCity;
};

// main


searchBtn.addEventListener('click', e => {
    e.preventDefault();
    const city = document.getElementById('city').value;
    getWoeid(city).then(woeid => getWeather(woeid).then(data => generateTableData(data)));

});
