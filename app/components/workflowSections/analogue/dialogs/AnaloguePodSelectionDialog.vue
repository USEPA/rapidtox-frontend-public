<template>
  <v-dialog
    v-if="!props.params.data?.isTarget"
    arial-label="DRSV Selections"
    max-width="1200"
    @after-enter="getPodData"
    @after-leave="resetDialog"
  >
    <template #activator="{ props: dialogProps }">
      <WorkflowButton
        v-bind="dialogProps"
        tabindex="0"
      >
        {{ hasDataSelected ? 'Edit' : 'Select' }}
      </WorkflowButton>
    </template>

    <template #default="{ isActive }">
      <v-card>
        <v-toolbar
          color="primary"
          :class="`pl-4 bg-${getWorkflowBgColor()}`"
          dark
        >
          {{ props.params.data?.preferredName }}
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
          <Spinner v-if="loading" />
          <ErrorLoadingGridAlert v-else-if="errorLoadingData" />
          <div v-else>
            <AnalogueReadAcrossPodSelectionsGrid
              :current-step-details="props.params.currentStepDetails"
              :current-analogue-chemical="props.params.currentAnalogueSelectedChemical"
              :row-data="podData"
              @update-selections="props.params.updateSelections"
            />
            <em>
              Note: The primary objective of expert-driven read-across is to identify a dose response summary value (DRSV)
              from one or more candidate analogue(s) and adopt it as a surrogate DRSV for the data-poor target chemical.
              The surrogate DRSV may then be used to derive a toxicity value for the target chemical.
            </em>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Close"
            variant="flat"
            @click="isActive.value = false"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import {getWorkflowBgColor} from '../../shared/helpers';
import ErrorLoadingGridAlert from '../../shared/alerts/ErrorLoadingGridAlert.vue';
import AnalogueReadAcrossPodSelectionsGrid from '../grids/AnalogueReadAcrossPodSelectionsGrid.vue';
import WorkflowButton from '../../shared/components/WorkflowButton.vue';
import type {ReadAcross} from '~/api/Analogue/types';
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';
import type {Dtxsid, PodData} from '~~/types';

const props = defineProps<{
  params: ICellRendererParams<ReadAcross> & {
    currentStepDetails: () => AnalogueStepInfo;
    currentAnalogueSelectedChemical: () => AnalogueSelectedChemical | Record<string, never>;
    // eslint-disable-next-line no-unused-vars
    updateSelections: (stepInfo: UpdateStepInfoParams) => void;
  };
}>();

const loading = ref(true);
const errorLoadingData = ref(false);

const podData = ref<PodData[]>([]);

const hasDataSelected = computed(() => props.params.currentStepDetails()
  .selectedPODS?.some(({dtxsid}) => dtxsid === props.params.data?.dtxsid));

const resetDialog = () => {
  loading.value = true;
  errorLoadingData.value = false;
  podData.value = [];
};

const getPodData = async() => {
  try {
    loading.value = true;
    errorLoadingData.value = false;
    const {$repositories} = useNuxtApp();
    const podApiResponse = await $repositories
      .hazard.getPODData(props.params.data?.dtxsid as Dtxsid, useWorkflowData().workflowId);
    podData.value = podApiResponse;
  } catch {
    errorLoadingData.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>

</style>
