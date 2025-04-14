<template>
  <ag-grid-vue
    class="ag-theme-balham"
    :style="defaultGridstyle()"
    :column-defs="columnDefs"
    :grid-options="gridOptions"
    :row-data="props.rowData"
    :group-default-expanded="-1"
    @first-data-rendered="onFirstRendered"
  />
</template>

<script setup lang="ts">
import type {FirstDataRenderedEvent} from 'ag-grid-community';
import {defaultGridstyle} from '../../shared/helpers';
import ChemicalNameRenderer from '../../shared/renderers/ChemicalNameRenderer.vue';
import UncertaintyDuplicateRemoveRowRenderer from '../renderers/UncertaintyDuplicateRemoveRowRenderer.vue';
import InVivoToxicityRenderer from '../renderers/InVivoToxicityRenderer.vue';
import UncertaintyLabelSelectRenderer from '../renderers/UncertaintyLabelSelectRenderer.vue';
import RfvCalculatorRenderer from '../renderers/RfvCalculatorRenderer.vue';

const props = defineProps<{
  rowData: PodUncertaintyData[];
}>();
const columnDefs = computed(() => podUncertaintyColumnsDefs);
const gridOptions = computed(() => podUncertaintyGridOptions);

const onFirstRendered = (params: FirstDataRenderedEvent<PodUncertaintyData>) => {
  params.api.expandAll();
};

defineExpose({
  ChemicalNameRenderer,
  UncertaintyDuplicateRemoveRowRenderer,
  InVivoToxicityRenderer,
  UncertaintyLabelSelectRenderer,
  RfvCalculatorRenderer,
});
</script>

<style scoped>

</style>
