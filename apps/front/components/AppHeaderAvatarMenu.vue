<template>
  <Menu as="div" class="ml-4 flex items-center flex-shrink-0">
    <div>
      <MenuButton
        v-if="isLoggedIn"
        class="bg-white rounded-full flex text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100"
      >
        <span class="sr-only">Open user menu</span>
        <img :src="props.me?.avatar" alt="" class="h-8 w-8 rounded-full" />
      </MenuButton>
    </div>

    <!--    <pre>{{ me }}</pre>-->
    <!--    <pre>{{[...navigation, ...userNavigation]}}</pre>-->
    <!--    <pre>{{Boolean(isLoggedIn)}}</pre>-->
    <!--<pre>{{[...navigation, ...userNavigation].filter(n => n.private === Boolean(isLoggedIn))}}</pre>-->

    <!--    <transition-->
    <!--        leave-active-class="transition ease-in duration-75"-->
    <!--        leave-from-class="transform opacity-100 scale-100"-->
    <!--        leave-to-class="transform opacity-0 scale-95">-->

    <div class="ml-10 space-x-4">
      <MenuItem
        v-for="item in [...navigation, ...userNavigation].filter(
          (n) => n.private === Boolean(isLoggedIn)
        )"
        :key="item.name"
        v-slot="{ active }"
      >
        <NuxtLink
          :class="[active ? item.activeClass : '', item.class]"
          :to="item.href"
          class="inline-block rounded-md border border-transparent py-2 px-4 text-base font-medium"
          >{{ item.name }}
        </NuxtLink>
      </MenuItem>
      <!--      <a href="#" class="inline-block rounded-md border border-transparent  py-2 px-4 text-base font-medium   ">Sign in</a>-->
      <!--      <a href="#" class="inline-block rounded-md border border-transparent  py-2 px-4 text-base font-medium   block px-4 py-2 text-sm text-gray-700">Sign up</a>-->
    </div>
    <!--    </transition>-->
  </Menu>
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItem } from "@headlessui/vue";
import { computed } from "#imports";
import { navigation, userNavigation } from "~/helpers/navigation";
import { User } from "~/composables/user";

const props = defineProps<{ me: User | null }>();

const isLoggedIn = computed<boolean>((): boolean => {
  return Boolean(props.me) && Boolean(props.me?.email);
});

// const {user} = useUser()

// const data = ref<{me: Users}>()

// onMounted(async () => {
//   data.value = await GqlME()
// })
// const { data } = await useAsyncData('me', () => );
</script>

<style scoped></style>
