import {AppRouter} from "trpc";
import type {inferRouterOutputs} from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;
import {t} from '#imports';
import {useWordsStore} from "~/stores/wordsStore";
import { SelectedWord} from "~/intefaces/SelectedWord";
import {useCardsStore} from "~/stores/cardsStore";

export class WordsSelector {
    private readonly store;
    private readonly cardsStore;

    constructor() {
        this.store = useWordsStore();
        this.cardsStore = useCardsStore();
    }

    translateWord(word: string, is_new: boolean) {
        this.cardsStore.translate(word, is_new)
    }

    setWord(word: RouterOutput['findRandomWord'], futureResponses: Array<0 | 1> = []) {
        const item = {
            word: word.word,
            iteration: word.iteration,
            new: word.new,
            futureResponses
        };

        for (const [index, existing] of this.store.words.entries()) {
            if (existing.iteration > word.iteration) {
                this.translateWord(item.word, item.new);
                this.store.words.splice(index, index - 1, item);
                return;
            } else if (existing.iteration === word.iteration && existing.futureResponses.join() === futureResponses.join()) {
                return;
            }
        }

        this.translateWord(item.word, item.new);
        this.store.words.push(item);
    }

    async getNext(courseId: string, futureAnswers: Array<0 | 1> = []): Promise<SelectedWord> {
        if (!courseId) {
            throw new Error(`User without selected course. Can't get word`)
        }

        if (this.store.words.length) {
            return {
                word: this.store.words[0].word,
                iteration: this.store.words[0].iteration,
                new: this.store.words[0].new
            }
        }

        const word = await t.findRandomWord.query({
            course_id: courseId,
            futureAnswers
        });

        this.setWord(word);

        return {
            word: word.word,
            iteration: word.iteration,
            new: word.new,
        }
    }

    async advancedLoad(courseId: string, level = 2, futureResponses: Array<0 | 1> = []): Promise<void> {
        console.log("advancedLoad", level, futureResponses);

        const existingWord = this.store.words.find(w => w.futureResponses.join() === futureResponses.join());

        console.log("existingWord", existingWord);

        if(!existingWord) {
            const word = await t.findRandomWord.query({
                course_id: courseId,
                futureAnswers: futureResponses
            });

            console.log("word", word, futureResponses);

            if(this.store.words.find(w => w.word === word.word && w.futureResponses.length < futureResponses.length)) {
                console.log("skip at existing word", word, futureResponses);
                return ;
            }

            this.setWord(word, futureResponses);
        }

        if(level <= 0) return ;

        await Promise.all([
            this.advancedLoad(courseId,level - 1, [...futureResponses, 0]),
            this.advancedLoad(courseId, level - 1, [...futureResponses, 1])
        ]);

        return ;
    }

    async moveBy(courseId: string, answers: Array<0 | 1>, level = 2) {
        console.log("moveBy", answers);
        this.store.words = this.store.words
            .filter(w => w.futureResponses.length >= answers.length && !w.futureResponses.join('').startsWith(answers.join('')))
            .map(w => ({
                ...w,
                futureResponses: w.futureResponses.filter((r,i) => i >= answers.length)
            }));

        console.log("this.store.words", this.store.words);

        await this.advancedLoad(courseId, level, [])
    }
}
