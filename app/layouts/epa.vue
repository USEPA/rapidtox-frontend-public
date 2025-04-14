<template>
  <div v-auto-animate>
    <EpaHeader v-if="showEpaHeaderFooter" />
    <NavBar v-if="!loginPath" />
    <slot />
    <VueAxePopup v-if="showAxePopup" />
    <EpaFooter v-if="showEpaHeaderFooter" />
  </div>
</template>

<script setup lang="ts">
import {VueAxePopup} from 'vue-axe';
import NavBar from '~/components/layout/navbar/NavBar.vue';

const baseStore = useAppBaseStore();
const {showEpaHeaderFooter} = storeToRefs(baseStore);

useHead({
  htmlAttrs: {
    lang: 'en-US',
  },
  link: [MATERIAL_DESIGN_ICONS_CDN_LINK],
});
const route = useRoute();
let loginPath = false;
if (route.fullPath === '/login') {
  loginPath = true;
}

const {APPLICATION_ENVIRONMENT_LABEL} = useRuntimeConfig().public;
const showAxePopup = ref(false);

onMounted(() => {
  if (APPLICATION_ENVIRONMENT_LABEL.toLowerCase().trim().includes('local')) {
    showAxePopup.value = true;
  }
});
</script>
