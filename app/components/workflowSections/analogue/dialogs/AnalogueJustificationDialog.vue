<template>
  <v-dialog
    v-if="!props.params.data?.isTarget"
    aria-label="Surrogate DRSV Justification"
    max-width="600"
    @after-enter="onDialogOpen"
  >
    <template #activator="{ props: dialogProps }">
      <WorkflowButton
        v-bind="dialogProps"
        tabindex="0"
        :disabled="!props.params.hasDataSelected()"
      >
        {{ props.params.hasJustification() ? "Edit" : "Add" }}
      </WorkflowButton>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar
          color="primary"
          :class="`pl-4 bg-${getWorkflowBgColor()}`"
          dark
        >
          Record a justification
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
          <v-textarea
            v-model="justification"
            label="Record a justification for selecting this analogue"
            :rules="[validationRules.length]"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Close"
            variant="flat"
            @click="isActive.value = false"
          />
          <WorkflowButton
            v-if="props.params.hasJustification()"
            text="Delete"
            @click="deleteJustification(isActive)"
          />
          <WorkflowButton
            text="Submit"
            :disabled="isSubmitDisabled"
            @click="submitJustification(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import {getWorkflowBgColor} from '../../shared/helpers';
import WorkflowButton from '../../shared/components/WorkflowButton.vue';
import type {ReadAcross} from '~/api/Analogue/types';
import type {Dtxsid} from '~~/types';

const props = defineProps<{
  params: ICellRendererParams<ReadAcross> & {
    hasDataSelected: () => boolean;
    hasJustification: () => boolean;
    currentStepInfo: () => AnalogueStepInfo;
    // eslint-disable-next-line no-unused-vars
    updateSelections: (stepInfo: UpdateStepInfoParams) => void;
  };
}>();

const justification = ref('');

const validationRules = ref({
  length: (val: string) => (val.length > 30 && val.length < 300) || 'Justification message must be a minimum of 30 characters and no more than 300 characters.',
});

const currentPod = computed(() => props.params
  .currentStepInfo()?.selectedPODS?.find(({dtxsid}) => dtxsid === props.params.data?.dtxsid));

const onDialogOpen = () => {
  if (props.params.hasJustification()) {
    justification.value = props.params.currentStepInfo()
      ?.PODJustifications?.find(({dtxsid}) => dtxsid === currentPod.value?.dtxsid)?.justification || '';
  }
};

const isSubmitDisabled = computed(() => {
  const {length} = validationRules.value;
  return (!justification.value.length || !isBoolean(length(justification.value)));
});

const submitJustification = (isActive: globalThis.Ref<boolean, boolean>) => {
  if (!isSubmitDisabled.value) {
    const currentPodJustfications = [...props.params.currentStepInfo().PODJustifications];
    const isCurrentJustificationIncluded = currentPodJustfications.some(({dtxsid}) => dtxsid === currentPod.value?.dtxsid);
    const newJustification = {
      podId: currentPod.value?.id as number,
      dtxsid: currentPod.value?.dtxsid as Dtxsid,
      justification: justification.value,
    };

    if (currentPodJustfications?.length && isCurrentJustificationIncluded) {
      const justificationIdxToUpdate = currentPodJustfications.findIndex(({dtxsid}) => dtxsid === currentPod.value?.dtxsid);
      currentPodJustfications[justificationIdxToUpdate] = newJustification;
    } else {
      currentPodJustfications.push(newJustification);
    }
    props.params.updateSelections({
      PODJustifications: currentPodJustfications,
      searchWord: props.params.currentStepInfo().searchWord,
    });
    isActive.value = false;
  }
};

const deleteJustification = (isActive: globalThis.Ref<boolean, boolean>) => {
  if (props.params.hasJustification()) {
    props.params.updateSelections({
      PODJustifications: props.params.currentStepInfo()
        .PODJustifications.filter(({dtxsid}) => dtxsid !== currentPod.value?.dtxsid),
      searchWord: props.params.currentStepInfo().searchWord,
    });
    justification.value = '';
    isActive.value = false;
  }
};
</script>

<style scoped>
:deep(.v-messages__message) {
  line-height: 15px !important;
}
</style>
