const ApiUrl = 'http://api.openweathermap.org/data/2.5/weather';
const ApiKey = '95900833c2fb71d9f4e8b3a8cc25e608';

async function fetchWeather (url) {
  const res  = await window.fetch(url);
  const json = await res.json();

  if (json.cod !== 200)
    throw new Error(json.message);

  return {
    id: json.id,
    name: json.name,
    weather: json.weather[0],
    temp: json.main.temp,
    wind: json.wind,
  };
}

export default {
  fetchByCityName: async (cityName) => {
    const url = `${ApiUrl}?q=${cityName}&units=metric&APPID=${ApiKey}`;
    return await fetchWeather(url);
  },
  fetchByCityId:   async (cityId) => {
    const url = `${ApiUrl}?id=${cityId}&units=metric&APPID=${ApiKey}`;
    return await fetchWeather(url);
  },
  fetchByCoords:   async (coords) => {
    const url = `${ApiUrl}?lat=${coords.lat}&lon=${coords.lon}&units=metric&APPID=${ApiKey}`;
    return await fetchWeather(url);
  }
};
