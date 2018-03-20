const CONSTANTS = Object.freeze({
  'WOEID_URL': '/api/location/search/?query=',
  'API_URL': 'https://www.metaweather.com',
  'WEATHER_URL': '/api/location/',
  'CORS_URL': 'https://cors-anywhere.herokuapp.com/',
  'IMAGE_URL': '/static/img/weather/'
});
const iput = document.querySelector('#city');

const getWoeid = city => (new Promise((resolve, reject) => {
    fetch(`${CONSTANTS.CORS_URL}${CONSTANTS.API_URL}${CONSTANTS.WOEID_URL}${city}`)
        .then(data => data.json())
        .then(data => resolve(data[0].woeid));
}));

const getWeather = woeid => (new Promise((resolve, reject) => {
    fetch(`${CONSTANTS.CORS_URL}${CONSTANTS.API_URL}${CONSTANTS.WEATHER_URL}${woeid}`)
        .then(data => data.json())
        .then(data => resolve(data.consolidated_weather));
}));


const generateTableData = data => {
    let result = '';
    city.value = '';
    data.forEach(item => {
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
};

const checkEnter = (e) => {
  if(e.keyCode ==13) {
    e.preventDefault;
    const city = document.getElementById('city').value;
    getWoeid(city).then(woeid => getWeather(woeid).then(data => generateTableData(data)));
  }
}

// main
const searchBtn = document.getElementById('search');

searchBtn.addEventListener('click', e => {
    e.preventDefault();

    const city = document.getElementById('city').value;
    getWoeid(city).then(woeid => getWeather(woeid).then(data => generateTableData(data)));
});
