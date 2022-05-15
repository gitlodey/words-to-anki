import http from "@/api/Http";
import type { LinguaRobotResponse } from "@/types/LinguaRobot";

const API_KEY = import.meta.env.VITE_APP_LINGUA_ROBOT_API_KEY as string;
const options: RequestInit = {
  method: "GET",
  headers: {
    "X-RapidAPI-Host": "lingua-robot.p.rapidapi.com",
    "X-RapidAPI-Key": API_KEY,
  },
};

class LinguaRobot {
  async getWord(word: string) {
    const response: LinguaRobotResponse = await http.get(
      `https://lingua-robot.p.rapidapi.com/language/v1/entries/en/${word}`,
      options
    );

    return response;
  }
}

export default new LinguaRobot();
