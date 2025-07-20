import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface WeatherData {
  current: "sunny" | "cloudy" | "rainy";
  lastUpdated: string;
}

export interface WeatherHistoryEntry {
  date: string;
  weather: "sunny" | "cloudy" | "rainy";
}

export interface WeatherHistory {
  history: WeatherHistoryEntry[];
}

class WeatherApiService {
  private baseURL = `${API_BASE_URL}/weather`;

  // Get current weather
  async getCurrentWeather(): Promise<WeatherData> {
    try {
      const response = await axios.get(`${this.baseURL}/current`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching current weather:", error);
      // Return default weather if API fails
      return {
        current: "sunny",
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  // Update weather
  async updateWeather(
    weather: "sunny" | "cloudy" | "rainy"
  ): Promise<WeatherData> {
    try {
      const response = await axios.post(`${this.baseURL}/update`, { weather });
      return response.data.data;
    } catch (error) {
      console.error("Error updating weather:", error);
      throw new Error("Failed to update weather");
    }
  }

  // Get weather history
  async getWeatherHistory(): Promise<WeatherHistory> {
    try {
      const response = await axios.get(`${this.baseURL}/history`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching weather history:", error);
      return { history: [] };
    }
  }
}

export const weatherApi = new WeatherApiService();
