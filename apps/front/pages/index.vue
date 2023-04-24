<script lang="ts" setup>
import { onMounted } from "#imports";

import { t } from "#imports";
definePageMeta({
  layout: "app",
  // layout: false,
});

onMounted(async () => {
  console.log("mounted");

  const res = await t.userList.query();

  console.log("res", res);
});
</script>

<template>
    <div>
        <ClientOnly>
            <Notifications />
        </ClientOnly>

        <Question />
    </div>
</template>

<style scoped></style>
