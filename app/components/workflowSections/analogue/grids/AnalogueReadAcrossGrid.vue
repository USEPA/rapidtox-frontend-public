<template>
  <ag-grid-vue
    class="ag-theme-balham"
    :style="defaultGridstyle({ height: '55vh' })"
    :row-data="props.rowData"
    :column-defs="columnDefs"
    :grid-options="gridOptions"
  />
</template>

<script setup lang="ts">
import {defaultGridstyle} from '../../shared/helpers';
import ChemicalImagePopover from '../../shared/renderers/ChemicalImagePopover.vue';
import AnalogueJustificationRenderer from '../renderers/AnalogueJustificationRenderer.vue';
import AnalogueReadAcrossPodSelection from '../renderers/AnalogueReadAcrossPodSelection.vue';
import type {ReadAcross} from '~/api/Analogue/types';

const props = defineProps<{
  rowData: ReadAcross[];
}>();

const columnDefs = computed(() => analogueReadAcrossSelColumnDefs);
const gridOptions = computed(() => analogueReadAcrossSelGridOptions);

defineExpose({
  ChemicalImagePopover,
  AnalogueJustificationRenderer,
  AnalogueReadAcrossPodSelection,
});
</script>

<style scoped>

</style>
