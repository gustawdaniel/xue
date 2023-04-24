import {TranslationProvider, Meaning} from 'database'

export interface SimpleTranslation {to_text: string, meanings: Meaning[]}

export interface Card {
    is_new: boolean,
    translations: Map<TranslationProvider, SimpleTranslation>
}

export type SelectedWord = { iteration: number, word: string, new: boolean };
export type QueuedWord = { futureResponses: Array<0 | 1> } & SelectedWord;
