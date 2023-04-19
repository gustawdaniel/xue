<script lang="ts" setup>
import { PopoverButton, PopoverOverlay, PopoverPanel, TransitionChild } from '@headlessui/vue'
import { XCircleIcon } from '@heroicons/vue/24/outline'
import { useRuntimeConfig } from '#imports'
import { navigation, userNavigation } from '~/helpers/navigation'
import { User } from "~/composables/user";

const config = useRuntimeConfig()

const props = defineProps<{
  me: User | null
}>()

function click(event: MouseEvent) {
  console.log('click', event)
}
</script>

<style scoped></style>


<template>
  <div class="lg:hidden">
    <TransitionChild
      as="template"
      enter="duration-150 ease-out"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="duration-150 ease-in"
      leave-from="opacity-100"
      leave-to="opacity-0"
    >
      <PopoverOverlay class="z-20 fixed inset-0 bg-black bg-opacity-25" />
    </TransitionChild>

    <TransitionChild
      as="template"
      enter="duration-150 ease-out"
      enter-from="opacity-0 scale-95"
      enter-to="opacity-100 scale-100"
      leave="duration-150 ease-in"
      leave-from="opacity-100 scale-100"
      leave-to="opacity-0 scale-95"
    >
      <PopoverPanel
        class="z-30 absolute top-0 inset-x-0 max-w-3xl mx-auto w-full p-2 transition transform origin-top"
        focus
      >
        <div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y divide-gray-200">
          <div class="pt-3 pb-2">
            <div class="flex items-center justify-between px-4">
              <NuxtLink to="/">
                <div>
                  <img
                    alt="Workflow"
                    class="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                  />
                </div>
              </NuxtLink>
              <div class="-mr-2">
                <PopoverButton
                  class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <span class="sr-only">Close menu</span>
                  <XCircleIcon aria-hidden="true" class="h-6 w-6" />
                </PopoverButton>
              </div>
            </div>
            <div class="mt-3 px-2 space-y-1">
              <NuxtLink
                v-for="nav in [...navigation, ...userNavigation].filter(
                  (n) => n.private === Boolean(props.me && props.me?.email)
                )"
                :key="nav.name"
                :to="nav.href"
                class="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800"
                @click="click"
              >
                {{ nav.name }}
              </NuxtLink>
            </div>
          </div>
          <div v-if="props.me && props.me.email" class="pt-4 pb-2">
            <div class="flex items-center px-5">
              <div class="flex-shrink-0">
                <img :src="props.me?.avatar" alt="" class="h-10 w-10 rounded-full" />
              </div>
              <div class="ml-3 min-w-0 flex-1">
                <div class="text-base font-medium text-gray-800 truncate">{{ props.me.name }}</div>
                <div class="text-sm font-medium text-gray-500 truncate">{{ props.me.email }}</div>
              </div>
              <!--                  <button type="button"-->
              <!--                          class="ml-auto flex-shrink-0 bg-white p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">-->
              <!--                    <span class="sr-only">View notifications</span>-->
              <!--                    <BellIcon class="h-6 w-6" aria-hidden="true"/>-->
              <!--                  </button>-->
            </div>
            <!--                  <div class="mt-3 px-2 space-y-1">-->
            <!--                    <a v-for="item in userNavigation" :key="item.name" :href="item.href" class="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">{{ item.name }}</a>-->
            <!--                  </div>-->
          </div>
        </div>
      </PopoverPanel>
    </TransitionChild>
  </div>
</template>
