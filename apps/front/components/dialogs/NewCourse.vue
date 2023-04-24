<script lang="ts" setup>
import {DialogTitle} from '@headlessui/vue'
import {InformationCircleIcon} from '@heroicons/vue/24/outline'
import {handleError} from "#imports";
import {closeModal} from "~/composables/modal";
import {sets, Lang} from 'database'
import {useCourseStore} from "~/stores/courseStore";

const coursesStore = useCourseStore()

const fromSet = ref<sets | null>(null);
const toLang = ref<Lang | null>(null)

const mySets = ref<sets[]>([]);
const languages = ref<{ code: Lang, name: string }[]>([])

onMounted(async () => {
    t.availableSets.query().then((value) => mySets.value = value).catch(console.error)
    t.availableLanguages.query().then(value => languages.value = value).catch(console.error)
})

const url = ref<string>('');


async function newCourse() {
    try {
        const targetLang = toLang.value;
        if (!targetLang) return;

        const sourceSetId = fromSet.value ? fromSet.value.id : null;
        if (!sourceSetId) return;

        const course = await t.newCourse.mutate({
            target_lang: targetLang,
            source_set_id: sourceSetId
        });

        coursesStore.courses.push(course)
        coursesStore.defaultCourse = course;

        closeModal();
    } catch (e) {
        return handleError(e)
    }
}
</script>

<template>
    <div>
        <div class="sm:flex sm:items-start">
            <div
                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <InformationCircleIcon class="h-6 w-6 text-blue-600" aria-hidden="true"/>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">New Course</DialogTitle>
                <div class="mt-2">

                    <div class="mb-4">
                        <label for="from" class="block text-sm font-medium leading-6 text-gray-900">From
                            language</label>
                        <select id="from"
                                v-model="fromSet"
                                class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <option v-for="set in mySets" :value="set" :key="set.id">{{ set.name }}</option>
                        </select>
                    </div>

                    <div>
                        <label for="to" class="block text-sm font-medium leading-6 text-gray-900">To Language</label>
                        <select id="to"
                                v-model="toLang"
                                class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <option v-for="lang in languages.filter((el) => el.code !== fromSet?.lang)"
                                    :value="lang.code" :key="lang.code">{{ lang.name }}
                            </option>

                        </select>
                    </div>

                    <!--                    <div>-->
                    <!--                        <label for="company-website" class="block text-sm font-medium text-gray-700">Source Url</label>-->
                    <!--                        <div class="relative mt-1 rounded-md shadow-sm">-->
                    <!--                            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">-->
                    <!--                                <span class="text-gray-500 sm:text-sm">https://</span>-->
                    <!--                            </div>-->
                    <!--                            <input type="text" name="company-website" id="company-website"-->
                    <!--                                   class="block w-full rounded-md border-gray-300 pl-16 focus:border-indigo-500 focus:ring-indigo-500 sm:pl-14 sm:text-sm"-->
                    <!--                                   placeholder="www.example.com"-->
                    <!--                                   v-model="url"-->
                    <!--                            />-->
                    <!--                        </div>-->
                    <!--                    </div>-->

                </div>
            </div>
        </div>
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button type="button"
                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    @click="newCourse">Add
            </button>
            <button type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    @click="closeModal" ref="cancelButtonRef">Close
            </button>
        </div>
    </div>
</template>

<style scoped></style>
