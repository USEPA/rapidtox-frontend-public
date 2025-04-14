<template>
  <Suspense>
    <RemoveConvertedDoseDialog
      v-bind="props"
    />
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import RemoveConvertedDoseDialog from '../dialogs/RemoveConvertedDoseDialog.vue';
import type {PodData} from '~~/types';

const props = defineProps<{
  params: ICellRendererParams<PodData>;
}>();
</script>

<style scoped>

</style>
