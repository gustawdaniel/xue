import {defineStore} from 'pinia'
import {QueuedWord} from "~/intefaces/SelectedWord";

export const useWordsStore = defineStore('words-store', {
    state: (): {words: QueuedWord[]} => {
        return {
            words: [],
        }
    },
    actions: {

    },
    getters: {
        activeWord(store) {
            return store.words.find(() => true) ?? null
        }
    },
    persist: false,
})
