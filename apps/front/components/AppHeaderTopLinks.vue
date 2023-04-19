<template>
  <nav v-if="!user || !user.email" class="flex space-x-4">
    <NuxtLink
      v-for="item in userNavigation.filter((n) => n.private === Boolean(user && user?.email))"
      :key="item.name"
      :href="item.href"
      :class="[
        isCurrent(item.name) ? 'text-white' : 'text-indigo-100',
        'text-sm font-medium rounded-md bg-white bg-opacity-0 px-3 py-2 hover:bg-opacity-10',
      ]"
      :aria-current="isCurrent(item.name) ? 'page' : undefined"
    >
      {{ item.name }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverOverlay,
  PopoverPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { useAsyncData, useRuntimeConfig, useUser } from "#imports";
import { navigation, userNavigation } from '~/helpers/navigation'
const config = useRuntimeConfig()

const user = useUser();

function isCurrent(name: string): boolean {
  //TODO: fix
  return false
}
</script>

<style scoped></style>
