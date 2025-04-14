<template>
  <ag-grid-vue
    class="ag-theme-balham"
    :grid-options="gridOptions"
    :column-defs="columnDefs"
    :style="defaultGridstyle()"
    :row-data="props.rowData"
    @first-data-rendered="onFirstRendered"
  />
</template>

<script setup lang="ts">
import type {FirstDataRenderedEvent} from 'ag-grid-community';
import {defaultGridstyle} from '../../shared/helpers';
import ChemicalNameRenderer from '../../shared/renderers/ChemicalNameRenderer.vue';

const props = defineProps<{
  rowData: BerCalcRow[];
}>();

const columnDefs = computed(() => podBioactivityColumnsDefs);
const gridOptions = computed(() => podBioactivityGridOptions);

const onFirstRendered = (params: FirstDataRenderedEvent<BerCalcRow>) => {
  params.api.expandAll();
};

defineExpose({
  ChemicalNameRenderer,
});
</script>

<style scoped>

</style>
