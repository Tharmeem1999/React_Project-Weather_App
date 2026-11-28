import { useState, useEffect } from "react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import Forecast from "./components/Forecast";

const App = () => {
  // State to store raw weather data from API
  const [data, setData] = useState(null);

  // State to store the currently selected city
  const [selectedCity, setSelectedCity] = useState(null);

  // State to store transform current weather data
  const [weatherData, setWeatherData] = useState(null);

  // State to store tranformed 6-day forecast data
  const [forecastData, setForecastData] = useState([]);

  // State to store transformed hourly forcast data
  const [hourlyData, setHourlyData] = useState([]);

  // Handle selection of a city from the search bar
  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  // Fetch weather data when a city is selected
  useEffect(() => {
    if (!selectedCity) return;

    // Async function to call the weather API
    const fetchWeatherData = async () => {
      // extract latitude and longitude from selected city
      const { latitude, longitude } = selectedCity;

      try {
        // call the Open-Meteo API with appropiate parameters

        // Define the base APi endpoint
        const baseUrl = "https://api.open-meteo.com/v1/forecast";

        // define the query parameters
        const params = new URLSearchParams({
          latitude: latitude,
          longitude: longitude,
          current_weather: "true",
          daily: "temperature_2m_max,temperature_2m_min,weather_code",
          hourly:
            "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
          timezone: "auto",
        });

        // construct the full URL with parameters
        const url = `${baseUrl}?${params.toString()}`;

        // fetch the data from the API
        const response = await fetch(url);

        // parse the JSON response
        const weatherJson = await response.json();

        // store the full weather data along with th selected location
        setData({ ...weatherJson, location: selectedCity });

        // log the respose for debugging
        console.log(weatherJson);

      } catch (error) {
        // log any errors in fetching data
        console.error("Error fetching weather data: ", error);
      }

    }

    // call the function
    fetchWeatherData();
  }, [selectedCity]);

  // transform and store weather data once it's fetched
  useEffect(() => {
    if (!data || !data.location) return;

    const { location, current_weather, daily, hourly } = data;

    // transform and set current weather data
    const currentWeather = {
      city: location.name,
      country: location.country,
      temperature: current_weather.temperature,
      feelsLike: current_weather.apparent_temperature || current_weather.temperature,
      humidity: hourly.relative_humidity_2m[0],
      windSpeed: current_weather.windspeed,
      weatherCode: current_weather.weathercode,
      minTemp: daily.temperature_2m_min[0],
      maxTemp: daily.temperature_2m_max[0],
    };
    setWeatherData(currentWeather);

    // transform and set 6-day forecast data (exclusive today)
    const forecast = daily.time.slice(1, 7).map((date, index) => ({
      day: new Date(date).toLocalDateString(undefined, { weekday: "long" }),
      minTemp: daily.temperature_2m_min[index + 1],
      maxTemp: daily.temperature_2m_max[index + 1],
      weatherCode: daily.weather_code[index + 1],
    }));
    setForecastData(forecast);

    // Transform and set next 24-hour forecast data
    const hourlyForecast = hourly.time.slice(0, 24).map((time, index) => ({
      time: new Date(time).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temp: hourly.temperature_2m[index],
      humidity: hourly.relative_humidity_2m[index],
      wind: hourly.wind_speed_10m[index],
      weatherCode: hourly.weather_code[index],
    }));
    setHourlyData(hourlyForecast);

  }, [data]);

  return (
    // Page container with gradient bckground
    <div className="min-h-screen bg-linear-to-br from-blue-400 via-blue-500" >
      {/* Inner coontainer for spacing */}
      <div className="container mx-auto px-4 py-8">
        {/* App header section */}
        <Header />

        {/* Search bar for selecting cities */}
        <SearchBar onCitySelect={handleCitySelect} />

        {/* Show current weather if available */}
        {weatherData && <CurrentWeather weather={weatherData} />}

        {/* Show hourly forecast if available */}
        {hourlyData.length > 0 && <HourlyForecast hourlyData={hourlyData} />}

        {/* Show 6-day forcast if available */}
        {forecastData.length > 0 && <Forecast forecastData={forecastData} />}

      </div>
    </div>
  );
};

export default App;
