<template>
  <v-dialog
    aria-label="Unit Conversion"
    max-width="1200"
    @after-enter="onDialogOpen"
  >
    <template #activator="{ props: dialogProps }">
      <WorkflowButton
        height="65%"
        v-bind="dialogProps"
        text="Unit Conversion"
      />
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar
          color="primary"
          :class="`pl-4 bg-${getWorkflowBgColor()}`"
          dark
        >
          Unit Conversion
          <v-tooltip
            height="auto"
            width="400"
            open-on-focus
            aria-label="This modal provides the opportunity to convert an experimental animal
            dose response summary value (DRSV) to a corresponding human equivalent DRSV HED using body-weight
            allometric scaling as per 2011 EPA guidance."
          >
            <template #activator="{ props: tooltipProps }">
              <sup><nuxt-icon
                name="b/info-circle"
                v-bind="tooltipProps"
                alt="Unit Conversion Information"
                tabindex="0"
                class="rapidtox-icon min-nuxt-icon ml-1 text-white"
              /></sup>
            </template>
            <template #default>
              This modal provides the opportunity to convert an experimental animal dose response summary value (DRSV)
              to a corresponding human equivalent DRSV (DRSV<sub>HED</sub>) using body-weight
              allometric scaling as per 2011 EPA guidance.
            </template>
          </v-tooltip>
          <v-spacer />
          <v-btn
            @click="isActive.value = false"
          >
            <nuxt-icon
              class="min-nuxt-icon text-white"
              alt="Close"
              aria-label="Close"
              name="mdi/close"
            />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <RfvUnitConversionStaticFields :params="props.params" />
            <v-divider />
            <RfvUnitConversionEditableFields
              ref="editableFields"
              :params="props.params"
              :conversion-data="props.conversionData"
            />
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Close"
            variant="flat"
            @click="isActive.value = false"
          />
          <v-btn
            text="Clear"
            variant="flat"
            color="warning"
            :disabled="!isClearEnabled"
            @click="clearFields"
          />
          <v-btn
            :text="hasConverstionData ? 'Update' : 'Save'"
            variant="flat"
            color="success"
            :disabled="!isSaveEnabled"
            @click="save(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import {getWorkflowBgColor} from '../../shared/helpers';
import type {PodConversionData} from '../types';
import RfvUnitConversionStaticFields from '../components/RfvUnitConversionStaticFields.vue';
import RfvUnitConversionEditableFields from '../components/RfvUnitConversionEditableFields.vue';
import WorkflowButton from '../../shared/components/WorkflowButton.vue';

const props = defineProps<{
  params: ICellRendererParams<PodUncertaintyData>;
  conversionData: PodConversionData;
}>();

const emits = defineEmits<{
  updateConversionData: [conversionData: PodConversionData];
}>();

const onDialogOpen = () => {
  editableFields.value?.onDialogOpen();
};

// Editable fields - bottom row
const editableFields = ref<InstanceType<typeof RfvUnitConversionEditableFields>>();

// Form Actions
const clearFields = () => {
  editableFields.value?.clearFields();
};

const save = (isActive: globalThis.Ref<boolean, boolean>) => {
  if (isSaveEnabled.value) {
    emits('updateConversionData', {
      convertedValue: editableFields.value?.sourcePod || null,
      adjustmentFactor: editableFields.value?.adjustmentData
        .find(({title}) => title === editableFields.value?.adjustmentFactor)?.value || null,
      podhed: Number(editableFields.value?.podHed) || null,
      adjustmentFactorName: editableFields.value?.adjustmentFactor || null,
    });

    isActive.value = false;
  }
};

const hasConverstionData = computed(() => props.conversionData.adjustmentFactor ||
  props.conversionData.convertedValue ||
  props.conversionData.podhed);

const isUpdateEnabled = computed(() => {
  const isCurrentFormUpdated = props.conversionData.adjustmentFactor !== editableFields.value?.adjustmentFactorValue ||
    props.conversionData.convertedValue !== editableFields.value?.sourcePod;
  if (isCurrentFormUpdated) {
    return true;
  }
  return false;
});

const isSaveEnabled = computed(() => {
  if (hasConverstionData.value) {
    return isUpdateEnabled.value;
  }
  return editableFields.value?.isSourceAndAdjustmentValid;
});

const isClearEnabled = computed(() => {
  return editableFields.value?.sourcePod !== null || !!editableFields.value?.adjustmentFactor;
});

defineExpose({
  hasConverstionData,
});
</script>

<style scoped lang="scss">

</style>
