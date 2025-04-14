<template>
  <v-row class="mt-2">
    <v-col cols="4">
      <label for="selected-pod-readonly-field">Selected DRSV:</label>
    </v-col>
    <v-col cols="4">
      <v-text-field
        id="selected-pod-readonly-field"
        aria-label="Selected DRSV"
        density="compact"
        :value="props.selectedPod"
        readonly
      />
    </v-col>
    <v-col cols="4">
      <RfvUnitConversionDialog
        ref="rfvConversionDialog"
        :conversion-data="props.conversionData"
        :params="props.params"
        @update-conversion-data="updateConversionData"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import RfvUnitConversionDialog from '../dialogs/RfvUnitConversionDialog.vue';
import type {PodConversionData} from '../types';

const rfvConversionDialog = ref<InstanceType<typeof RfvUnitConversionDialog>>();

const props = defineProps<{
  selectedPod: string;
  params: ICellRendererParams<PodUncertaintyData>;
  conversionData: PodConversionData;
}>();
const emits = defineEmits<{
  updateConversionData: [conversionData: PodConversionData];
}>();

const updateConversionData = (conversionData: PodConversionData) => {
  emits('updateConversionData', conversionData);
};

defineExpose({
  rfvConversionDialog,
});
</script>

<style scoped>

</style>
