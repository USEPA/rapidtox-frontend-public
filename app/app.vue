<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - CCTE RapidTox` : 'CCTE RapidTox';
  },
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    {
      charset: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      'http-equiv': 'cache-control',
      content: 'no-cache',
    },
    {
      'http-equiv': 'expires',
      content: '0',
    },
    {
      'http-equiv': 'pragma',
      content: 'no-cache',
    },
  ],
  bodyAttrs: {
    class: 'test',
  },
});
</script>

<template>
  <v-app>
    <NuxtPage ref="pageContent" />
  </v-app>
</template>
