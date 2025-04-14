<template>
  <section>
    <SectionHeader
      title="Env. Fate Data Selection"
      tooltip-text="The Env. Fate tab contains experimentally derived and/or predicted
          environmental fate properties including biodegradation half-life and soil adsorption coefficients."
      section="Env. Fate"
      class="mt-2 mb-2"
      :chemicals-not-found="matchedChemicalsWithoutEnvFateData"
    />
    <Spinner
      v-if="isLoading"
    />
    <ErrorLoadingGridAlert v-else-if="errorLoadingGrid" />
    <PhyschemGrid
      v-else
      :row-data="rowData"
      :grid-options="gridOptions"
      :data-selected="envFateDataSelected"
      data-testid="env-fate-grid-test-id"
      @update-data-selected="onSelectionChange"
      @set-chem-reviewed-count="setChemReviewedCount"
    />
    <NoDataFoundDialog
      id="env-fate-no-data-found"
      section="Env. Fate"
      :show="showNoDataDialog"
      @close-dialog="showNoDataDialog = false"
    />
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '../SectionHeader.vue';
import NoDataFoundDialog from '../shared/dialog/NoDataFoundDialog.vue';
import PhyschemGrid from '../shared/grids/PhyschemGrid.vue';
import {getDefaultGroupExpansion, sectionVisitedHandler} from '../shared/helpers';
import envFateGridOptions from './gridConfigs/envFateGridOptions';
import type {PhyschemSummary} from '~/api/Physchem/types';
import ErrorLoadingGridAlert from '~/components/workflowSections/shared/alerts/ErrorLoadingGridAlert.vue';
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';
import type {DtxsidMap} from '~~/types';

// Grid Data
const rowData = ref<PhyschemSummary[]>([]);
const isLoading = ref(true);
const errorLoadingGrid = ref(false);
const matchedChemicalsWithoutEnvFateData = ref<string[]>([]);

const gridOptions = computed(() => {
  envFateGridOptions.groupDefaultExpanded = getDefaultGroupExpansion('envFate');
  return envFateGridOptions;
});

const {
  selectedDtxsids, selectedChemicalsNameList,
} = storeToRefs(useChemicalSearchStore());

const {
  totalChemicalsCount, envFateDataSelected, chemicalsReviewedCount, envFateChemsWithNoData,
} = storeToRefs(useEnvFateStore());

const setTotalChemicalsCount = (physchemData: PhyschemSummary[]) => {
  // unique set of dtxsids from physchem summary
  const unqiueDtxsids = new Set([...physchemData.map(data => data.dtxsid)]);
  totalChemicalsCount.value = unqiueDtxsids.size;
};

const setMatchedChemicalsWithoutEnvFateData = (physchemData: PhyschemSummary[]) => {
  // unique set of chemical names
  const uniqueNames = Array.from(new Set([...physchemData.map(data => data.preferredName)]));
  const namesNotFound = selectedChemicalsNameList.value.filter(name => !uniqueNames.includes(name));
  namesNotFound.sort((a, b) => a.localeCompare(b));
  matchedChemicalsWithoutEnvFateData.value = namesNotFound;
};

const getEnvFateData = async() => {
  try {
    const {$repositories} = useNuxtApp();
    const envFateData = await $repositories.physchem.getEnvfatetransportSummaryData(selectedDtxsids.value);
    setTotalChemicalsCount(envFateData);
    setMatchedChemicalsWithoutEnvFateData(envFateData);
    envFateChemsWithNoData.value = removeDuplicates(envFateData.map(({dtxsid}) => dtxsid));
    rowData.value = envFateData;

    if (!rowData.value.length) {
      showNoDataDialog.value = true;
    }
  } catch {
    errorLoadingGrid.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(async() => {
  await getEnvFateData();
});

const onSelectionChange = (physchemMap: DtxsidMap) => {
  envFateDataSelected.value = physchemMap;
};

const setChemReviewedCount = (count: number) => {
  chemicalsReviewedCount.value = count;
};

// No data dialog
const showNoDataDialog = ref(false);

// Handle refresh / session
const {hasVisited} = storeToRefs(useEnvFateStore());
onBeforeMount(() => {
  sectionVisitedHandler('envFate', hasVisited);
});
</script>

<style scoped>

</style>
