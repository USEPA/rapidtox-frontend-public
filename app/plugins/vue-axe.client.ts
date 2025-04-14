import vueAxe from 'vue-axe';

export default defineNuxtPlugin((nuxtApp) => {
  const {IS_AXE_ENABLED: isAxeEnabled} = useRuntimeConfig().public;
  if (isAxeEnabled) {
    nuxtApp.vueApp.use(vueAxe);
  }
});
