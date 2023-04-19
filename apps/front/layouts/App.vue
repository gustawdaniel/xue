<script lang="ts" setup>
import { computed, useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()

const showDebug = computed(() => {
  return ['development', 'test'].includes(config.public.NUXT_ENV)
})
</script>

<template>
  <div class="flex flex-col justify-between min-h-screen bg-gray-50">
    <AppHeader />
    <main class="-mt-24 pb-8 shrink grow h-full">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 h-full">
        <!--        <slot/>-->

        <ClientOnly>
          <slot />
        </ClientOnly>
      </div>
    </main>
<!--    <FooterLogs v-if="showDebug" />-->
<!--    <AppFooter v-else />-->
    <AppFooter/>
  </div>
</template>

<style scoped></style>
