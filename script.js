const cityInput = document.getElementById("cityInput");
const searchForm = document.getElementById("searchForm");
const locationLabel = document.getElementById("locationLabel");
const currentTemp = document.getElementById("currentTemp");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const pressure = document.getElementById("pressure");
const condition = document.getElementById("condition");
const weatherIcon = document.getElementById("weatherIcon");
const forecast = document.getElementById("forecast");

const weatherCodes = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mostly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Depositing rime fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Heavy drizzle", icon: "🌧️" },
  56: { label: "Freezing drizzle", icon: "🌧️" },
  57: { label: "Heavy freezing drizzle", icon: "🌧️" },
  61: { label: "Light rain", icon: "🌦️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  66: { label: "Freezing rain", icon: "🌧️" },
  67: { label: "Heavy freezing rain", icon: "🌧️" },
  71: { label: "Light snow", icon: "🌨️" },
  73: { label: "Snow", icon: "❄️" },
  75: { label: "Heavy snow", icon: "❄️" },
  77: { label: "Snow grains", icon: "❄️" },
  80: { label: "Rain showers", icon: "🌦️" },
  81: { label: "Heavy showers", icon: "🌧️" },
  82: { label: "Violent showers", icon: "⛈️" },
  85: { label: "Snow showers", icon: "🌨️" },
  86: { label: "Heavy snow showers", icon: "🌨️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm with hail", icon: "⛈️" },
  99: { label: "Severe thunderstorm", icon: "⛈️" }
};

function formatTime(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatDay(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short"
  }).format(date);
}

function getWeatherMeta(code) {
  return weatherCodes[code] || { label: "Unknown", icon: "🌡️" };
}

function renderForecast(daily) {
  forecast.innerHTML = "";

  daily.time.forEach((day, index) => {
    const code = daily.weather_code[index];
    const meta = getWeatherMeta(code);

    const card = document.createElement("div");
    card.className = "forecast-card";

    const dayLabel = document.createElement("div");
    dayLabel.className = "day";
    dayLabel.textContent = index === 0 ? "Today" : formatDay(day);

    const icon = document.createElement("div");
    icon.className = "icon";
    icon.textContent = meta.icon;

    const temps = document.createElement("div");
    temps.className = "temps";
    temps.innerHTML = `
      <span>${Math.round(daily.temperature_2m_max[index])}°</span>
      <span class="min">${Math.round(daily.temperature_2m_min[index])}°</span>
    `;

    card.appendChild(dayLabel);
    card.appendChild(icon);
    card.appendChild(temps);

    forecast.appendChild(card);
  });
}

async function fetchWeather(city) {
  try {
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geocodeRes = await fetch(geocodeUrl);
    const geocodeData = await geocodeRes.json();

    if (!geocodeData.results || geocodeData.results.length === 0) {
      throw new Error("City not found");
    }

    const place = geocodeData.results[0];
    const lat = place.latitude;
    const lon = place.longitude;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=7`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const current = weatherData.current;
    const daily = weatherData.daily;

    const meta = getWeatherMeta(current.weather_code);

    locationLabel.textContent = `${place.name}, ${place.country}`;
    currentTemp.textContent = `${Math.round(current.temperature_2m)}°C`;
    feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
    humidity.textContent = `${Math.round(current.relative_humidity_2m)}%`;
    wind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    pressure.textContent = `${Math.round(current.pressure_msl)} hPa`;
    condition.textContent = meta.label;
    weatherIcon.textContent = meta.icon;

    sunrise.textContent = formatTime(daily.sunrise[0]);
    sunset.textContent = formatTime(daily.sunset[0]);

    renderForecast(daily);
  } catch (error) {
    alert("Unable to load weather data. Please try another city.");
    console.error(error);
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  fetchWeather(city);
});

fetchWeather("London");
