<template>
  <div>
    <ag-charts :options="props.options" />
  </div>
</template>

<script setup lang="ts">
import type {AgChartOptions} from 'ag-charts-community';

const props = defineProps<{
  options: AgChartOptions;
}>();
</script>

<style scoped>

</style>
