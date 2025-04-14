<template>
  <client-only>
    <div>
      <div style="height: 54px !important;line-height: 54px !important;display: inline-block">
        {{ props.params.chemsReviewedCount() }} of {{ props.params.totalChemicalsCount() }}  chemicals viewed |
      </div>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import type {IStatusPanelParams} from 'ag-grid-community';

const props = defineProps<{
  params: IStatusPanelParams & {
    chemsReviewedCount: () => number;
    totalChemicalsCount: () => number;
  };
}>();
</script>

<style scoped>

</style>
