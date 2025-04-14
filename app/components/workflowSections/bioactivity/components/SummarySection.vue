<template>
  <ErrorLoadingGridAlert v-if="props.hasError" />
  <BioactivitySummaryGrid
    v-else
    :row-data="props.rowData"
  />
</template>

<script setup lang="ts">
import ErrorLoadingGridAlert from '../../shared/alerts/ErrorLoadingGridAlert.vue';
import BioactivitySummaryGrid from '../grids/BioactivitySummaryGrid.vue';
import type {BioactivityBaseRes} from '~/api/Bioactivity/types';

const props = defineProps<{
  rowData: BioactivityBaseRes[];
  hasError: boolean;
}>();
</script>

<style scoped>

</style>
