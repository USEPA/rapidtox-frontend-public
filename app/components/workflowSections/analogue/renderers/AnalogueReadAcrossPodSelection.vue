<template>
  <Suspense>
    <AnaloguePodSelectionDialog :params="props.params" />
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import AnaloguePodSelectionDialog from '../dialogs/AnaloguePodSelectionDialog.vue';
import type {ReadAcross} from '~/api/Analogue/types';

const props = defineProps<{
  params: ICellRendererParams<ReadAcross> & {
    currentStepDetails: () => AnalogueStepInfo;
    currentAnalogueSelectedChemical: () => AnalogueSelectedChemical | Record<string, never>;
    // eslint-disable-next-line no-unused-vars
    updateSelections: (stepInfo: UpdateStepInfoParams) => void;
  };
}>();
</script>

<style scoped>

</style>
