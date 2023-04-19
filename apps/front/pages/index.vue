<script lang="ts" setup>
import { onMounted } from "#imports";

const { $client } = useNuxtApp()

onMounted(async () => {
  console.log('mounted');

  const res = await $client.userList.query();

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
