import {  SimpleTranslation } from "~/intefaces/SelectedWord";
import {Lang, TranslationProvider} from 'database';
import { t } from '~/composables/t';
import {useWordsStore} from "~/stores/wordsStore";
import {useCardsStore} from "~/stores/cardsStore";

export class CardBuilder {
    private readonly wordsStore;
    private readonly cardsStore;

    constructor() {
        this.wordsStore = useWordsStore();
        this.cardsStore = useCardsStore();
    }

    async translate(text: string, from_lang: Lang, to_lang: Lang, provider: TranslationProvider, is_new: boolean): Promise<SimpleTranslation> {
        if (this.cardsStore.cards.get(text)?.translations.has(provider)) {
            return this.cardsStore.cards.get(text)!.translations.get(provider)!;
        }

        const fullTranslation = await t.translate.query({
            provider,
            from_lang,
            to_lang,
            from_text: text
        });

        const translation = {
            to_text: fullTranslation.to_text,
            meanings: fullTranslation.meanings
        };

        this.cardsStore.setTranslation(text, provider, translation, is_new);

        return translation;
    }
}
