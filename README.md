# Weather Dashboard

A simple weather dashboard that fetches real-time weather data from the public Open-Meteo API.

## Features

- Search for a city
- Display current temperature and condition
- Show feels-like temperature, humidity, wind, pressure
- Display sunrise and sunset
- Show a 7-day forecast
- Responsive layout for desktop and mobile

## Run locally

Open `index.html` in a browser, or serve the folder with a local web server:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## API used

- Open-Meteo Geocoding API for city lookup
- Open-Meteo Forecast API for weather data

No API key required.
