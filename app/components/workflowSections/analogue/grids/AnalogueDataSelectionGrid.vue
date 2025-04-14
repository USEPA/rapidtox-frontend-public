<template>
  <ag-grid-vue
    :column-defs="columnDefs"
    :grid-options="gridOptions"
    class="ag-theme-balham"
    :row-data="rowData"
    :style="defaultGridstyle({ height: '55vh' })"
    @model-updated="onModelUpdated"
    @selection-changed="onSelectionChanged"
    @grid-ready="onGridReady"
  />
</template>

<script setup lang="ts">
import type {
  GridApi, GridReadyEvent, ModelUpdatedEvent, SelectionChangedEvent,
} from 'ag-grid-community';
import {defaultGridstyle} from '../../shared/helpers';
import ChemicalImagePopover from '../../shared/renderers/ChemicalImagePopover.vue';
import AnalogueSelCheckRenderer from '../renderers/AnalogueSelCheckRenderer.vue';
import type {CombinedAnalogueDataSelectionType} from '../types';
import type {ERAnalogue, HHRAnalogue} from '~/api/Analogue/types';
import type {Dtxsid} from '~~/types';

const props = defineProps<{
  rowData: ERAnalogue[] | HHRAnalogue[];
  currentAnalogueStepsData: AnalogueStepInfo | undefined;
}>();

const emits = defineEmits<{
  updateStepInfo: [stepInfo: UpdateStepInfoParams];
}>();

const gridOptions = computed(() => analogueDataSelGridOptions);
const gridApi = shallowRef<GridApi<CombinedAnalogueDataSelectionType> | null>(null);
const columnDefs = computed(() => useWorkflowData().workflowId === 'hha' ? analogueDataSelColumnDefs : analogueDataSelERColumnDefs);

const onModelUpdated = (params: ModelUpdatedEvent<CombinedAnalogueDataSelectionType>) => {
  fillPreviousSelections(params);
};

const fillPreviousSelections = (params: ModelUpdatedEvent<CombinedAnalogueDataSelectionType>) => {
  params.api.forEachNodeAfterFilterAndSort((node) => {
    if (props.currentAnalogueStepsData?.selectedAnalogues
      .map(analogue => analogue.dtxsid).includes(node?.data?.dtxsid as Dtxsid)) {
      node.setSelected(true);
    }
  });
};

const onGridReady = (params: GridReadyEvent<CombinedAnalogueDataSelectionType>) => {
  gridApi.value = params.api;
  gridApi.value.sizeColumnsToFit();
};

watch(() => props.currentAnalogueStepsData, () => {
  if (gridApi.value) {
    gridApi.value.forEachNode((node) => {
      const selectedDtxsids = props.currentAnalogueStepsData?.selectedAnalogues.map(({dtxsid}) => dtxsid);
      if (!selectedDtxsids?.includes(node.data.dtxsid)) {
        node.setSelected(false);
      }
    });
  }
});

const onSelectionChanged = (params: SelectionChangedEvent<CombinedAnalogueDataSelectionType>) => {
  const selectedRows = params.api.getSelectedRows();
  const unselectedAnalogues = [] as Dtxsid[];
  params.api.forEachNodeAfterFilter((node) => {
    if (!node.isSelected() && node.data?.dtxsid) {
      unselectedAnalogues.push(node.data?.dtxsid);
    }
  });
  const selectedAnalogues = selectedRows?.length ?
    selectedRows.map(selection => ({
      dtxsid: selection.dtxsid,
      name: selection.preferredName,
      similarity: selection.similarity,
    })) :
    [];

  emits('updateStepInfo', {
    searchWord: props.currentAnalogueStepsData?.searchWord || '',
    selectedAnalogues,
    unselectedAnalogues,
  });
};

defineExpose({
  ChemicalImagePopover,
  AnalogueSelCheckRenderer,
});
</script>

<style scoped>

</style>
