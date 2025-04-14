<!--
 Wrapper component for Toast-Like snackbars. Used for any snackbar that will be position at the
 top right of the screen. Attaches logic that will properly display the snack bar stacked in the
 correct position if other snackbars are visible. Must pass two props and one emitter:

 props: The open flag variable(boolean) and a
 unqique(per toast) content class string that will be used to detemine positioning.

 emitter: updateOpen - function that will update the open flag variable.
-->

<template>
  <v-snackbar
    v-bind="$attrs"
    :style="{ marginTop }"
    :content-class="props.contentClass"
    absolute
    transition="slide-x-reverse-transition"
  >
    <template
      v-for="(_, slot) in ($slots as {})"
      #[slot]
    >
      <slot :name="slot" />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  contentClass: string;
}>();

const emits = defineEmits<{
  updateOpen: [isOpen: boolean];
}>();

onBeforeUnmount(() => {
  emits('updateOpen', false);
});

const baseStore = useAppBaseStore();
const {
  getMargin, removeFromQueue, addToQueue,
} = baseStore;

const marginTop = computed({
  get() {
    if (props.contentClass === 'epa-header-footer-snackbar-content-class') {
      return '50px';
    }
    return getMargin(props.contentClass);
  },
  set(newVal) {
    marginTop.value = newVal;
  },
});

watchEffect(() => {
  if (props.isOpen) {
    addToQueue(props.contentClass);
  }
  if (!props.isOpen) {
    nextTick(() => {
      removeFromQueue(props.contentClass);
    });
  }
});
</script>

<style scoped>

</style>
