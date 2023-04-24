<script lang="ts" setup>
import {courses as coursesType, sets} from "database";
import {useCourseStore} from "~/stores/courseStore";
import {storeToRefs} from "pinia";

const courseStore = useCourseStore();
const {defaultCourse, courses} = storeToRefs(courseStore)

onMounted(async () => {
    const courses = await t.findCourses.query();
    courseStore.$patch({courses: courses})
});

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
import NewCourse from "~/components/dialogs/NewCourse.vue";
import {selectDefaultCourse} from "../../../packages/trpc/src/routes/selectDefaultCourse";

function getStatus(course: coursesType): 'Active' |  'Inactive' {
    return (defaultCourse.value && defaultCourse.value.id === course.id) ? 'Active' : 'Inactive';
}

async function selectCourse(course: coursesType & {source_set: sets}) {
    await t.selectDefaultCourse.mutate({
        id: course.id
    });
    defaultCourse.value = course;
}

// const keys = Lang;
//
// console.log("keys", keys);

function openNewCourseModal() {
    const modal = useModal();
    modal.value.context = {}
    modal.value.settings = {width: 'max-w-sm'} //2xl'}
    modal.value.component = NewCourse;
}

const statuses = {
    Active: 'text-green-700 bg-green-50 ring-green-600/20',
    Inactive: 'text-gray-600 bg-gray-50 ring-gray-500/10',
}
// https://tailwindui.com/components/application-ui/lists/stacked-lists
</script>

<template>
  <div class="mx-10 my-6">

      <ul role="list" class="divide-y divide-gray-100">
          <li v-for="course in courses" :key="course.id" class="flex items-center justify-between gap-x-6 py-5">
              <div class="min-w-0">
                  <div class="flex items-start gap-x-3">
                      <p class="text-sm font-semibold leading-6 text-gray-900">{{ course.source_set.lang }} -> {{ course.target_lang}}</p>
                      <p :class="[statuses[getStatus(course)], 'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset']">{{ getStatus(course) }}</p>
                  </div>
<!--                  <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">-->
<!--                      <p class="whitespace-nowrap">-->
<!--                          Due on <time :datetime="project.dueDateTime">{{ project.dueDate }}</time>-->
<!--                      </p>-->
<!--                      <svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">-->
<!--                          <circle cx="1" cy="1" r="1" />-->
<!--                      </svg>-->
<!--                      <p class="truncate">Created by {{ project.createdBy }}</p>-->
<!--                  </div>-->
              </div>
              <div class="flex flex-none items-center gap-x-4">
                  <a v-if="getStatus(course) === 'Inactive'"
                     @click="selectCourse(course)"
                     class="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block cursor-pointer">
                      Select
                  </a>
<!--                  <Menu as="div" class="relative flex-none">-->
<!--                      <MenuButton class="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">-->
<!--                          <span class="sr-only">Open options</span>-->
<!--                          <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />-->
<!--                      </MenuButton>-->
<!--                      <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">-->
<!--                          <MenuItems class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">-->
<!--                              <MenuItem v-slot="{ active }">-->
<!--                                  <a href="#" :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']"-->
<!--                                  >Edit<span class="sr-only">, {{ project.name }}</span></a-->
<!--                                  >-->
<!--                              </MenuItem>-->
<!--                              <MenuItem v-slot="{ active }">-->
<!--                                  <a href="#" :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']"-->
<!--                                  >Move<span class="sr-only">, {{ project.name }}</span></a-->
<!--                                  >-->
<!--                              </MenuItem>-->
<!--                              <MenuItem v-slot="{ active }">-->
<!--                                  <a href="#" :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']"-->
<!--                                  >Delete<span class="sr-only">, {{ project.name }}</span></a-->
<!--                                  >-->
<!--                              </MenuItem>-->
<!--                          </MenuItems>-->
<!--                      </transition>-->
<!--                  </Menu>-->
              </div>
          </li>
      </ul>

      <button
          @click="openNewCourseModal"
          type="button" class="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          New course
      </button>
  </div>
</template>

<style scoped></style>
