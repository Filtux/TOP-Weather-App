/* eslint-disable no-undef */
import '../css/styles.css';

const WEATHER_API_KEY = '6013851a6d2249b184e100322240706';
const WEATHER_API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=`;

async function fetchWeatherData(location) {
    try {
        const response = await fetch(`${WEATHER_API_URL}${location}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetching weather data failed:', error);
    }
}

function processWeatherData(data) {
    return {
        location: `${data.location.name}, ${data.location.country}`,
        description: `Condition: ${data.current.condition.text}`,
        icon_URL: `${data.current.condition.icon}`,
        currentTemperature: `Temperature: ${data.current.temp_c}°C`,
        cloud: `Cloud Cover: ${data.current.cloud}%`,
        precipitation: `Rain: ${data.forecast.forecastday[0].day.daily_chance_of_rain}% | ${data.current.precip_mm}mm`,
        uvIndex: `UV Index: ${data.current.uv}`,
        minMaxTemp: `Min: ${data.forecast.forecastday[0].day.mintemp_c}°C | Max: ${data.forecast.forecastday[0].day.maxtemp_c}°C`,
        averageTemp: `Average: ${data.forecast.forecastday[0].day.avgtemp_c}°C`,
        sunriseSunset: `Sunrise: ${data.forecast.forecastday[0].astro.sunrise} | Sunset: ${data.forecast.forecastday[0].astro.sunset}`
    };
}

function displayWeather(data) {
    document.querySelector('.weather-location').textContent = data.location;
    document.querySelector('.weather-description').textContent =        data.description;
    document.querySelector('.weather-icon').src = data.icon_URL;
    document.querySelector('.weather-temperature').textContent =        data.currentTemperature;
    document.querySelector('.weather-cloudCover').textContent = data.cloud;
    document.querySelector('.weather-precipitation').textContent =        data.precipitation;
    document.querySelector('.weather-uv').textContent = data.uvIndex;
    document.querySelector('.weather-minMaxTemp').textContent = data.minMaxTemp;
    document.querySelector('.weather-maxTemp').textContent = data.maxTemp;
    document.querySelector('.weather-avgTemp').textContent = data.averageTemp;
    document.querySelector('.sunrise_sunset').textContent = data.sunriseSunset;
    document.querySelector('.weather-info').style.display = 'block';
}

document
    .querySelector('.location-form')
    .addEventListener('submit', async (event) => {
        event.preventDefault();
        const location = document.querySelector('.location-input').value;
        document.querySelector('.loading').style.display = 'block';
        document.querySelector('.weather-info').style.display = 'none';

        const weatherData = await fetchWeatherData(location);

        document.querySelector('.loading').style.display = 'none';

        if (weatherData) {
            const processedWeatherData = processWeatherData(weatherData);
            displayWeather(processedWeatherData);
        } else {
            alert('Could not fetch weather data for the given location.');
        }
    });
