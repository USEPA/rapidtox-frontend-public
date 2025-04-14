<template>
  <ag-grid-vue
    class="ag-theme-balham"
    :style="defaultGridstyle({ height: '500px', width: '100%' })"
    :column-defs="columnDefs"
    :row-data="props.rowData"
    tooltip-show-delay="0"
    header-height="60"
    row-height="40"
    row-selection="single"
    :default-col-def="defaultColDef"
    @first-data-rendered="onFirstRendered"
    @selection-changed="onSelectionChanged"
  />
</template>

<script setup lang="ts">
import type {
  FirstDataRenderedEvent, SelectionChangedEvent, SuppressKeyboardEventParams,
} from 'ag-grid-community';
import {defaultGridstyle} from '../../shared/helpers';
import BasicFocusableDialogRenderer from '../../shared/renderers/BasicFocusableDialogRenderer.vue';
import type {PodData} from '~~/types';

const defaultColDef = {
  suppressKeyboardEvent: (params: SuppressKeyboardEventParams) => gridUtil.colDefEvents.suppressKeyboardEvent(params),
  floatingFilter: false,
};

const props = defineProps<{
  rowData: PodData[];
  currentStepDetails: () => AnalogueStepInfo;
  currentAnalogueChemical: () => AnalogueSelectedChemical | Record<string, never>;
}>();

const emits = defineEmits<{
  updateSelections: [stepInfo: UpdateStepInfoParams];
}>();

const columnDefs = computed(() => podColumnDefs);

const fillPreviousSelections = (params: FirstDataRenderedEvent<PodData>) => {
  params.api.forEachNodeAfterFilterAndSort((node) => {
    if (props.currentStepDetails()?.selectedPODS?.some(({id}) => id === node.data?.id)) {
      node.setSelected(true);
    }
  });
};

const onFirstRendered = (params: FirstDataRenderedEvent<PodData>) => {
  fillPreviousSelections(params);
};

const onSelectionChanged = (params: SelectionChangedEvent<PodData>) => {
  const selectedRows = params.api.getSelectedRows() as PodData[];
  const unselectedPODS: number[] = [];
  params.api.forEachNode((node) => {
    if (!node.isSelected()) {
      unselectedPODS.push(node.data.id);
    }
  });
  const {searchWord} = props.currentAnalogueChemical();
  const selectedPODS = selectedRows?.length ?
    selectedRows.map(selection => ({
      ...selection,
      raPreferredName: selection.preferredName,
      dtxsid: selection.dtxsid,
      type: selection.toxvalType,
      id: selection.id,
      value: selection.toxvalNumeric,
      units: selection.toxvalUnits,
      criticalEffect: selection.effect,
      source: selection.superSource,
    })) as SelectedPod[] :
    [];
  emits('updateSelections', {
    unselectedPODS,
    searchWord,
    selectedPODS,
  });
};

defineExpose({
  BasicFocusableDialogRenderer,
});
</script>

<style scoped>

</style>
