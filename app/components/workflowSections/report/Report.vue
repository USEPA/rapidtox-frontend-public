<template>
  <section>
    <SectionHeader
      title="Report Selection"
      tooltip-text="The Report tab allows the user to generate a PDF report based on workflow session selections.
      In addition to a “session” report, a “total data landscape” report is also generated in the background and may be
      accessed by the user as needed. The purpose is to provide the entire landscape of data available to the user at
      the time the RapidTox session was run."
      section="Reports"
    >
      <template #append>
        <v-col>
          <GenerateReportDialog
            :selected-rows="selectedRows"
            :session-id="sessionId"
            :workflow="sessionWorkflowType"
          />
        </v-col>
      </template>
    </SectionHeader>
    <ReportGrid
      ref="reportGridRef"
      class="mt-4"
      :row-data="reportData"
    />
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '../SectionHeader.vue';
import {sectionVisitedHandler} from '../shared/helpers';
import GenerateReportDialog from './dialogs/GenerateReportDialog.vue';
import ReportGrid from './grids/ReportGrid.vue';

const {selectedChemicals} = storeToRefs(useChemicalSearchStore());

const {sessionId, sessionWorkflowType} = storeToRefs(useSessionStore());

const reportGridRef = ref<InstanceType<typeof ReportGrid>>();

const selectedRows = computed(() => reportGridRef.value?.selectedRows || []);

const reportData = computed(() => selectedChemicals.value.filter(({searchGroup}) => searchGroup !== 'NOT FOUND'));

/**  Handle refresh / session */
const {hasVisited} = storeToRefs(useReportStore());
onBeforeMount(() => {
  sectionVisitedHandler('report', hasVisited);
});
</script>

<style scoped>

</style>
