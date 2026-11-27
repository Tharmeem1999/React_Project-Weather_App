import { useState } from "react";

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
