<template>
  <Suspense>
    <AnalogueJustificationDialog :params="props.params" />
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import AnalogueJustificationDialog from '../dialogs/AnalogueJustificationDialog.vue';
import type {ReadAcross} from '~/api/Analogue/types';

const props = defineProps<{
  params: ICellRendererParams<ReadAcross> & {
    hasDataSelected: () => boolean;
    hasJustification: () => boolean;
    currentStepInfo: () => AnalogueStepInfo;
    // eslint-disable-next-line no-unused-vars
    updateSelections: (stepInfo: UpdateStepInfoParams) => void;
  };
}>();
</script>

<style scoped>

</style>
