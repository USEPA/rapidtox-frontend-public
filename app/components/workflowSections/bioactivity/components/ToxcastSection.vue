<template>
  <ErrorLoadingGridAlert v-if="props.hasError" />
  <BioactivityToxCastGrid
    v-else
    :row-data="props.rowData"
  />
</template>

<script setup lang="ts">
import ErrorLoadingGridAlert from '../../shared/alerts/ErrorLoadingGridAlert.vue';
import BioactivityToxCastGrid from '../grids/BioactivityToxCastGrid.vue';
import type {BioactivityToxcastRes} from '~/api/Bioactivity/types';

const props = defineProps<{
  rowData: BioactivityToxcastRes[];
  hasError: boolean;
}>();
</script>

<style scoped>

</style>
