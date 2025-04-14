<template>
  <v-container>
    <SelectedPod
      ref="rfvSelectedPod"
      :selected-pod="selectedPod"
      :params="params"
      :conversion-data="conversionData"
      @update-conversion-data="updateConversionData"
    />
    <RfvJustificationTable
      ref="rfvJustTable"
      :composite-uf="compositeUf"
      :selected-pod="selectedPod"
      :has-conversion-data="hasConverstionData"
      @update-editable-data="updateData"
    />
    <RfvCalculator
      ref="rfvCalculator"
      :conversion-data="conversionData"
      :uncertainty-factor-data="props.uncertaintyFactorData"
      :is-form-valid="isFormValid"
      :params="params"
    />
  </v-container>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import type {PodConversionData} from '../types';
import SelectedPod from './SelectedPod.vue';
import RfvJustificationTable from './RfvJustificationTable.vue';
import RfvCalculator from './RfvCalculator.vue';

const rfvJustTable = ref<InstanceType<typeof RfvJustificationTable>>();
const rfvSelectedPod = ref<InstanceType<typeof SelectedPod>>();
const rfvCalculator = ref<InstanceType<typeof RfvCalculator>>();

const props = defineProps<{
  uncertaintyFactorData: UncertaintyFactorData[];
  params: ICellRendererParams<PodUncertaintyData>;
  conversionData: PodConversionData;
}>();

const emits = defineEmits<{
  updateEditableData: [data: UncertaintyFactorData[]];
  updateConversionData: [conversionData: PodConversionData];
}>();

const onDialogOpen = (uncertaintyData: UncertaintyFactorData[]) => {
  rfvJustTable?.value?.onDialogOpen(uncertaintyData);
};

const updateData = (data: UncertaintyFactorData[]) => {
  emits('updateEditableData', data);
};

const updateConversionData = (conversionData: PodConversionData) => {
  emits('updateConversionData', conversionData);
};

const isFormValid = computed(() => {
  return !!rfvJustTable.value?.isJustificationsValid;
});

const hasConverstionData = computed(() => !!rfvSelectedPod.value?.rfvConversionDialog?.hasConverstionData);

const compositeUf = computed(() => rfvCalculator.value?.calculatedCompositeUf || null);

const selectedPod = computed(() => {
  return rfvCalculator.value?.selectedPod || '';
});

defineExpose({
  onDialogOpen,
  rfvJustTable,
  rfvCalculator,
  isFormValid,
});
</script>

<style scoped>
</style>
