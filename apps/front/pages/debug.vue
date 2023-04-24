<script lang="ts" setup>
import { t } from "#imports";
import {useWordsStore} from "~/stores/wordsStore";
import {storeToRefs} from "pinia";
import {useCardsStore} from "~/stores/cardsStore";

async function g() {
  const rest = await t.translate.query({
    to_lang: "pl",
    from_lang: "en",
    from_text: "water",
    provider: "google",
  });

  console.log(rest);
}

async function d() {
    const rest = await t.translate.query({
        to_lang: "pl",
        from_lang: "en",
        from_text: "water",
        provider: "deepl",
    });

    console.log(rest);
}

async function r() {
    const rest = await t.translate.query({
        to_lang: "pl",
        from_lang: "en",
        from_text: "water",
        provider: "reverso",
    });

    console.log(rest);
}

const wordsStore = useWordsStore();
const {words} = storeToRefs(wordsStore);
const cardsStore = useCardsStore();

const {cards} = storeToRefs(cardsStore);
</script>

<template>
  <div>
    <button class="btn" @click="g">G</button>
    <button class="btn" @click="d">D</button>
    <button class="btn" @click="r">R</button>

      <pre>{{ words }}</pre>
      <hr>
      <pre>{{ cards }}</pre>
  </div>
</template>

<style scoped>
.btn {
  @apply bg-gray-100 p-2 border hover:bg-gray-200;
}
</style>
