import axios from "axios";

export interface WeatherData {
    weather: { main: string; description: string }[];
    main: { temp: number };
}

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
    const { data } = await axios.get(BASE_URL, {
        params: {
            q: city,
            appid: API_KEY,
            units: "metric",
            lang: "tr",
        },
    });
    return data;
};
