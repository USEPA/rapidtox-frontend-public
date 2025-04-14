<template>
  <div>
    <div class="row">
      <ag-grid-vue
        v-if="!isLoading"
        ref="prevGridReference"
        cname="prevReportsGrid"
        suppress-context-menu="true"
        un-sort-icon="true"
        :style="gridSize"
        class="ag-theme-balham prev-report-grid"
        :grid-options="gridOptions"
        :row-data="gridData"
        :column-defs="columnDefs"
        :sorting="true"
        :filter="true"
        :suppress-row-click-selection="false"
        :data-cy="`prevReportGrid`"
        :tooltip-show-delay="0"
        header-height="53"
      />
      <figure
        v-else
        class="loading-figure"
      >
        <img
          src="~/assets/images/spinner.gif"
          height="400"
          width="400"
        >
        <figcaption>Your results are loading</figcaption>
      </figure>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {PreviousReport} from '~/api/Report/types';

defineProps<{
  gridData: PreviousReport[];
}>();

const isLoading = ref<boolean>(false);
const gridSize = ref<string>('height: 400px; width:100%; overflow:auto;overflow-x: auto;');

const gridOptions = prevReportGridOptions;
const columnDefs = prevReportColumnDefs;
</script>

<style lang="scss" scoped>
:deep(.ag-theme-balham .ag-row)
{
  font-size: 20px !important;
}
:deep(.v-field)
{
  font-size: 20px !important;
}
#numberOfSelected
{
  font-size: 20px;
  text-align: right;
}
.grid-header
{
  text-shadow: 2px 2px 2px #cccccc;
}
.popover-body
{
  height: 250px;
  overflow: auto !important;
}
.disabled
{
  color: black !important;
  background-color: lightgray !important;
  font-weight: bold !important;
}
.disabled:hover
{
  color: black !important;
  background-color: lightgray !important;
  font-weight: bold !important;
}
</style>
