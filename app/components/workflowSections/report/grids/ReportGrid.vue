<template>
  <ag-grid-vue
    class="ag-theme-balham"
    data-cy="reportGrid"
    :column-defs="reportColumnDefs"
    :grid-options="reportGridOptions"
    :row-data="props.rowData"
    :style="defaultGridstyle()"
    @selection-changed="onSelectionChanged"
  />
</template>

<script setup lang="ts">
import type {SelectionChangedEvent} from 'ag-grid-community';
import {defaultGridstyle} from '../../shared/helpers';
import ChemicalNameRenderer from '../../shared/renderers/ChemicalNameRenderer.vue';
import SelectionCheck from '../../shared/renderers/SelectionCheck.vue';

const props = defineProps<{
  rowData: SelectedChemical[];
}>();

const selectedRows = ref<SelectedChemical[]>([]);

const onSelectionChanged = (params: SelectionChangedEvent<SelectedChemical>) => {
  selectedRows.value = params.api.getSelectedRows();
};

defineExpose({
  ChemicalNameRenderer,
  SelectionCheck,
  selectedRows,
});
</script>

<style scoped>

</style>
