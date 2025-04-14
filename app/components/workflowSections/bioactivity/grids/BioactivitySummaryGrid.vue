<template>
  <ag-grid-vue
    class="ag-theme-balham"
    :row-data="props.rowData"
    :column-defs="columnDefs"
    :style="defaultGridstyle()"
    :grid-options="gridOptions"
    @selection-changed="onSelectionChange"
    @first-data-rendered="onFirstRendered"
  />
</template>

<script setup lang="ts">
import type {FirstDataRenderedEvent, SelectionChangedEvent} from 'ag-grid-community';
import ChemicalNameRenderer from '../../shared/renderers/ChemicalNameRenderer.vue';
import {defaultGridstyle} from '../../shared/helpers';
import SummaryPlotRenderer from '../renderers/SummaryPlotRenderer.vue';
import type {BioactivityBaseRes} from '~/api/Bioactivity/types';

const columnDefs = computed(() => bioSummaryColumnDefs);
const gridOptions = computed(() => bioSummaryGridOptions);

const props = defineProps<{
  rowData: BioactivityBaseRes[];
}>();

const bioactivityStore = useBioactivityStore();
const {selectedBioactivitySummaryChemicals} = storeToRefs(bioactivityStore);

const onSelectionChange = (params: SelectionChangedEvent<BioactivityBaseRes>) => {
  const selectedRows: BioactivityBaseRes[] = params.api.getSelectedRows();
  selectedBioactivitySummaryChemicals.value = selectedRows.map(({dtxsid}) => dtxsid);
};

const fillPreviousSelections = (params: FirstDataRenderedEvent<BioactivityBaseRes>) => {
  params.api.forEachNodeAfterFilterAndSort((node) => {
    if (node.data?.dtxsid && selectedBioactivitySummaryChemicals.value.includes(node.data.dtxsid)) {
      node.setSelected(true);
    }
  });
};

const onFirstRendered = (params: FirstDataRenderedEvent<BioactivityBaseRes>) => {
  fillPreviousSelections(params);
};

defineExpose({
  ChemicalNameRenderer,
  SummaryPlotRenderer,
});
</script>

<style scoped>

</style>
