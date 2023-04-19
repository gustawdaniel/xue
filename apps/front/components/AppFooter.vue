<script setup lang="ts">
import { useNuxtApp, useRuntimeConfig, useState } from "#imports";

const version = useState<{ version?: string | undefined } | null>('version', () => null)

const app = useNuxtApp();

onMounted(() => {
  app.$client.version.query().then((res) => {
    version.value = res;
  });
})


const config = useRuntimeConfig()

</script>

<template>
  <footer class="shrink-0">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
      <div class="flex justify-between border-t border-gray-200 py-8 text-sm text-gray-500">
        <nuxt-link to="/company" class="text-center sm:text-left">
          <span class="block sm:inline">&copy; {{ new Date().getFullYear() }} Xue Academy. </span>
          <span class="block sm:inline">All rights reserved.</span>
        </nuxt-link>
        <div class="block sm:none">
          <pre>{{ version?.version }}</pre>
        </div>
      </div>
    </div>
  </footer>
</template>


