<template>
  <Suspense>
    <InVivoToxDialog
      :show-analogue-icon="showAnalogueIcon"
      :show-hazard-icon="showHazardIcon"
      :data="data"
      :is-valid-data="isValidData"
    />
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import {POD_SECTIONS} from '../constants';
import InVivoToxDialog from '../dialogs/InVivoToxDialog.vue';

const props = defineProps<{
  params: ICellRendererParams<PodUncertaintyData>;
}>();

const isValidData = computed(() => !!props.params.value && !!Object.keys(props.params.value)?.length);

const data = computed(() => [
  {
    label: 'Type',
    value: props.params.value?.type || '',
  },
  {
    label: 'Source',
    value: props.params.value?.source || '',
  },
  {
    label: 'Critical Effect',
    value: props.params.value?.criticalEffect || '',
  },
  {
    label: 'Exposure Route',
    value: props.params.value?.exposureRoute || '',
  },
  {
    label: 'Species',
    value: props.params.value?.species || '',
  },
]);

const showHazardIcon = computed(() => props.params.node.level > 1 &&
  props.params.data?.section === POD_SECTIONS.IN_VIVO_TOX &&
  isValidData.value);

const showAnalogueIcon = computed(() => props.params.node.level > 1 &&
  props.params.data?.section !== POD_SECTIONS.IN_VIVO_TOX &&
  isValidData.value);
</script>

<style scoped>

</style>
