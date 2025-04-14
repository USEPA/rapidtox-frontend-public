<template>
  <ag-grid-vue
    class="ag-theme-balham"
    :column-defs="columnDefs"
    :grid-options="gridOptions"
    :row-data="gridData"
    :style="defaultGridstyle()"
    :enable-cell-text-selection="true"
    resize="true"
    :suppress-row-click-selection="false"
    @grid-ready="onGridReady"
    @on-grid-size-changed="gridSizeChanged"
  />
</template>

<script setup lang="ts">
import type {
  GridApi, GridReadyEvent, GridSizeChangedEvent,
} from 'ag-grid-community';
import type {DisplayType} from '../types';
import {defaultGridstyle} from '../../shared/helpers';
import ChemicalNameRenderer from '../../shared/renderers/ChemicalNameRenderer.vue';
import AnalogueSelectionRenderer from '../renderers/AnalogueSelectionRenderer.vue';
import SelectionCheck from '../../shared/renderers/SelectionCheck.vue';
import ChemicalImagePopover from '../../shared/renderers/ChemicalImagePopover.vue';

const props = defineProps<{
  rowData: SelectedChemical[];
  displayType: DisplayType;
}>();

const {selectedMatchedChemicals, selectedUnmatchedChemicals} = storeToRefs(useChemicalSearchStore());

const columnDefs = computed(() => analogueChemSelColumnDefs);
const gridOptions = computed(() => analogueChemSelGridOptions);

const gridSizeChanged = (params: GridSizeChangedEvent<SelectedChemical>) => {
  params.api.sizeColumnsToFit();
};

const gridData = computed(() => props.displayType === 'matched' ? selectedMatchedChemicals.value : selectedUnmatchedChemicals.value);
const gridApi = shallowRef<GridApi<SelectedChemical> | null>(null);
const onGridReady = (params: GridReadyEvent<SelectedChemical>) => {
  gridApi.value = params.api;
  gridApi.value.sizeColumnsToFit();
};

const unmatchedColumnsToHide = [
  'preferredName',
  'dtxsid',
  'imagePopupCol',
  'casrn',
  'hazard',
  'physchem',
  'envFate',
];

// Hide unnecessary columns when changing to unmatched
watch(() => props.displayType, (newVal, oldVal) => {
  if (gridApi.value && newVal !== oldVal) {
    const shouldHideColumns = newVal === 'matched';
    gridApi.value?.setColumnsVisible(unmatchedColumnsToHide, shouldHideColumns);
    gridApi.value?.sizeColumnsToFit();
  }
});

const refocusCellOnDialogClose = (rowIdx: number, colId: string) => {
  nextTick(() => gridApi.value?.setFocusedCell(rowIdx, colId));
};

defineExpose({
  ChemicalNameRenderer,
  AnalogueSelectionRenderer,
  SelectionCheck,
  ChemicalImagePopover,
  gridApi,
  refocusCellOnDialogClose,
});
</script>

<style scoped>

</style>
