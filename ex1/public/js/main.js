"use strict";

document.addEventListener('DOMContentLoaded', init);
let city = "Manila";

function init() {
  const searchButton = document.getElementsByClassName('btn-search')[0];
  searchButton.onclick = onClickSearchButton;

  getWeatherData('current').then((jsonResponse) => {
    displayCurrentWeather(jsonResponse);
  }).catch((err) => {
    console.log(err);
  });

  getWeatherData('forecast').then((jsonResponse) => {
    displayForecastWeather(jsonResponse);
  }).catch((err) => {
    console.log(err);
  });

}

function onClickSearchButton(event) {
  const inputValue = document.getElementsByClassName('search-city-input')[0].value;

  if ((inputValue === null) || (inputValue === undefined) || (inputValue === '')) {
    alert('Invalid input');  
  } else {
    city = inputValue;

    getWeatherData('current').then((jsonResponse) => {
      updateCurrentWeather(jsonResponse);
      updateForecastTitle(jsonResponse);
    }).catch((err) => {
      console.log(err);
    });

    getWeatherData('forecast').then((jsonResponse) => {
      document.querySelector('.forecast-weather table').remove();
      displayForecastTable(jsonResponse);
    }).catch((err) => {
      console.log(err);
    });
  }
}

function updateCurrentWeather(json) {
  let locationTag = document.getElementById('location').getElementsByTagName('span')[0];
  locationTag.innerText = `Weather in ${json.name}, ${json.sys.country}`;

  let iconTag = document.getElementById('currentTemp').getElementsByTagName('img')[0];
  iconTag.src = `http://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`

  let tempTag = document.getElementById('currentTemp').getElementsByTagName('span')[0];
  tempTag.innerText = `${json.main.temp} °C`;

  let weatherDescTag = document.getElementById('weatherDesc').getElementsByTagName('span')[0];
  weatherDescTag.innerText = `${json.weather[0].description}`;

  let currentDatetimeTag = document.getElementById('currentDatetime').getElementsByTagName('span')[0];
  const date = new Date((json.dt + json.timezone - 8*60*60) * 1000);
  const d = [
    '0' + date.getHours(),
    '0' + date.getMinutes()
  ].map(component => component.slice(-2));

  const month = new Intl.DateTimeFormat('en-US', {month: 'short'}).format(date);

  currentDatetimeTag.innerText = `${d[0]}:${d[1]} ${month} ${date.getDate()}`;
}

function updateForecastTitle(json) {
  let spanTag = document.querySelector('.forecast-weather span.title');
  spanTag.innerText = `Hourly weather and forecasts in ${json.name}, ${json.sys.country}`;
}

function displayForecastWeather(json) {
  displayForecastTitle(json.city);
  displayForecastTable(json);
}

function displayForecastTable(json) {
  let list = json.list;
  let city = json.city;

  let parentNode = document.getElementsByClassName('forecast-weather')[0];
  let topTableTag = document.createElement('table');
  topTableTag.className = "weather-forecast-hourly-list-table";
  parentNode.append(topTableTag);

  let tbodyTag = document.createElement('tbody');
  topTableTag.append(tbodyTag);

  let currentDate = null;
  for (let i = 0; i < list.length; i++) {
    list[i].dt = list[i].dt + city.timezone - 8*60*60;
    let date = (new Date(list[i].dt * 1000)).getDate();
    
    if (date !== currentDate) {
      displayForecastItem(list[i], tbodyTag, true);
    } else { 
      displayForecastItem(list[i], tbodyTag, false);
    }
    currentDate = date;
  }
}

function displayForecastItem(item, toptbody, displayDate = true) {
  let trTag = document.createElement('tr');
  trTag.className = "weather-forecast-hourly-list-items";
  toptbody.append(trTag);
  let tdTag = document.createElement('td');
  tdTag.className = "weather-forecast-hourly-list-item";
  trTag.append(tdTag);

  let tableTag = document.createElement('table');
  tableTag.className = "weather-forecast-hourly-list-sub-table";
  tdTag.append(tableTag);
  let tbodyTag = document.createElement('tbody');
  tableTag.append(tbodyTag);

  if (displayDate) {
    displayForecastDate(item.dt, tbodyTag); // TODO: invoke only when date changes
  }
  displayForecastItemInfo(item, tbodyTag);
}

function displayForecastItemInfo(item, tbodyTag) {
  let trTag = document.createElement('tr');
  trTag.className = "weather-forecast-hourly-list-row-list-items";
  tbodyTag.append(trTag);
  displayForecastItemInfoLeft(item, trTag);
  displayForecastItemInfoRight(item, trTag);
}

function displayForecastItemInfoRight(item, trTag) {
  let tdTag = document.createElement('td');
  tdTag.className = "weather-forecast-hourly-list-sub-item";
  trTag.append(tdTag);

  let spanTag = document.createElement('span');
  spanTag.className = "weather-forecast-hourly-list-night";
  spanTag.innerText = `${item.main.temp} °C`;
  tdTag.append(spanTag);

  let iTag = document.createElement('i');
  iTag.innerText = `${item.weather[0].description}`;
  tdTag.append(iTag);

  const windSpeed = item.wind.speed;
  let pTag = document.createElement('p');
  pTag.innerText = `${windSpeed}, m/s clouds: ${item.clouds.all} % ${item.main.pressure} hpa`
  tdTag.append(pTag);
}

function displayForecastItemInfoLeft(item, trTag) {
  let itemdate = new Date(item.dt * 1000);
  let d = [
    '0' + itemdate.getHours(),
    '0' + itemdate.getMinutes()
  ].map(component => component.slice(-2));

  let tdTag = document.createElement('td');
  tdTag.className = "weather-forecast-hourly-list-sub-item"
  tdTag.innerText = `${d[0]}:${d[1]}`;
  trTag.append(tdTag);

  const imgIcon = item.weather[0].icon;
  let imgTag = document.createElement('img');
  imgTag.src = `http://openweathermap.org/img/wn/${imgIcon}@2x.png`;
  imgTag.setAttribute('alt', 'forecast');
  imgTag.setAttribute('width', '50');
  imgTag.setAttribute('height', '50');
  tdTag.append(imgTag);
}

function displayForecastDate(dt, tbodyTag) {
  let itemdate = new Date(dt * 1000);
  let day = new Intl.DateTimeFormat('en-US', {weekday: "short"}).format(itemdate);
  let month = new Intl.DateTimeFormat('en-US', {month: "short"}).format(itemdate);
  let date = new Intl.DateTimeFormat('en-US', {day: "2-digit"}).format(itemdate);
  let year = itemdate.getFullYear();

  let trTag = document.createElement('tr');
  trTag.className = "weather-forecast-hourly-list-row-date";
  tbodyTag.append(trTag);
  
  let tdTag = document.createElement('td');
  tdTag.className = "weather-forecast-hourly-list-item-date"
  tdTag.setAttribute("colspan", "2");
  tdTag.innerHTML = `${day} ${month} ${date} ${year}`;
  trTag.append(tdTag);
}

function displayForecastTitle(city) {
  let spanTag = document.createElement('span');
  spanTag.className = 'title';
  spanTag.innerHTML = `Hourly weather and forecasts in ${city.name}, ${city.country}`;
  document.getElementsByClassName('forecast-weather')[0].append(spanTag);
}

function displayCurrentWeather(json) {
  displayCurrentLocation(json.name, json.sys.country);
  displayCurrentWeatherIcon(json.weather[0].icon);
  displayCurrentTemp(json.main.temp);
  displayCurrentWeatherDescription(json.weather[0].description);
  displayCurrentDatetime(json.dt + json.timezone - 8*60*60);
}

function displayCurrentDatetime(item) {
  const divTag = document.getElementById('currentDatetime');
  const spanTag = document.createElement('span');
  const date = new Date(item * 1000);
  const d = [
    '0' + date.getHours(),
    '0' + date.getMinutes()
  ].map(component => component.slice(-2));

  const month = new Intl.DateTimeFormat('en-US', {month: 'short'}).format(date);

  spanTag.innerHTML = `${d[0]}:${d[1]} ${month} ${date.getDate()}`;
  divTag.append(spanTag);
}

function displayCurrentWeatherDescription(item) {
  let divTag = document.getElementById('weatherDesc');
  let spanTag = document.createElement('span');
  spanTag.innerHTML = item;
  divTag.append(spanTag);
}

function displayCurrentWeatherIcon(item) {
  let divTag = document.getElementById('currentTemp');
  let spanTag = document.createElement('span');
  let imgTag = document.createElement('img');
  imgTag.src = `http://openweathermap.org/img/wn/${item}@2x.png`;
  spanTag.append(imgTag);
  divTag.append(imgTag)
}

function displayCurrentLocation(city, country) {
  let div = document.getElementById('location')
  let span = document.createElement('span')
  span.innerHTML = `Weather in ${city}, ${country}`;
  div.appendChild(span);
}

function displayCurrentTemp(currentTemp) {
  let tempDiv = document.getElementById('currentTemp')
  let temp = document.createElement('span')
  temp.innerHTML = `${currentTemp} °C`;
  tempDiv.appendChild(temp);
}

async function getWeatherData(type = null) {
  if (type === null) 
    throw new Error("Invalid argument. Argument should be current/forecast");
  if (type !== 'current' && type !== 'forecast')
    throw new Error("Invalid argument. Argument should be current/forecast");

  const appid = "e4e347293a9774392360146efb825f69";
  const units = "metric";

  let queryType = null;
  if (type === 'current') queryType = 'weather';
  else if (type === 'forecast') queryType = 'forecast';

  const url = `http://api.openweathermap.org/data/2.5/${queryType}?q=${city}&appid=${appid}&units=${units}`;

  let jsonResponse = null;

  try {
    const httpResponse = await fetch(url);
    jsonResponse = await httpResponse.json();  
  } catch (err) {
    console.log(err);
    throw err;
  }
  
  return jsonResponse;
}