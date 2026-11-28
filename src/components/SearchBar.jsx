import { useState } from "react";

const SearchBar = ({ onCitySelect }) => {
    // State to hold the user's input query
    const [query, setQuery] = useState("");

    // state to hold city suggestions from the API
    const [suggestions, setSuggestions] = useState([]);

    // Function to handle changes in the input field
    const handleInputChange = async (e) => {
        const value = e.target.value;

        // Update the input value in state
        setQuery(value);

        // Only fetch suggestions if query is at least 3 characters
        if (value.length >= 3) {
            try {
                // Fetch city suggestions from Open-Meteo's geocoding API

                // Base URL of the API
                const baseUrl = "https://geocoding-api.open-meteo.com/v1/search";

                // Encode the user's input to make it safe for the URL
                const encodedCityName = encodeURIComponent(value);

                // Build the full query URL with parameters
                const url = `${baseUrl}?name=${encodedCityName}&count=5`;

                // Make the API request
                const response = await fetch(url);

                // Parse the response JSON
                const data = await response.json();

                // If there are results, update suggestions state
                if (data.results) {
                    setSuggestions(data.results);
                } else {
                    setSuggestions([]);
                }

            } catch (error) {
                // Handle errors and clear suggestions
                console.error("Error fetching city suggestions: ", error);
                setSuggestions([]);
            }
        } else {
            // clear suggestions if input is too short
            setSuggestions([]);
        }
    }

    // Function to handle a click on a city suggestion
    const handleSuggestionClick = (city) => {
        // set the input value to the selected city's name
        setQuery(city.name);

        // clear the suggestion list
        setSuggestions([]);

        // call the parent component's handler with the selected city
        onCitySelect(city);
    };

    return (
        // Wrapper div for styling and layout 
        <div className="relative max-w-md mx-auto mb-8">
            {/* Input field for city search */}
            <input
                className="bg-white/20 w-full pl-4 pr-4 py-3 rounded-xl backdrop-blur-md text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for a city..."
            />

            {/* Render suggestions dropdown if available */}
            {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl border border-white/30 shadow-lg z-50 overflow-hidden">
                    {suggestions.map((city, index) => (
                        // Render each suggestion as a clickble list item
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(city)}
                            className="px-4 py-3 text-left text-gray-700 hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 hover:cursor-pointer"
                        >
                            {city.name}, {city.country}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;