import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { weatherApi, WeatherData } from "../services/weatherApi";

interface WeatherContextType {
  weather: "sunny" | "cloudy" | "rainy";
  isLoading: boolean;
  error: string | null;
  updateWeather: (newWeather: "sunny" | "cloudy" | "rainy") => Promise<void>;
  refreshWeather: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({
  children,
}) => {
  const [weather, setWeather] = useState<"sunny" | "cloudy" | "rainy">("sunny");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const weatherData = await weatherApi.getCurrentWeather();
      setWeather(weatherData.current);
    } catch (err) {
      setError("Failed to fetch weather data");
      console.error("Weather fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateWeather = async (newWeather: "sunny" | "cloudy" | "rainy") => {
    try {
      setError(null);
      const weatherData = await weatherApi.updateWeather(newWeather);
      setWeather(weatherData.current);
    } catch (err) {
      setError("Failed to update weather");
      console.error("Weather update error:", err);
      throw err;
    }
  };

  const refreshWeather = async () => {
    await fetchWeather();
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const value: WeatherContextType = {
    weather,
    isLoading,
    error,
    updateWeather,
    refreshWeather,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};
