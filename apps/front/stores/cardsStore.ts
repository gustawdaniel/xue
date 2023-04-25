import {defineStore} from 'pinia'
import {Card, SimpleTranslation} from "~/intefaces/SelectedWord";
import {Lang, TranslationProvider} from "database";
import {useCourseStore} from "~/stores/courseStore";
import {getSentence, t, useCardBuilder} from '#imports'

function getLangContext(): { toLang: Lang, fromLang: Lang } {
    const courseStore = useCourseStore();

    const toLang = courseStore.defaultCourse!.target_lang;
    const fromLang = courseStore.defaultCourse!.source_set.lang;

    return {toLang, fromLang};
}

export const useCardsStore = defineStore('cards-store', {
    state: (): { cards: Map<string, Card> } => {
        return {
            cards: new Map<string, Card>()
        }
    },
    actions: {
        translate(word: string, is_new: boolean) {
            const {toLang, fromLang} = getLangContext();
            const cardBuilder = useCardBuilder();

            cardBuilder.value.translate(word, fromLang, toLang, 'reverso', is_new).catch(console.error)
            cardBuilder.value.translate(word, fromLang, toLang, 'google', is_new).catch(console.error)
            cardBuilder.value.translate(word, fromLang, toLang, 'deepl', is_new).catch(console.error)
        },

        setTranslation(word: string, provider: TranslationProvider, translation: SimpleTranslation, is_new: boolean) {
            if (this.cards.has(word)) {
                this.cards.get(word)!.translations.set(provider, translation)
            } else {
                this.cards.set(word, {
                    is_new,
                    translations: new Map<TranslationProvider, SimpleTranslation>([[provider, translation]]),
                    sentences: new Map<Lang, string>(),
                    image: '',
                })
            }
        },

        setSingleSentence(word: string, is_new: boolean, lang: Lang, sentence: string) {
            if (this.cards.has(word)) {
                this.cards.get(word)!.sentences.set(lang, sentence)
            } else {
                this.cards.set(word, {
                    is_new,
                    translations: new Map<TranslationProvider, SimpleTranslation>(),
                    sentences: new Map<Lang, string>([[lang, sentence]]),
                    image: '',
                })
            }
        },

        getImage(word: string, sentence: string) {
            console.log("image", sentence);
            t.generateImage.query({prompt: sentence.trim()})
                .then((url) => {
                    if(this.cards.has(word)) {
                        this.cards.get(word)!.image = url
                    }
                })
                .catch(console.error)
        },

        async setAllSentences(word: string, is_new: boolean) {
            const {toLang, fromLang} = getLangContext();

            const originalSentence = await getSentence(fromLang, word);
            this.setSingleSentence(word, is_new, fromLang, originalSentence);

            if (fromLang === 'en') {
                this.getImage(word, originalSentence)
            }

            t.translate.query({
                provider: 'google', from_lang: fromLang, to_lang: toLang, from_text: originalSentence
            }).then(({to_text}) => {
                this.setSingleSentence(word, is_new, toLang, to_text);

                if (toLang === 'en') {
                    this.getImage(word, to_text)
                }
            }).catch(console.error)

            if (fromLang !== 'en' && toLang !== 'en') {

                t.translate.query({
                    provider: 'google', from_lang: fromLang, to_lang: 'en', from_text: originalSentence
                }).then(({to_text}) => {
                    this.setSingleSentence(word, is_new, 'en', to_text);
                    this.getImage(word, to_text)
                }).catch(console.error)

            }
        }
    },
    persist: false,
})
