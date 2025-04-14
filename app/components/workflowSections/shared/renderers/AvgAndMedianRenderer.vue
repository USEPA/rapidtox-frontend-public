<template>
  <span>{{ roundedVal }}</span>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import type {PhyschemSummary} from '~/api/Physchem/types';

const props = defineProps<{
  params: ICellRendererParams<PhyschemSummary>;
}>();

const roundedVal = computed(() => {
  if (!props.params.node.group) {
    const keyVal = props.params.value as keyof PhyschemSummary;
    const value = props.params.data?.[keyVal];

    if (value === 0) {
      return value;
    } else if (!value) {
      return '-';
    } else if (isNaN(Number(value))) {
      return value;
    } else {
      let parsedVal: number | string = parseFloat(value as string);
      if ((parsedVal >= 0.1 && parsedVal < 1000) || (parsedVal <= -0.1 && parsedVal > -1000) || parsedVal === 0) {
        parsedVal = parsedVal.toPrecision(3);
      } else {
        parsedVal = parsedVal.toExponential(2);
      }
      return parsedVal;
    }
  }
  return '';
});
</script>

<style scoped>

</style>
