<script lang="ts" setup>
import { t } from "~/composables/t";
import {useWordsStore} from "~/stores/wordsStore";
import {storeToRefs} from "pinia";
import {useCardsStore} from "~/stores/cardsStore";
import {Lang} from 'database'
import {langNames} from 'trpc';

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



async function gpt() {
    const g = await t.sentence.query({
        messages: [{
            role: 'user',
            content: 'write sentence in spanish that contains word "sorbe" and is great prompt for image generation for stable diffusion, write only sentence, no explanation'
        }]
    });

    console.log("content", g.message.content);

    console.log(g);
}

async function img() {
    const o = await t.generateImage.query({
        // prompt: "red cat, 4k photo"
        prompt: "This brilliant star lights up the entire night sky."
    });
    console.log(o);
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
    <button class="btn" @click="gpt">GPT</button>
    <button class="btn" @click="img">I</button>

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
