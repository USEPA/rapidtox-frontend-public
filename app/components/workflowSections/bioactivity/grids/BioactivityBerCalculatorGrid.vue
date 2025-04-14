<template>
  <ag-grid-vue
    class="ag-theme-balham"
    :style="defaultGridstyle({ height: '400px', width: '100%' })"
    :column-defs="columnDefs"
    :grid-options="gridOptions"
    :row-data="props.rowData"
    :get-row-id="getRowId"
    @grid-ready="onGridReady"
  />
</template>

<script setup lang="ts">
import type {
  GetRowIdParams, GridApi, GridReadyEvent,
} from 'ag-grid-community';
import {defaultGridstyle} from '../../shared/helpers';
import Seem3BerCalcPodNameRenderer from '../renderers/Seem3BerCalcPodNameRenderer.vue';
import Seem3BerCalcAddRowRenderer from '../renderers/Seem3BerCalcAddRowRenderer.vue';
import Seem3BerCalcExposureValRenderer from '../renderers/Seem3BerCalcExposureValRenderer.vue';
import Seem3BerCalcBerRenderer from '../renderers/Seem3BerCalcBerRenderer.vue';

const props = defineProps<{
  rowData: BerCalcRow[];
}>();

const columnDefs = computed(() => bioSeem3BERCalcColumnDefs);
// eslint-disable-next-line no-unused-vars
const {statusBar, ...baseOptions} = baseGridOptions;
const gridOptions = computed(() => ({
  ...baseOptions,
  defaultColDef: {
    ...baseOptions.defaultColDef,
    tooltipValueGetter: () => null,
  },
}));

const gridApi = shallowRef<GridApi<BerCalcRow> | null>(null);

const onGridReady = (params: GridReadyEvent<BerCalcRow>) => {
  gridApi.value = params.api;
};

const getRowId = (params: GetRowIdParams<BerCalcRow>) => params.data.uniqueId;

defineExpose({
  Seem3BerCalcPodNameRenderer,
  Seem3BerCalcAddRowRenderer,
  Seem3BerCalcExposureValRenderer,
  Seem3BerCalcBerRenderer,
  gridApi,
});
</script>

<style scoped>
:deep(.seem3-ber-pod-nam-col) > div {
  height: 100%;
}
</style>
