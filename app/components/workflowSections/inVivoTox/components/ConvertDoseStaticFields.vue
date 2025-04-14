<template>
  <v-col
    v-for="input in staticInputs"
    :key="input.podKey"
    :cols="input.cols || 3"
    :offset="input.offset || 0"
  >
    <component
      :is="dynamicComponentMap[input.inputType as keyof DynamicComponentMap]"
      v-model="input.value"
      :aria-label="`${input.props?.label} Input`"
      v-bind="input.props"
    />
  </v-col>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import type {ConvertDoseInput} from '../types';
import {dynamicVuetifyComponentMap} from '../../shared/constants';
import type {DynamicComponentMap, PodData} from '~~/types';

const props = defineProps<{
  params: ICellRendererParams<PodData>;
}>();

const dynamicComponentMap = shallowRef<DynamicComponentMap>(dynamicVuetifyComponentMap);
const staticInputs = ref<ConvertDoseInput[]>([
  {
    podKey: 'toxvalType',
    inputType: 'v-text-field',
    value: props.params.data?.toxvalType,
    props: {
      readonly: true,
      label: 'Type',
    },
  },
  {
    podKey: 'exposureRoute',
    inputType: 'v-text-field',
    value: props.params.data?.exposureRoute,
    props: {
      readonly: true,
      label: 'Exposure Route',
    },
  },
  {
    podKey: 'effect',
    inputType: 'v-text-area',
    value: props.params.data?.effect,
    cols: 6,
    props: {
      readonly: true,
      label: 'Effect',
      rows: 1,
    },
  },
  {
    podKey: 'studyType',
    inputType: 'v-text-field',
    cols: 3,
    value: props.params.data?.studyType,
    props: {
      readonly: true,
      label: 'Study Type',
    },
  },
  {
    value: props.params.data?.speciesCommon,
    cols: 2,
    props: {
      readonly: true,
      label: 'Species',
    },
    inputType: 'v-text-field',
    podKey: 'speciesCommon',
  },
  {
    value: props.params.data?.superCategory,
    cols: 3,
    props: {
      readonly: true,
      label: 'Super Category',
    },
    inputType: 'v-text-field',
    podKey: 'superCategory',
  },
  {
    cols: 2,
    props: {
      readonly: true,
      label: 'Value',
    },
    inputType: 'v-text-field',
    podKey: 'toxvalNumeric',
    value: props.params.data?.toxvalNumeric?.toString() || '',
  },
  {
    value: props.params.data?.toxvalUnits,
    podKey: 'toxvalUnits',
    inputType: 'v-text-field',
    cols: 2,
    props: {
      readonly: true,
      label: 'Units',
    },
  },
]);
</script>

<style scoped>

</style>
