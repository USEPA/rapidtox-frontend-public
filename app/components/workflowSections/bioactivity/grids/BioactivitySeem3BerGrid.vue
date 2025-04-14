<template>
  <ag-grid-vue
    class="ag-theme-balham"
    :style="defaultGridstyle()"
    :column-defs="columnDefs"
    :grid-options="gridOptions"
    :row-data="props.rowData"
    @selection-changed="onSelectionChange"
    @first-data-rendered="onFirstRendered"
  />
</template>

<script setup lang="ts">
import type {SelectionChangedEvent, FirstDataRenderedEvent} from 'ag-grid-community';
import {defaultGridstyle} from '../../shared/helpers';
import ChemicalNameRenderer from '../../shared/renderers/ChemicalNameRenderer.vue';
import BioactivityValueRenderer from '../renderers/BioactivityValueRenderer.vue';
import BerCalculatorRenderer from '../renderers/BerCalculatorRenderer.vue';
import type {BioactivityBerRes} from '~/api/Bioactivity/types';

const props = defineProps<{
  rowData: BioactivityBerRes[];
}>();

const columnDefs = computed(() => bioSeem3ColumnDefs);
const gridOptions = computed(() => bioSeem3GridOptions);

const bioactivityStore = useBioactivityStore();
const {selectedBerCalcData} = storeToRefs(bioactivityStore);
const {setBerCalcSelected, updateBerCalcSelected} = bioactivityStore;

const onSelectionChange = (params: SelectionChangedEvent<BioactivityBerRes>) => {
  const selections = params.api.getSelectedRows();
  setBerCalcSelected(selections);
  updateBerCalcSelected(selections);
};

const fillPreviousSelections = (params: FirstDataRenderedEvent<BioactivityBerRes>) => {
  params.api.forEachNodeAfterFilterAndSort((node) => {
    if (node.data?.dtxsid && selectedBerCalcData.value.some(({dtxsid}) => dtxsid === node.data?.dtxsid)) {
      node.setSelected(true, false);
    }
  });
};

const onFirstRendered = (params: FirstDataRenderedEvent<BioactivityBerRes>) => {
  fillPreviousSelections(params);
};

defineExpose({
  ChemicalNameRenderer,
  BerCalculatorRenderer,
  BioactivityValueRenderer,
});
</script>

<style scoped>

</style>
