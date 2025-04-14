<template>
  <section>
    <SectionHeader
      tooltip-text="The In Vivo Toxicity tab provides navigation
            to existent cancer and non-cancer human health toxicity values and
            dose response summary values (DRSV) from authoritative sources."
      section="In Vivo Toxicity"
      class="mt-2 mb-2"
      :chemicals-not-found="matchedChemicalsWithoutPhyschemData"
    >
      <template #title>
        <i>In Vivo</i> Toxicity Data Selection
      </template>
      <template #append>
        <v-col cols="auto">
          <a
            class="float-right"
            variant="text"
            style="color: darkblue"
            href="#"
            role="button"
            @click="showCancerDialog = true"
          >
            Click here to view information about cancer value classifications
          </a>
        </v-col>
      </template>
    </SectionHeader>
    <Spinner
      v-if="isLoading"
    />
    <ErrorLoadingGridAlert v-else-if="errorLoadingGrid" />
    <InVivoToxGrid
      v-else
      :data-selected="hazardDataSelected"
      :row-data="rowData"
      :hazard-chart-data="hazardChartData"
      data-testid="hazard-grid-test-id"
      @update-data-selected="onSelectionChange"
      @set-chem-reviewed-count="setChemReviewedCount"
    />
    <NoDataFoundDialog
      id="in-vivo-tox-no-data-found"
      section="In Vivo Toxicity"
      :show="showNoDataDialog"
      @close-dialog="showNoDataDialog = false"
    />
    <CancerInfoDialog
      :show="showCancerDialog"
      @close-cancer-dialog="showCancerDialog = false"
    />
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '../SectionHeader.vue';
import {sectionVisitedHandler} from '../shared/helpers';
import NoDataFoundDialog from '../shared/dialog/NoDataFoundDialog.vue';
import ErrorLoadingGridAlert from '../shared/alerts/ErrorLoadingGridAlert.vue';
import InVivoToxGrid from './grids/InVivoToxGrid.vue';
import CancerInfoDialog from './dialogs/CancerInfoDialog.vue';
import type {DtxsidMap, PodData} from '~~/types';
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';

// Grid Data
const rowData = ref<PodData[]>([]);
const isLoading = ref(true);
const errorLoadingGrid = ref(false);

const {selectedDtxsids, selectedChemicalsNameList} = storeToRefs(useChemicalSearchStore());
const {sessionWorkflowType} = storeToRefs(useSessionStore());

const matchedChemicalsWithoutPhyschemData = ref<string[]>([]);

const hazardStore = useHazardStore();
const {$patch: hazardPatch} = hazardStore;
const {
  totalChemicalsCount, hazardDataSelected, chemicalsReviewedCount, hazardChartData,
  hazardApiResponse, hazardPodChemsWithNoData, hazardToxChemsWithNoData,
} = storeToRefs(hazardStore);

const setTotalChemicalsCount = (physchemData: PodData[]) => {
  // unique set of dtxsids from physchem summary
  const unqiueDtxsids = new Set([...physchemData.map(data => data.dtxsid)]);
  totalChemicalsCount.value = unqiueDtxsids.size;
};

const setMatchedChemicalsWithoutPhyschemData = (physchemData: PodData[]) => {
  // unique set of chemical names
  const uniqueNames = Array.from(new Set([...physchemData.map(data => data.preferredName)]));
  const namesNotFound = selectedChemicalsNameList.value.filter(name => !uniqueNames.includes(name));
  namesNotFound.sort((a, b) => a.localeCompare(b));
  matchedChemicalsWithoutPhyschemData.value = namesNotFound;
};

onMounted(async() => {
  try {
    const {$repositories} = useNuxtApp();
    const hazardData = await $repositories.hazard.getHazardData(selectedDtxsids.value, sessionWorkflowType.value);
    hazardApiResponse.value = hazardData;
    setTotalChemicalsCount(hazardData);
    setMatchedChemicalsWithoutPhyschemData(hazardData);
    hazardToxChemsWithNoData.value = removeDuplicates(hazardApiResponse.value
      .filter(({superCategory}) => superCategory === SUPER_HAZARD_TYPES.TOX_NAME)
      .map(({dtxsid}) => dtxsid));
    hazardPodChemsWithNoData.value = removeDuplicates(hazardApiResponse.value
      .filter(({superCategory}) => superCategory === SUPER_HAZARD_TYPES.POD_NAME)
      .map(({dtxsid}) => dtxsid));

    rowData.value = hazardData;

    if (!rowData.value.length) {
      showNoDataDialog.value = true;
    }
  } catch {
    errorLoadingGrid.value = true;
  } finally {
    isLoading.value = false;
  }
});

const onSelectionChange = (hazardMap: DtxsidMap) => {
  hazardPatch((state) => { state.hazardDataSelected = hazardMap; });
};

const setChemReviewedCount = (count: number) => {
  chemicalsReviewedCount.value = count;
};

// No data dialog
const showNoDataDialog = ref(false);

// Cancer dialog
const showCancerDialog = ref(false);

// Handle refresh / session
const {hasVisited} = storeToRefs(useHazardStore());
onBeforeMount(() => {
  sectionVisitedHandler('hazard', hasVisited);
});
</script>

<style scoped>

</style>
