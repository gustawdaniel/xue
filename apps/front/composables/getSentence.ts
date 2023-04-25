import {Lang, langNames} from "database";
import {t} from "~/composables/t";

export async function getSentence(lang: Lang, word: string): Promise<string> {
    const answer = await t.sentence.query({
        messages: [{
            role: 'user',
            content: `write sentence in ${langNames.get(lang)} that contains word "${word}" and is great prompt for image generation for stable diffusion, write only sentence, no explanation`
        }]
    });

    if(answer.finish_reason === 'stop') {
        return answer.message.content;
    } else {
        throw new Error(`Answer is ${answer.message.content}, but finished with reason: ${answer.finish_reason}`)
    }
}
