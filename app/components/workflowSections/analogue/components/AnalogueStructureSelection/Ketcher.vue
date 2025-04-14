<template>
  <div
    class="ketcher-container"
  >
    <iframe
      ref="ketcherRef"
      class="w-100 h-100"
      title="Ketcher"
      :src="ketcherSrc"
      frameborder="0"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentAnalogueStepsData: AnalogueStepInfo | undefined;
}>();
const {APPLICATION_ROUTER_BASE} = useRuntimeConfig().public;
const ketcherSrc = `${APPLICATION_ROUTER_BASE}ketcher/index.html`;

const ketcherRef = ref<HTMLIFrameElement | null>(null);

const analgoueStore = useAnalogueStore();
const {setKetcher} = analgoueStore;
const {ketcher: ketcherFromStore} = storeToRefs(analgoueStore);
const ketcherInterval = ref<null | ReturnType<typeof setInterval>>(null);

onMounted(() => {
  ketcherInterval.value = setInterval(() => {
    initiateKetcher();
  }, 1000);
  window.addEventListener('beforeunload', () => {
    removeKetcher();
  });
});

const removeKetcher = () => {
  setKetcher(null);
  clearInterval(ketcherInterval.value as unknown as number);
};

onUnmounted(() => {
  removeKetcher();
});

const initiateKetcher = () => {
  // @ts-ignore
  const {ketcher} = ketcherRef.value?.contentWindow || {};
  if (ketcher) {
    clearInterval(ketcherInterval.value as unknown as number);
    setKetcher(ketcher);
    if (props.currentAnalogueStepsData?.smileString) {
      // @ts-ignore
      ketcherFromStore.value.setMolecule(props.currentAnalogueStepsData?.smileString);
    }
  }
};
</script>

<style scoped>
.ketcher-container {
  height: 600px;
}
</style>
