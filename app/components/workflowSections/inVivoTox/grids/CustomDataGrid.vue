<template>
  <ag-grid-vue
    class="ag-theme-balham"
    style="width: auto; height: 300px"
    :row-data="gridData"
    :loading="isGridLoading"
    :column-defs="colDefs"
    :grid-options="gridOptions"
    header-height="60"
    row-height="60"
  />
</template>

<script setup lang="ts">
import customDataColumnDefs from '../gridConfigs/customDataColumnDefs';
import DeleteUserValueRenderer from '../renderers/DeleteUserValueRenderer.vue';
import type {PodData} from '~~/types';

const props = defineProps<{
  rowData: PodData[];
}>();

const isGridLoading = ref(true);

const gridData = computed(() => {
  return props.rowData || null;
});

onMounted(() => {
  isGridLoading.value = false;
});
const colDefs = computed(() => customDataColumnDefs);

const gridOptions = ref({
  defaultColDef: {
    ...baseGridOptions.defaultColDef,
  },
});

defineExpose({
  DeleteUserValueRenderer,
});
</script>

<style scoped>

</style>
