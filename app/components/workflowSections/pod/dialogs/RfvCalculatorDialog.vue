<template>
  <v-dialog
    aria-label="Interim RapidTox RfV"
    max-width="75%"
    @after-enter="onDialogOpen"
  >
    <template #activator="{ props: dialogProps }">
      <Suspense>
        <nuxt-icon
          v-bind="dialogProps"
          tabindex="0"
          name="fa/calculator"
          class="rapidtox-icon"
          data-cy="rfvCalculatorIcon"
          @keyup.enter="($event: KeyboardEvent) => dialogProps.onClick($event)"
        />
      </Suspense>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar
          color="primary"
          :class="`pl-4 bg-${getWorkflowBgColor()}`"
          dark
        >
          Interim RapidTox RfV
          <v-spacer />
          <v-btn
            @click="isActive.value = false"
          >
            <Suspense>
              <nuxt-icon
                class="min-nuxt-icon text-white"
                alt="Close"
                aria-label="Close"
                name="mdi/close"
              />
            </Suspense>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <RfvForm
            ref="rfvForm"
            :uncertainty-factor-data="editableUncertaintyFactorData"
            :conversion-data="convertedPodHedData"
            :params="params"
            @update-editable-data="updateEditableData"
            @update-conversion-data="updateConversionData"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Close"
            variant="flat"
            @click="isActive.value = false"
          />
          <WorkflowButton
            text="Save"
            :disabled="!rfvForm?.isFormValid"
            @click="savePodCal"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import {getWorkflowBgColor} from '../../shared/helpers';
import RfvForm from '../components/RfvForm.vue';
import type {PodConversionData} from '../types';
import WorkflowButton from '../../shared/components/WorkflowButton.vue';

const props = defineProps<{
  params: ICellRendererParams<PodUncertaintyData> & {
    // eslint-disable-next-line no-unused-vars
    updatePod: (updatedData: UpdatePodCalcParams) => PodDataTypes;
  };
}>();

const rfvForm = ref<InstanceType<typeof RfvForm>>();

const editableUncertaintyFactorData = ref<UncertaintyFactorData[]>([]);
const updateEditableData = (data: UncertaintyFactorData[]) => {
  editableUncertaintyFactorData.value = data;
};

const onDialogOpen = () => {
  if (props.params.data?.uncertaintyFactorData) {
    const clonedData = structuredClone(toRaw(props.params.data?.uncertaintyFactorData));
    editableUncertaintyFactorData.value = clonedData;
    rfvForm.value?.onDialogOpen(clonedData);
  }
  convertedPodHedData.value = {
    convertedValue: props.params.data?.convertedValue || null,
    adjustmentFactor: props.params.data?.adjustmentFactor || null,
    podhed: props.params.data?.podhed || null,
    adjustmentFactorName: props.params.data?.adjustmentFactorName || null,
  };
};

const convertedPodHedData = ref<PodConversionData>({
  convertedValue: null,
  adjustmentFactor: null,
  podhed: null,
});

const updateConversionData = (conversionData: PodConversionData) => {
  convertedPodHedData.value = conversionData;
};

const {saveSession} = useSessionStore();
const savePodCal = () => {
  const updateParams: UpdatePodCalcParams = {
    uncertaintyFactorData: editableUncertaintyFactorData.value,
    podId: props.params.data?.id,
    compositeUf: rfvForm.value?.rfvCalculator?.compositeUf as number,
    interimRfV: rfvForm.value?.rfvCalculator?.interimRfvValue as string,
    conversionData: convertedPodHedData.value,
  };
  props.params.updatePod(updateParams);

  saveSession('pod');
};
</script>

<style scoped>

</style>
