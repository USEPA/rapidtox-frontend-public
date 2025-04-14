<template>
  <v-dialog
    aria-label="Generate Report"
    max-width="550"
    @after-enter="isGeneratingReport = false"
    @after-leave="afterDialogLeave"
  >
    <template #activator="{ props: dialogProps }">
      <WorkflowButton
        :text="`${isProcessingReport ? 'Generating' : 'Generate'} Report`"
        v-bind="dialogProps"
        size="default"
        class="h-100 generate-report-button"
        data-cy="ReportGenerateButton"
        :disabled="!isGenerateBtnEnabled"
      >
        <template #prepend>
          <nuxt-icon
            name="b/gear"
            :class="`min-nuxt-icon ${isProcessingReport ? 'rotate' : ''}`"
          />
        </template>
      </WorkflowButton>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar
          color="primary"
          :class="`pl-4 ${getWorkflowBgColor()}`"
          dark
        >
          Generate Report
          <v-spacer />
          <v-btn
            @click="isActive.value = false"
          >
            <nuxt-icon
              class="min-nuxt-icon"
              alt="Close"
              aria-label="Close"
              name="mdi/close"
            />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <GenerateReportAndDownload
            v-if="isGeneratingReport"
            :selected-rows="props.selectedRows"
            :session-id="props.sessionId"
            :workflow="props.workflow"
            :report-name="reportName"
          />
          <GenerateReportNameInput
            v-else
            ref="reportNameInput"
            :report-name="reportName"
            @update-report-name="updateReportName"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Close"
            variant="flat"
            data-cy="ReportCloseButton"
            @click="isActive.value = false"
          />
          <WorkflowButton
            v-if="!isGeneratingReport"
            text="Continue"
            data-cy="ReportContinueButton"
            :disabled="!isContinueEnabled"
            @click="transitionToReportGeneration"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import WorkflowButton from '../../shared/components/WorkflowButton.vue';
import {getWorkflowBgColor} from '../../shared/helpers';
import GenerateReportNameInput from '../components/GenerateReportNameInput.vue';
import GenerateReportAndDownload from '../components/GenerateReportAndDownload.vue';
import type {Workflow} from '~~/types';

const props = defineProps<{
  selectedRows: SelectedChemical[];
  sessionId: string;
  workflow: Workflow;
}>();

// This dialog has two states - input text form and generating report. This boolean is the state indicator.
const isGeneratingReport = ref(false);

const afterDialogLeave = () => {
  isGeneratingReport.value = false;
  reportName.value = '';
};

const {isProcessingReport} = storeToRefs(useReportStore());

// Name Input
const reportNameInput = ref<InstanceType<typeof GenerateReportNameInput>>();

const reportName = ref('');

const updateReportName = (name: string) => {
  reportName.value = name;
};

const isContinueEnabled = computed(() => {
  if (reportNameInput.value?.rules) {
    const {required, minLength} = reportNameInput.value!.rules;
    return isBoolean(required(reportName.value)) && isBoolean(minLength(reportName.value));
  }
  return false;
});

const transitionToReportGeneration = () => {
  if (isContinueEnabled.value) {
    isGeneratingReport.value = true;
  }
};

// Generate Report and Download
const isGenerateBtnEnabled = computed(() => {
  return !!props.selectedRows.length && !isProcessingReport.value;
});
</script>

<style scoped>
.generate-report-button {
  max-height: 40px;
}

.rotate {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
