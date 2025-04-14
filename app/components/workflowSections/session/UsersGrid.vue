<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <ag-grid-vue
          :loading="isLoading"
          :style="gridSize"
          class="ag-theme-balham"
          :grid-options="configObj.gridOptions"
          :row-data="gridData"
          :column-defs="props.configObj.gridColumnDefs"
          :data-cy="`UsersGrid`"
          @grid-ready="onGridReady"
          @selection-changed="emits('selectionChanged')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  ColDef, GridApi, GridOptions, GridReadyEvent,
} from 'ag-grid-community';
import type {UserGridItem} from '~/api/Session/types';

const props = defineProps<{
  gridData: UserGridItem[];
  configObj: {
    gridColumnDefs: ColDef<UserGridItem>[];
    gridOptions: GridOptions<UserGridItem>;
  };
  isLoading: boolean;
  gridSize: string;
}>();

const emits = defineEmits<{
  gridRef: [ref: {
    gridApi: GridApi<UserGridItem>;
  }];
  selectionChanged: [];
}>();

// Grid Ref
const gridApi = shallowRef<GridApi<UserGridItem> | null>(null);

// Grid Events
const onGridReady = (params: GridReadyEvent<UserGridItem>) => {
  gridApi.value = params.api;
  nextTick(() => gridApi?.value?.sizeColumnsToFit());
  const gridRef = {
    gridApi: params.api,
  };

  emits('gridRef', gridRef);
};
</script>

<style scoped>
</style>
