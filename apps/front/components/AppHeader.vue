<script lang="ts" setup>
import { Popover, PopoverButton, TransitionRoot } from '@headlessui/vue'
import { Bars3Icon, XCircleIcon } from '@heroicons/vue/24/outline'
import { ref, useAsyncData, useUser } from "#imports";
import AppHeaderMobileMenu from '~/components/AppHeaderMobileMenu.vue'

const user = useUser()
const open = ref<boolean>(false)
</script>

<template>
  <Popover v-slot="{ open }" as="header" class="pb-24 bg-indigo-600 shrink-0">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="relative py-5 flex items-center justify-center lg:justify-between">
        <!-- Logo -->
        <div class="absolute left-0 flex-shrink-0 lg:static">
          <NuxtLink to="/">
            <span class="sr-only">Workflow</span>
            <img
              alt="Workflow"
              class="h-8 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-300.svg"
            />
          </NuxtLink>
        </div>

        <!-- Right section on desktop -->
        <div class="hidden md:ml-4 lg:flex lg:items-center lg:pr-0.5">
          <div class="headway-app" />

          <!--          <button-->
          <!--              v-if="result && result.me.email"-->
          <!--              type="button"-->
          <!--              class="flex-shrink-0 p-1 text-indigo-200 rounded-full hover:text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white">-->
          <!--            <span class="sr-only">View notifications</span>-->
          <!--            <BellIcon class="h-6 w-6" aria-hidden="true"/>-->
          <!--          </button>-->

          <!--          <client-only>-->
          <!--          <AppHeaderTopLinks/>-->
          <!--          </client-only>-->

          <client-only>
            <!--            Profile dropdown-->
            <AppHeaderAvatarMenu :me="user" />
          </client-only>
        </div>

        <!-- Search -->
        <div class="flex-1 min-w-0 px-12 lg:hidden h-6">
          <!--            <div class="max-w-xs w-full mx-auto">-->
          <!--              <label for="desktop-search" class="sr-only">Search</label>-->
          <!--              <div class="relative text-white focus-within:text-gray-600">-->
          <!--                <div class="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">-->
          <!--                  <SearchIcon class="h-5 w-5" aria-hidden="true" />-->
          <!--                </div>-->
          <!--                <input id="desktop-search" class="block w-full bg-white bg-opacity-20 py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-gray-900 placeholder-white focus:outline-none focus:bg-opacity-100 focus:border-transparent focus:placeholder-gray-500 focus:ring-0 sm:text-sm" placeholder="Search" type="search" name="search" />-->
          <!--              </div>-->
          <!--            </div>-->
        </div>

        <!-- Menu button -->
        <div class="absolute right-0 flex-shrink-0 lg:hidden">
          <!-- Mobile menu button -->
          <PopoverButton
            class="bg-transparent p-2 rounded-md inline-flex items-center justify-center text-indigo-200 hover:text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" aria-hidden="true" class="block h-6 w-6" />
            <XCircleIcon v-else aria-hidden="true" class="block h-6 w-6" />
          </PopoverButton>
        </div>
      </div>
      <div class="hidden lg:block border-t border-white border-opacity-20 py-5">
        <!--          <div class="grid grid-cols-3 gap-8 items-center">-->
        <!--            <div class="col-span-2">-->
        <!--              <nav class="flex space-x-4">-->
        <!--                <a v-for="item in navigation" :key="item.name" :href="item.href" :class="[item.current ? 'text-white' : 'text-indigo-100', 'text-sm font-medium rounded-md bg-white bg-opacity-0 px-3 py-2 hover:bg-opacity-10']" :aria-current="item.current ? 'page' : undefined">-->
        <!--                  {{ item.name }}-->
        <!--                </a>-->
        <!--              </nav>-->
        <!--            </div>-->
        <!--            <div>-->
        <!--              <div class="max-w-md w-full mx-auto">-->
        <!--                <label for="mobile-search" class="sr-only">Search</label>-->
        <!--                <div class="relative text-white focus-within:text-gray-600">-->
        <!--                  <div class="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">-->
        <!--                    <SearchIcon class="h-5 w-5" aria-hidden="true" />-->
        <!--                  </div>-->
        <!--                  <input id="mobile-search" class="block w-full bg-white bg-opacity-20 py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-gray-900 placeholder-white focus:outline-none focus:bg-opacity-100 focus:border-transparent focus:placeholder-gray-500 focus:ring-0 sm:text-sm" placeholder="Search" type="search" name="search" />-->
        <!--                </div>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
      </div>
    </div>

    <TransitionRoot :show="open" as="template">
      <client-only>
        <AppHeaderMobileMenu :me="user" />
      </client-only>
    </TransitionRoot>
  </Popover>
</template>


