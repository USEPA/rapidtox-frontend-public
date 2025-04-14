<template>
  <div v-auto-animate>
    <EpaHeader v-if="showEpaHeader" />
    <VueAxePopup v-if="showAxePopup" />
    <slot />
    <EpaFooter v-if="showEpaHeader" />
  </div>
</template>

<script setup lang="ts">
import {VueAxePopup} from 'vue-axe';

useHead({
  htmlAttrs: {
    lang: 'en-US',
  },
  link: [MATERIAL_DESIGN_ICONS_CDN_LINK],
});
const {APPLICATION_ENVIRONMENT_LABEL} = useRuntimeConfig().public;
const showAxePopup = ref(false);

onMounted(() => {
  if (APPLICATION_ENVIRONMENT_LABEL.toLowerCase().trim().includes('local')) {
    showAxePopup.value = true;
  }
});
const {showEpaHeader} = storeToRefs(useUiControls());
</script>

<style>
.vs__dropdown-menu {
    z-index: 1500 !important;
}
.slide-header-footer-enter-active {
   -moz-transition-duration: 0.3s;
   -webkit-transition-duration: 0.3s;
   -o-transition-duration: 0.3s;
   transition-duration: 0.3s;
   -moz-transition-timing-function: ease-in;
   -webkit-transition-timing-function: ease-in;
   -o-transition-timing-function: ease-in;
   transition-timing-function: ease-in;
}

.slide-header-footer-leave-active {
   -moz-transition-duration: 0.3s;
   -webkit-transition-duration: 0.3s;
   -o-transition-duration: 0.3s;
   transition-duration: 0.3s;
   -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-header-footer-enter-to, .slide-header-footer-leave {
   max-height: 100px;
   overflow: hidden;
}

.slide-header-footer-enter, .slide-header-footer-leave-to {
   overflow: hidden;
   max-height: 0;
}
body {
  overflow-y: hidden !important;
}
</style>
