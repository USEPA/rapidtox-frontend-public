<template>
  <ErrorLoadingGridAlert v-if="props.hasError" />
  <BioactivitySeem3BerGrid
    v-else
    :row-data="props.rowData"
  />
</template>

<script setup lang="ts">
import ErrorLoadingGridAlert from '../../shared/alerts/ErrorLoadingGridAlert.vue';
import BioactivitySeem3BerGrid from '../grids/BioactivitySeem3BerGrid.vue';
import type {BioactivityBerRes} from '~/api/Bioactivity/types';

const props = defineProps<{
  rowData: BioactivityBerRes[];
  hasError: boolean;
}>();
</script>

<style scoped>

</style>
