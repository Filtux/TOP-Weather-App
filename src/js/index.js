/* eslint-disable no-undef */
import '../css/styles.css';

// script.js
const WEATHER_API_KEY = '6013851a6d2249b184e100322240706';
const WEATHER_API_URL = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=`;
const ASTRONOMY_API_URL = `https://api.weatherapi.com/v1/astronomy.json?key=${WEATHER_API_KEY}&q=`;

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

async function fetchAstronomyData(location) {
    const date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    try {
        const response = await fetch(
            `${ASTRONOMY_API_URL}${location}&dt=${date}`
        );
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetching astronomy data failed:', error);
    }
}

function processWeatherData(data) {
    return {
        location: `${data.location.name}, ${data.location.country}`,
        description: `Condition: ${data.current.condition.text}`,
        temperature: `Temperature: ${data.current.temp_c}°C`,
        cloud: `Cloud Cover: ${data.current.cloud}%`,
        precipitation: `Rain: ${data.current.precip_mm}mm`,
        uvIndex: `UV: ${data.current.uv}`
    };
}

function processAstronomyData(data) {
    return {
        sunrise: `Sunrise: ${data.astronomy.astro.sunrise}`,
        sunset: `Sunset: ${data.astronomy.astro.sunset}`,
        moonphase: `Moon Phase: ${data.astronomy.astro.moon_phase}`,
        moonrise: `Moonrise: ${data.astronomy.astro.moonrise}`,
        moonset: `Moonset: ${data.astronomy.astro.moonset}`
    };
}

function displayWeather(data) {
    document.querySelector('.weather-location').textContent = data.location;
    document.querySelector('.weather-description').textContent =        data.description;
    document.querySelector('.weather-temperature').textContent =        data.temperature;
    document.querySelector('.weather-cloudCover').textContent = data.cloud;
    document.querySelector('.weather-precipitation').textContent =        data.precipitation;
    document.querySelector('.weather-uv').textContent = data.uvIndex;
    document.querySelector('.weather-info').style.display = 'block';
}

function displayAstronomy(data) {
    document.querySelector('.sunrise').textContent = data.sunrise;
    document.querySelector('.sunset').textContent = data.sunset;
    document.querySelector('.moonphase').textContent = data.moonphase;
    document.querySelector('.moonrise').textContent = data.moonrise;
    document.querySelector('.moonset').textContent = data.moonset;
    document.querySelector('.astronomy-info').style.display = 'block';
}

document
    .querySelector('.location-form')
    .addEventListener('submit', async (event) => {
        event.preventDefault();
        const location = document.querySelector('.location-input').value;
        document.querySelector('.loading').style.display = 'block';
        document.querySelector('.weather-info').style.display = 'none';
        document.querySelector('.astronomy-info').style.display = 'none';

        const weatherData = await fetchWeatherData(location);
        const astronomyData = await fetchAstronomyData(location);

        document.querySelector('.loading').style.display = 'none';

        if (weatherData) {
            const processedWeatherData = processWeatherData(weatherData);
            displayWeather(processedWeatherData);
        } else {
            alert('Could not fetch weather data for the given location.');
        }

        if (astronomyData) {
            const processedAstronomyData = processAstronomyData(astronomyData);
            displayAstronomy(processedAstronomyData);
        } else {
            alert('Could not fetch astronomy data for the given location.');
        }
    });
