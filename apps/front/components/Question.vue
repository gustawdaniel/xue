<script lang="ts" setup>
import dayjs from 'dayjs'
import {
    computed,
    notify,
    onMounted,
    ref,
    useDefaultCourse,
    useWordsSelector
} from '#imports'
import {speak} from '~/helpers/voice'
import {SelectedWord} from "~/intefaces/SelectedWord";
import {useWordsStore} from "~/stores/wordsStore";
import {useCardsStore} from "~/stores/cardsStore";
import {storeToRefs} from "pinia";
import {useCourseStore} from "~/stores/courseStore";
import {Lang} from 'database';
import WordHighlighter from "vue-word-highlighter";

const wordsSelector = useWordsSelector();
const defaultCourse = useDefaultCourse();
const cardsStore = useCardsStore();

const {cards} = storeToRefs(cardsStore);

async function getNexWord(futureAnswers: Array<0 | 1> = []): Promise<SelectedWord> {
    if (!defaultCourse) throw new Error(`No default course`);

    try {
        const word = await wordsSelector.value.getNext(defaultCourse.id, futureAnswers);

        console.log("word", word);
        // activeWord.value = word;
        return word;
    } catch (e) {
        console.log('getNexWord', e)
        throw e
    }
}

const wordsStore = useWordsStore();

const correctTranslations = computed<string[]>(() => {
    if (!wordsStore.activeWord!.word) return [];
    console.log("cards.value", cards.value);
    return cards.value.get(wordsStore.activeWord!.word)?.translations ? [...new Set([...cards.value.get(wordsStore.activeWord!.word)!.translations.values()]
        .map(tr => tr.meanings.map((m: {to_text: string}) => m.to_text)).flat().filter((tr) => tr.length))] : []
})

const input = ref<HTMLInputElement | null>(null)

const answer = ref<string>('')
const hint = ref<string>('')
const showSentence = ref<boolean>(false)
const showImage = ref<boolean>(false)
const showSentenceTranslation = ref<boolean>(false)
const displayed_at = ref<Date>(dayjs().toDate())

function clearStateForNewWord(): void {
    hint.value = ''
    answer.value = ''
    displayed_at.value = dayjs().toDate();
    showSentence.value = true;
    showImage.value = true;
    showSentenceTranslation.value = true;
}

function getCompliment(): string {
    const compliments = ['Great answer!', 'Wow. You are awesome!']
    return compliments[Math.floor(Math.random() * compliments.length)]
}

function getAnswerSummaryText(): string {
    return [`<b>${wordsStore.activeWord?.word}</b>`, 'means', `<b>${answer.value}</b>`].join(' ')
}

function onAfterLeave() {
    if (process.client) {
        document.querySelector('input')?.focus()
    }
}

const ADVANCE_LEVEL = 2;

function onEnter(el: HTMLElement) {
    if (process.client) {
        el.querySelector('input')?.focus()
    }
    if (wordsStore.activeWord) {
        try {
            speak(wordsStore.activeWord.word, 'uk').catch(() => {
                // silent fail
            })
        } catch {
            // silent fail
        }
    }
}

const courseStore = useCourseStore();

const fromLang = computed<Lang>(() => {
    return courseStore.defaultCourse!.source_set.lang;
});

const toLang = computed<Lang>(() => {
    return courseStore.defaultCourse!.target_lang
});

onMounted(() => {
    if (process.client) {
        document.querySelector('input')?.focus()

        getNexWord()

        console.log("defaultCourse", defaultCourse);
        if (defaultCourse) {
            wordsSelector.value.advancedLoad(defaultCourse.id, ADVANCE_LEVEL).catch(console.error)
        }
    }


})

async function check() {
    console.log(1);

    if (hint.value === '') {
        if (!wordsStore.activeWord) {
            return;
        }

        const serverAnswer = await t.createAnswer.mutate({
            word: wordsStore.activeWord.word,
            answer_text: answer.value,
            displayed_at: displayed_at.value
        })

        console.log('serverAnswer', serverAnswer)

        // if (!serverAnswer.is_correct) {
        //     if (serverAnswer.lastRepetition) {
        //         const { interval } = createOneAnswers.lastRepetition.super_memo
        //         if (interval <= LAYER_LIMIT && activeWord.value) {
        //             wordsTree.value.insertLayer(interval, activeWord.value)
        //         }
        //     }
        // }
    }

    if (correctTranslations.value.find((trans: string) => trans === answer.value)) {
        notify({
            title: getCompliment(),
            text: getAnswerSummaryText(),
        })

        const firstWasCorrect: boolean = hint.value === '';

        clearStateForNewWord();

        if (defaultCourse) {
            return wordsSelector.value.moveBy(defaultCourse.id, [firstWasCorrect ? 1 : 0], ADVANCE_LEVEL)
        }
    } else {
        hint.value = `Correct translations: ${correctTranslations.value.join(', ')}.`
        if (correctTranslations.value.length && defaultCourse) {
            const word = correctTranslations.value[0]
            console.log('speak')
            try {
                speak(word, defaultCourse.target_lang).catch(console.error)
            } catch {
                // silent fial
            }
        }
    }
}

const translatedWordRegex = computed<RegExp>(() => {
    return new RegExp(correctTranslations.value.join("|"), 'gi');
});

</script>

<template>
    <div class="bg-gray-100 h-1/2-screen overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6 flex items-center h-full justify-center">
            <!--      <ClientOnly>-->
            <div v-if="wordsStore.activeWord" class="">
                <Transition :on-after-leave="onAfterLeave" :on-enter="onEnter" mode="out-in" name="slide-up"
                            tag="button">
                    <div v-if="wordsStore.activeWord" :key="wordsStore.activeWord.word"
                         class="bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h3 class="text-lg leading-6 font-medium text-gray-900 text-center"
                                data-cy="word-to-translate">
                                {{ wordsStore.activeWord.word }}
                            </h3>
                            <div class="mt-2 text-sm text-gray-500">
                                <!--                <p class="blur-sm">Change the email address you want associated with your account.</p>-->
                                <p class="bg-violet-500 h-1 w-full"></p>
                            </div>
                            <form class="mt-5 sm:flex sm:items-center" @submit.prevent.stop="check">
                                <div class="w-full">
                                    <input
                                            id="answer"
                                            ref="input"
                                            v-model="answer"
                                            autofocus
                                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            data-cy="input-for-answer"
                                            name="answer"
                                            placeholder="Translation..."
                                            type="text"
                                    />
                                </div>
                                <button
                                        class="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        data-cy="button-confirming-answer"
                                        type="submit"
                                >
                                    Check
                                </button>
                            </form>
                            <p v-if="hint" class="mt-2 text-sm text-red-600 dark:text-red-500">
                                {{ hint }}
                            </p>


                            <div class="grid grid-cols-3 gap-2 mt-2">
                                <button
                                    class="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md bg-white
                                    text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    @click="showSentence = true">
                                    Sentence
                                </button>

                                <button
                                    class="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md bg-white
                                    text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    @click="showImage = true">
                                    Image
                                </button>

                                <button
                                    class="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md bg-white
                                    text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    @click="showSentenceTranslation = true">
                                    Translation
                                </button>
                            </div>

                            <p v-if="showSentence" class="m-2">
                              <WordHighlighter :query="wordsStore.activeWord.word">
                                {{cardsStore.cards.get(wordsStore.activeWord.word).sentences.get(fromLang)}}
                              </WordHighlighter>
                            </p>

                            <p v-if="showSentenceTranslation" class="m-2">
                              <WordHighlighter :query="translatedWordRegex">
                                {{cardsStore.cards.get(wordsStore.activeWord.word).sentences.get(toLang)}}
                              </WordHighlighter>
                            </p>

                            <div>
                              <img v-if="cardsStore.cards.get(wordsStore.activeWord.word).image && showImage"
                               :src="cardsStore.cards.get(wordsStore.activeWord.word).image"
                               :alt="cardsStore.cards.get(wordsStore.activeWord.word).sentences.get(toLang)"
                               class="m-auto">
                            </div>

                            <pre>{{ correctTranslations }}</pre>
                        </div>
                    </div>
                </Transition>
            </div>
            <!--      </ClientOnly>-->
        </div>
    </div>
</template>

<style>
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.5s ease-out;
}

.slide-up-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-up-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>
