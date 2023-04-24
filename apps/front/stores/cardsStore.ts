import {defineStore} from 'pinia'
import {Card, SimpleTranslation} from "~/intefaces/SelectedWord";
import {TranslationProvider} from "database";
import {useCourseStore} from "~/stores/courseStore";
import {useCardBuilder} from "#imports";

export const useCardsStore = defineStore('cards-store', {
    state: (): { cards: Map<string, Card> } => {
        return {
            cards: new Map<string, Card>()
        }
    },
    actions: {
        translate(word: string, is_new: boolean) {
            const courseStore = useCourseStore();
            const cardBuilder = useCardBuilder();

            const to_lang = courseStore.defaultCourse!.target_lang;
            const from_lang = courseStore.defaultCourse!.source_set.lang;

            cardBuilder.value.translate(word, from_lang, to_lang, 'reverso', is_new).catch(console.error)
            cardBuilder.value.translate(word, from_lang, to_lang, 'google', is_new).catch(console.error)
            cardBuilder.value.translate(word, from_lang, to_lang, 'deepl', is_new).catch(console.error)
        },

        setTranslation(word: string, provider: TranslationProvider, translation: SimpleTranslation, is_new: boolean) {
            if (this.cards.has(word)) {
                this.cards.get(word)!.translations.set(provider, translation)
            } else {
                this.cards.set(word, {
                    is_new,
                    translations: new Map<TranslationProvider, SimpleTranslation>([[provider, translation]])
                })
            }
        }
    },
    persist: false,
})
