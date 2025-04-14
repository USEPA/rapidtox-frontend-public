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
import type {FirstDataRenderedEvent, SelectionChangedEvent} from 'ag-grid-community';
import {defaultGridstyle} from '../../shared/helpers';
import ChemicalNameRenderer from '../../shared/renderers/ChemicalNameRenderer.vue';
import BasicFocusableDialogRenderer from '../../shared/renderers/BasicFocusableDialogRenderer.vue';
import type {BioactivityToxcastRes} from '~/api/Bioactivity/types';
import type {DtxsidMap} from '~~/types';

const props = defineProps<{
  rowData: BioactivityToxcastRes[];
}>();

const columnDefs = computed(() => bioToxcastModelsColumnDefs);
const gridOptions = computed(() => bioToxcastModelsGridOptions);

const bioactivityStore = useBioactivityStore();
const {selectedToxcastChemicals} = storeToRefs(bioactivityStore);

const onSelectionChange = (params: SelectionChangedEvent<BioactivityToxcastRes>) => {
  const selectedRows: BioactivityToxcastRes[] = params.api.getSelectedRows();
  selectedToxcastChemicals.value = selectedRows.reduce((acc, cv) => {
    if (acc[cv.dtxsid] && Array.isArray(acc[cv.dtxsid])) {
      acc[cv.dtxsid]?.push(cv.id);
    } else {
      acc[cv.dtxsid] = [cv.id];
    }
    return acc;
  }, {} as DtxsidMap);
};

const fillPreviousSelections = (params: FirstDataRenderedEvent<BioactivityToxcastRes>) => {
  params.api.forEachNodeAfterFilterAndSort((node) => {
    if (!node.group && node.data?.dtxsid && node.data.dtxsid in selectedToxcastChemicals.value) {
      if ((selectedToxcastChemicals.value as DtxsidMap)?.[node.data.dtxsid]?.includes(node.data.id)) {
        node.setSelected(true, false);
      }
    }
  });
};

const onFirstRendered = (params: FirstDataRenderedEvent<BioactivityToxcastRes>) => {
  fillPreviousSelections(params);
};

defineExpose({
  ChemicalNameRenderer,
  BasicFocusableDialogRenderer,
});
</script>

<style scoped>

</style>
