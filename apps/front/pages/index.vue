<script lang="ts" setup>
import {onMounted, useDefaultCourse} from "#imports";

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

const defaultCourse = useDefaultCourse();

</script>

<template>
    <div>
        <ClientOnly>
            <Notifications />
        </ClientOnly>

        <Question v-if="defaultCourse" />
    </div>
</template>

<style scoped></style>
