
<script lang="ts" setup>
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { computed, definePageMeta, useAsyncData, useNuxtApp, useRuntimeConfig, useToken } from "#imports";
type users = { id: string; email: string; name: string; avatar: string; password: string | null; created_at: string; last_login_at: string | null; default_course_id: string | null; roles: "admin"[]; };

dayjs.extend(relativeTime)

definePageMeta({
  layout: 'app',
})

const config = useRuntimeConfig()

const token = useToken()

console.log('token', token.value)

const me = ref<users | null>(null);

const app = useNuxtApp();

onMounted(async () => {
  me.value = await app.$client.me.query()
})

const stats = computed(() => {
  if (me.value) {
    return [
      {
        label: 'Account registered',
        value: me.value.created_at,
        displayValue: dayjs(me.value.created_at).fromNow(true),
        fallback: 'No registered',
      },
      {
        label: 'Last login',
        value: me.value.last_login_at,
        displayValue: dayjs(me.value.last_login_at).fromNow(true),
        fallback: 'No logged in yet',
      },
    ]
  }
  return []
})
</script>

<style scoped></style>


<template>
  <div v-if="me" class="rounded-lg bg-white overflow-hidden shadow">
    <h2 id="profile-overview-title" class="sr-only">Profile Overview</h2>
    <div class="bg-white p-6">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="sm:flex sm:space-x-5 sm:items-center">
          <div class="flex-shrink-0">
            <img :src="me.avatar" alt="" class="mx-auto h-20 w-20 rounded-full border" />
          </div>
          <div class="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
            <!--              <p class="text-sm font-medium text-gray-600">Welcome back,</p>-->
            <p class="text-xl font-bold text-gray-900 sm:text-2xl">{{ me.name }}</p>
            <p class="text-sm font-medium text-gray-600">{{ me?.email }}</p>
          </div>
        </div>
        <!--          <div class="mt-5 flex justify-center sm:mt-0">-->
        <!--            <a href="#" class="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"> View profile </a>-->
        <!--          </div>-->
      </div>
    </div>
    <div
      class="border-t border-gray-200 bg-gray-50 grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x"
    >
      <div v-for="stat in stats" :key="stat.label" class="px-6 py-5 text-sm font-medium text-center">
        <div v-if="stat.value">
          <span class="text-gray-600">{{ stat.label }}</span>
          {{ ' ' }}
          <span class="text-gray-900">{{ stat.displayValue }}</span>
          {{ ' ' }}
          <span class="text-gray-600">ago</span>
        </div>
        <div v-else>
          <span class="text-gray-600">{{ stat.fallback }}</span>
        </div>
      </div>
    </div>

<!--    <AnswersChart />-->
  </div>
</template>
