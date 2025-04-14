<template>
  <Suspense>
    <RfvCalculatorDialog
      v-if="showCalculator"
      :params="params"
    />
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import RfvCalculatorDialog from '../dialogs/RfvCalculatorDialog.vue';

const props = defineProps<{
  params: ICellRendererParams<PodUncertaintyData> & {
    // eslint-disable-next-line no-unused-vars
    updatePod: (updatedData: UpdatePodCalcParams) => PodDataTypes;
  };
}>();

const showCalculator = computed(() => props.params.node.level > 1);
</script>

<style scoped>

</style>
