export interface WordWithShortDefinition {
    word: string,
    shortDefinition: string,
}

export interface Audio {
    "url": string
    "filename": string,
    "fields": [
        "Front"
    ]
}

class AnkiConnectApi {
    async invoke (action: string, version: number, params={}) {
        const response = await fetch('http://127.0.0.1:8765', {
            method: 'post',
            body: JSON.stringify({action, version, params}),
            headers: {'Content-Type': 'application/json'}
        });
        const json = await response.json();

        console.log(json);

        return json;
    }

    async addWord (word: WordWithShortDefinition, audioUrl?: string | undefined) {
        let audio: Audio | undefined;
        if (audioUrl) {
            audio = {
                url: audioUrl,
                filename: audioUrl.split('/').pop() || '',
                "fields": [
                    "Front"
                ],
            }
        }
        await this.invoke('addNote', 6, { note: {
                deckName: "English 2022",
                modelName: "Basic",
                fields: {
                    Front: word.word,
                    Back: word.shortDefinition,
                },
                options: {
                    allowDuplicate: true,
                },
                audio,
            }
        });
    }
}

export default new AnkiConnectApi();