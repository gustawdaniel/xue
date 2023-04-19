<script lang="ts" setup>
import { onMounted } from "#imports";

const app = useNuxtApp()

onMounted(async () => {
  console.log('mounted');

  const res = await app.$client.userList.query();

  console.log("res", res);

  // $client.trpc
  //   .query('userList', { })
  //   .then((res) => {
  //     console.log('res', res)
  //   })
  //   .catch((err) => {
  //     console.log('err', err)
  //   });
})


</script>

<template>
  <div>
    Page: foo
  </div>
</template>

<style scoped></style>
