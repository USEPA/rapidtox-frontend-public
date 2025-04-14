<template>
  <client-only>
    <div>
      <div style="height: 54px !important;line-height: 54px !important;display: inline-block; margin-left: 10px !important;">
        data selected from {{ props.params.chemsWorkedOnCount() }} of {{ props.params.totalChemicalsCount() }} chemicals
      </div>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import type {IStatusPanelParams} from 'ag-grid-community';

const props = defineProps<{
  params: IStatusPanelParams & {
    chemsWorkedOnCount: () => number;
    totalChemicalsCount: () => number;
  };
}>();
</script>

<style scoped>

</style>
