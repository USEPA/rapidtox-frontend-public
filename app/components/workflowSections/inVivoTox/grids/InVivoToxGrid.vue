<template>
  <ag-grid-vue
    :column-defs="columnDefs"
    :row-data="rowData"
    class="ag-theme-balham"
    :grid-options="gridOptions"
    :style="defaultGridstyle()"
    @selection-changed="onSelectionChanged"
    @row-group-opened="onRowGroupOpened"
    @grid-ready="onGridReady"
    @cell-clicked="onCellClicked"
    @first-data-rendered="onFirstDataRendered"
  />
</template>

<script setup lang="ts">
import type {
  CellClickedEvent, FirstDataRenderedEvent, GridApi, GridReadyEvent, IRowNode, RowGroupOpenedEvent, SelectionChangedEvent,
} from 'ag-grid-community';
import {defaultGridstyle, getDefaultGroupExpansion} from '../../shared/helpers';
import BasicFocusableDialogRenderer from '../../shared/renderers/BasicFocusableDialogRenderer.vue';
import CustomDataRenderer from '../renderers/CustomDataRenderer.vue';
import ChemDataPlotRenderer from '../renderers/ChemDataPlotRenderer.vue';
import ConvertDoseRenderer from '../renderers/ConvertDoseRenderer.vue';
import RemoveConvertedDoseRenderer from '../renderers/RemoveConvertedDoseRenderer.vue';
import BasicFocusableTooltipRenderer from '~/components/workflowSections/shared/renderers/BasicFocusableTooltipRenderer.vue';
import ChemicalNameRenderer from '~/components/workflowSections/shared/renderers/ChemicalNameRenderer.vue';
import type {DtxsidMap, PodData} from '~~/types';
import ChemsWorkedOnStatusPanel from '~/components/workflowSections/shared/statusPanels/ChemsWorkedOnStatusPanel.vue';
import ChemsReviewedStatusPanel from '~/components/workflowSections/shared/statusPanels/ChemsReviewedStatusPanel.vue';
import TextFloatingFilterComponent from '~/components/workflowSections/inVivoTox/components/TextFloatingFilterComponent.vue';

const props = defineProps<{
  rowData: PodData[];
  dataSelected: DtxsidMap | Record<string, never>;
  hazardChartData: PodData[];
}>();

const emits = defineEmits<{
  updateDataSelected: [dataSelectedMap: DtxsidMap];
  setChemReviewedCount: [count: number];
}>();

const columnDefs = computed(() => inVivoToxColumnDefs);

const gridApi = shallowRef<GridApi<PodData> | null>(null);

const onGridReady = (event: GridReadyEvent<PodData>) => {
  gridApi.value = event.api;
  gridApi.value.sizeColumnsToFit();
  gridApi.value?.applyTransaction(getChartDataRows());
};

const gridOptions = computed(() => {
  inVivoToxGridOptions.groupDefaultExpanded = getDefaultGroupExpansion('hazard');
  return inVivoToxGridOptions;
});

// Combine Row Data and Chart Data in Grid
const gridData = computed(() => {
  return props.rowData
    .concat(props.hazardChartData)
    .sort((a, b) => a.superCategory.localeCompare(b.superCategory));
});

// Get updated rows in store data and synch up grid data
const getChartDataRows = (chartData?: PodData[]) => {
  const allRows: IRowNode<PodData>[] = [];
  gridApi.value?.forEachNodeAfterFilter((rowNode) => {
    allRows.push(rowNode);
  });
  const rowDataIds = allRows.filter(val => !!val.data?.id).map(val => val.data?.id);

  const newChartData = chartData || gridData.value;

  const rowsToAdd = newChartData.filter(({id}) => !rowDataIds.includes(id));
  const rowsToRemove = allRows.filter(val => !!val.data?.id)
    .filter(({data}) => data?.id &&
      !newChartData.map(({id}) => id)
        .includes(data?.id))
    .map(row => row.data || null)
    .filter(row => !!row);
  return {
    add: rowsToAdd,
    remove: rowsToRemove,
  };
};

watch(gridData, (newVal) => {
  if (gridApi.value) {
    gridApi.value.applyTransaction(getChartDataRows(newVal));
    const currentColumnState = gridApi.value.getColumnState();
    gridApi.value.applyColumnState({
      state: currentColumnState,
    });
  }
});

const onSelectionChanged = (params: SelectionChangedEvent<PodData>) => {
  const selections: PodData[] = params.api.getSelectedRows();
  const dataSelectedMap = selections.reduce((acc, cv) => {
    const {dtxsid, id} = cv;
    acc[dtxsid] = acc[dtxsid] && Array.isArray(acc[dtxsid]) ? [...acc[dtxsid], id] : [id];
    return acc;
  }, {} as DtxsidMap);
  emits('updateDataSelected', dataSelectedMap);
};

const chemicalsReviewed = ref<string[]>([]);
const onRowGroupOpened = (params: RowGroupOpenedEvent<PodData>) => {
  if (params.node.expanded && params.node.level === 0) {
    if (!chemicalsReviewed.value.includes(params.node.key as string)) {
      chemicalsReviewed.value.push(params.node.key as string);
    }
    emits('setChemReviewedCount', chemicalsReviewed.value.length);
  }
};

const onCellClicked = (params: CellClickedEvent<PodData>) => {
  // Avoid row selection when clicking on details column
  if (params.column.getColId() === 'detailsCol' && !params.node.group) {
    params.node.setSelected(!params.node.isSelected());
  }
};

const fillPreviousSelections = (api: GridApi<PodData>) => {
  if (Object.keys(props.dataSelected).length) {
    const selectedData = props.dataSelected as DtxsidMap;
    api.forEachNodeAfterFilterAndSort((node) => {
      if (node.level === 2 && node.data?.dtxsid &&
        node.data?.dtxsid in selectedData &&
        selectedData[node.data?.dtxsid]?.includes(node.data.id)) {
        node.setSelected(true);
      }
    });
  }
};

const onFirstDataRendered = (event: FirstDataRenderedEvent<PodData>) => {
  fillPreviousSelections(event.api);
};

defineExpose({
  BasicFocusableTooltipRenderer,
  ChemsWorkedOnStatusPanel,
  ChemsReviewedStatusPanel,
  ChemicalNameRenderer,
  BasicFocusableDialogRenderer,
  CustomDataRenderer,
  ChemDataPlotRenderer,
  ConvertDoseRenderer,
  RemoveConvertedDoseRenderer,
  TextFloatingFilterComponent,
});
</script>

<style scoped>
:deep(.ag-input-field-input) {
  color: black !important;
}
</style>
