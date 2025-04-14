<template>
  <section class="mt-4">
    <ag-grid-vue
      class="ag-theme-balham"
      :grid-options="gridOptions"
      :column-defs="columnDefs"
      :row-data="rowData"
      data-cy="ChemicalSearchResultsGrid"
      :style="defaultGridstyle()"
      @grid-ready="onGridReady"
      @selection-changed="onSelectionChange"
      @first-data-rendered="onFirstDataRendered"
    />
  </section>
</template>

<script setup lang="ts">
import type {
  FirstDataRenderedEvent,
  GridApi, GridReadyEvent, SelectionChangedEvent,
} from 'ag-grid-community';
import {defaultGridstyle} from '../shared/helpers';
import UnmatchedCountStatusPanel from '~/components/workflowSections/chemicalSearch/statusPanels/UnmatchedCountStatusPanel.vue';
import IdentifiersAndResultsStatusPanel from '~/components/workflowSections/chemicalSearch/statusPanels/IdentifiersAndResultsStatusPanel.vue';
import DataCheckMark from '~/components/workflowSections/chemicalSearch/renderers/DataCheckMark.vue';
import LinkRenderer from '~/components/workflowSections/chemicalSearch/renderers/LinkRenderer.vue';
import ChemicalImagePopover from '~/components/workflowSections/shared/renderers/ChemicalImagePopover.vue';

const props = defineProps<{
  rowData: SelectedChemical[];
}>();

const chemicalSearchStore = useChemicalSearchStore();
const {
  selectedUnmatchedChemicals, selectedChemicals,
} = storeToRefs(chemicalSearchStore);
const {setupAnalogueChemicalsStepInfo} = useAnalogueStore();

// Grid Config
const columnDefs = chemSearchColumnDefs;
const gridOptions = computed(() => chemSearchGridOptions);

const gridApi = shallowRef<GridApi<SelectedChemical> | null>(null);

const {$patch: chemSearchPatch} = chemicalSearchStore;
const onSelectionChange = (params: SelectionChangedEvent<SelectedChemical>) => {
  const selectedRows: SelectedChemical[] = params.api.getSelectedRows();
  chemSearchPatch((chemSearchState) => {
    chemSearchState.selectedChemicals = selectedRows;
  });
  setupAnalogueChemicalsStepInfo();
};

const onGridReady = (event: GridReadyEvent<SelectedChemical>) => {
  gridApi.value = event.api;
  gridApi.value.sizeColumnsToFit();
  if (props.rowData.some(row => row.isMarkush)) {
    gridApi.value.setColumnsVisible(['markush'], true);
  } else {
    gridApi.value.setColumnsVisible(['markush'], false);
  }
};

const fillPreviousSelections = (api: GridApi<SelectedChemical>) => {
  api.forEachNodeAfterFilterAndSort((node) => {
    if (selectedChemicals.value
      .some(chemical => chemical.dtxsid === node.data?.dtxsid && chemical.searchWord === node.data?.searchWord)) {
      node.setSelected(true);
    }

    if (selectedUnmatchedChemicals.value.some(chemical => chemical.searchWord === node.data?.searchWord)) {
      node.setSelected(true);
    }
  });
};

const onFirstDataRendered = (event: FirstDataRenderedEvent<SelectedChemical>) => {
  fillPreviousSelections(event.api);
};

// Used for custom components - https://www.ag-grid.com/vue-data-grid/vue3-script-setup/
defineExpose({
  UnmatchedCountStatusPanel,
  IdentifiersAndResultsStatusPanel,
  DataCheckMark,
  LinkRenderer,
  ChemicalImagePopover,
});
</script>

<style scoped>

</style>
