<script lang="ts" setup>
useHead({
  htmlAttrs: { class: "h-full bg-white" },
  bodyAttrs: { class: "h-full" }
});

</script>

<template>
  <div>
    <Auth :is-login="false"/>
  </div>
</template>

<style scoped></style>
