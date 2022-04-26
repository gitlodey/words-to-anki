import type { LinguaRobotResponse } from "@/services/linguaRobot/lingua-robot-types";

const API_KEY = import.meta.env.VITE_APP_LINGUA_ROBOT_API_KEY as string
const options: RequestInit = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Host': 'lingua-robot.p.rapidapi.com',
        'X-RapidAPI-Key': API_KEY,
    }
}

class LinguaRobotApi {

    async getWord (word: string) {
        const response: LinguaRobotResponse = await fetch(
            `https://lingua-robot.p.rapidapi.com/language/v1/entries/en/${word}`,
            options,
        )
            .then(response => response.json())
            .catch(err => console.error(err));

        return response
    }

}

export default new LinguaRobotApi()