<template>
  <div>
    <div
      v-for="phase in reportPhases"
      :key="phase.title"
      class="d-inline-flex lh-lg"
    >
      <Spinner
        v-if="phase.isLoading"
        :figure-class="'na'"
        :caption-msg="''"
        class="mr-2"
        height="30"
        width="30"
      />
      <nuxt-icon
        v-else
        class="rapidtox-icon selection-check report-selection-icon mr-2"
        :variant="phase.hasError ? 'danger' : 'default'"
        :name="phase.hasError ? 'b/x-circle' : 'b/check2'"
      />
      <span>{{ phase.title }}</span>
    </div>
    <div
      v-if="reportUrl"
      class="mt-4"
    >
      Please click <a
        :href="reportUrl"
        download="RAPIDTOX_REPORT"
      >here</a> to download the generated report.
    </div>
  </div>
</template>

<script setup lang="ts">
import {mapChemicalReportRequestBody} from '../helpers/ReportMapper';
import type {ChemicalParams, LandscapeResponse} from '~/api/Report/types';
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';
import type {Workflow} from '~~/types';

const props = defineProps<{
  selectedRows: SelectedChemical[];
  sessionId: string;
  workflow: Workflow;
  reportName: string;
}>();

const landscapeStatusResponseCount = ref(0);
const reportPhases = ref([
  {
    title: 'Getting Data Landscape Reports Status',
    hasError: false,
    isLoading: true,
  }, {
    title: `Generating Data Landscape Reports ${landscapeStatusResponseCount.value} of ${props.selectedRows.length}`,
    hasError: false,
    isLoading: true,
  },
  {
    title: 'Generating Single/Batch Chemical Report',
    hasError: false,
    isLoading: true,
  },
]);
/** Get Data for all phases */
const {$repositories} = useNuxtApp();

const reportUrl = ref('');

onMounted(async() => {
  await generateReports();
});

const {isProcessingReport} = storeToRefs(useReportStore());

const generateReports = async() => {
  isProcessingReport.value = true;
  const landscapeStatusItems = await landscapeReportsStatus();
  await generateLandscapeReports(landscapeStatusItems);
  await generateChemicalReport();
  isProcessingReport.value = false;
};

// Landscape Reports Status Check - Phase 1
watch(landscapeStatusResponseCount, (newVal) => {
  reportPhases.value[1]!.title = `Generating Data Landscape Reports ${newVal} of ${props.selectedRows.length}`;
});

const landscapeReportsStatus = async() => {
  try {
    reportPhases.value[0]!.isLoading = true;
    const landscapeStatusResponse = await $repositories.report.getChemReportList({
      dtxsids: props.selectedRows.map(({dtxsid}) => dtxsid),
      workflow: props.workflow,
      sessionKey: props.sessionId,
    });
    landscapeStatusResponseCount.value = landscapeStatusResponse.length;
    return landscapeStatusResponse;
  } catch {
    reportPhases.value[0]!.hasError = true;
    reportPhases.value[0]!.title = 'Something went wrong during the data landscape reports status check. If the problem persists contact help desk support.';
    return [];
  } finally {
    reportPhases.value[0]!.isLoading = false;
  }
};

// Generate Landscape Reports - Phase 2
// eslint-disable-next-line consistent-return
const generateLandscapeReports = async(landscapeStatusItems: LandscapeResponse[]) => {
  try {
    reportPhases.value[1]!.isLoading = true;
    if (!landscapeStatusItems.length) {
      return null;
    }
    const {user: currentUser} = useOidcAuth();
    const username = currentUser?.value?.claims?.email as string;

    const landscapeReportsArr = landscapeStatusItems.map(({dtxsid}) => $repositories.report.generateLandscapeReports({
      dtxsid,
      workflow: props.workflow,
      sessionKey: props.sessionId,
      username,
    }));

    await Promise.all(landscapeReportsArr);
  } catch {
    reportPhases.value[1]!.hasError = true;
    reportPhases.value[1]!.title = 'Something went wrong while generating total data landscape reports.';
  } finally {
    reportPhases.value[1]!.isLoading = false;
  }
};

// Generate Chemical Report - Phase 3
const generateChemicalReport = async() => {
  try {
    reportPhases.value[2]!.isLoading = true;
    const reportParams = mapChemicalReportRequestBody(props.selectedRows, props.reportName);
    reportUrl.value = props.selectedRows.length > 1 ?
      await $repositories.report.getMultiChemicalsReport(reportParams) :
      await $repositories.report.getSingleChemicalReport(reportParams[0] as ChemicalParams);
  } catch {
    reportPhases.value[2]!.hasError = true;
    reportPhases.value[2]!.title = reportPhases.value[1]!.hasError ? 'Report generation has failed for total data landscape report(s) and chemical(s) report. Please contact help desk support.' : 'Something went wrong while generating your chemical(s) report. If the problem persists contact help desk support.';
  } finally {
    reportPhases.value[2]!.isLoading = false;
  }
};
</script>

<style scoped>
.report-selection-icon svg {
  height: 30px !important;
  width: 30px !important;
}
</style>
