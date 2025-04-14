<template>
  <ag-grid-vue
    :column-defs="columnDefs"
    :row-data="props.rowData"
    class="ag-theme-balham"
    :grid-options="props.gridOptions"
    :style="defaultGridstyle()"
    @selection-changed="onSelectionChanged"
    @row-group-opened="onRowGroupOpened"
    @cell-clicked="onCellClicked"
    @first-data-rendered="onFirstDataRendered"
  />
</template>

<script setup lang="ts">
import type {
  CellClickedEvent, FirstDataRenderedEvent, GridApi, GridOptions, RowGroupOpenedEvent, SelectionChangedEvent,
} from 'ag-grid-community';
import DetailsRenderer from '../renderers/DetailsRenderer.vue';
import PropertyRenderer from '../renderers/PropertyRenderer.vue';
import AvgAndMedianRenderer from '../renderers/AvgAndMedianRenderer.vue';
import RangeRenderer from '../renderers/RangeRenderer.vue';
import ChemicalNameRenderer from '../renderers/ChemicalNameRenderer.vue';
import {defaultGridstyle} from '../helpers';
import type {PhyschemSummary} from '~/api/Physchem/types';
import ChemsWorkedOnStatusPanel from '~/components/workflowSections/shared/statusPanels/ChemsWorkedOnStatusPanel.vue';
import ChemsReviewedStatusPanel from '~/components/workflowSections/shared/statusPanels/ChemsReviewedStatusPanel.vue';
import type {DtxsidMap} from '~~/types';

const props = defineProps<{
  rowData: PhyschemSummary[];
  dataSelected: DtxsidMap | Record<string, never>;
  gridOptions: GridOptions<PhyschemSummary>;
}>();

const emits = defineEmits<{
  updateDataSelected: [dataSelectedMap: DtxsidMap];
  setChemReviewedCount: [count: number];
}>();

const columnDefs = physchemColumnDefs;

onBeforeMount(() => {
  emits('setChemReviewedCount', 0);
});

const onSelectionChanged = (params: SelectionChangedEvent<PhyschemSummary>) => {
  const selections: PhyschemSummary[] = params.api.getSelectedRows();
  const dataSelectedMap = selections.reduce((acc, cv) => {
    const {dtxsid, id} = cv;
    acc[dtxsid] = acc[dtxsid] && Array.isArray(acc[dtxsid]) ? [...acc[dtxsid], id] : [id];
    return acc;
  }, {} as DtxsidMap);
  emits('updateDataSelected', dataSelectedMap);
};

const chemicalsReviewed = ref<string[]>([]);
const onRowGroupOpened = (params: RowGroupOpenedEvent<PhyschemSummary>) => {
  if (params.node.expanded && params.node.level === 0) {
    if (!chemicalsReviewed.value.includes(params.node.key as string)) {
      chemicalsReviewed.value.push(params.node.key as string);
    }
    emits('setChemReviewedCount', chemicalsReviewed.value.length);
  }
};

const onCellClicked = (params: CellClickedEvent<PhyschemSummary>) => {
  // Avoid row selection when clicking on details column
  if (params.column.getColId() === 'detailsCol' && !params.node.group) {
    params.node.setSelected(!params.node.isSelected());
  }
};

const fillPreviousSelections = (api: GridApi<PhyschemSummary>) => {
  if (Object.keys(props.dataSelected).length) {
    const selectedData = props.dataSelected as DtxsidMap;
    api.forEachNodeAfterFilterAndSort((node) => {
      if (node.level === 1 && node.data?.dtxsid &&
        node.data?.dtxsid in selectedData &&
        selectedData[node.data?.dtxsid]?.includes(node.data.id)) {
        node.setSelected(true);
      }
    });
  }
};

const onFirstDataRendered = (event: FirstDataRenderedEvent<PhyschemSummary>) => {
  fillPreviousSelections(event.api);
};

defineExpose({
  ChemsWorkedOnStatusPanel,
  ChemsReviewedStatusPanel,
  DetailsRenderer,
  PropertyRenderer,
  AvgAndMedianRenderer,
  RangeRenderer,
  ChemicalNameRenderer,
});
</script>

<style scoped>

</style>
