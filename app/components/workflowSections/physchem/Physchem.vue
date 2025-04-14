<template>
  <section>
    <SectionHeader
      title="Physchem Data Selection"
      tooltip-text="The PhysChem tab contains experimentally derived and/or predicted physicochemical
        properties including Henry’s Law, boiling point, melting point, density, vapor pressure, water solubility,
          Log KoA, and Log Kow."
      section="Physchem"
      class="mt-2 mb-2"
      :chemicals-not-found="matchedChemicalsWithoutPhyschemData"
    />
    <Spinner
      v-if="isLoading"
    />
    <ErrorLoadingGridAlert v-else-if="errorLoadingGrid" />
    <PhyschemGrid
      v-else
      :row-data="rowData"
      :data-selected="physchemDataSelected"
      :grid-options="gridOptions"
      data-testid="physchem-grid-test-id"
      @update-data-selected="onSelectionChange"
      @set-chem-reviewed-count="setChemReviewedCount"
    />
    <NoDataFoundDialog
      id="physchem-no-data-found"
      section="Physchem"
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
import type {PhyschemSummary} from '~/api/Physchem/types';
import ErrorLoadingGridAlert from '~/components/workflowSections/shared/alerts/ErrorLoadingGridAlert.vue';
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';
import type {DtxsidMap} from '~~/types';

// Grid Data
const rowData = ref<PhyschemSummary[]>([]);
const isLoading = ref(true);
const errorLoadingGrid = ref(false);
const matchedChemicalsWithoutPhyschemData = ref<string[]>([]);

const gridOptions = computed(() => {
  physchemGridOptions.groupDefaultExpanded = getDefaultGroupExpansion('physChem');
  return physchemGridOptions;
});

const physchemStore = usePhyschemStore();
const {$patch: physchemPatch} = physchemStore;
const {
  selectedDtxsids, selectedChemicalsNameList,
} = storeToRefs(useChemicalSearchStore());

const {
  totalChemicalsCount, physchemDataSelected, chemicalsReviewedCount, physchemChemsWithNoData,
} = storeToRefs(physchemStore);

const setTotalChemicalsCount = (physchemData: PhyschemSummary[]) => {
  // unique set of dtxsids from physchem summary
  const unqiueDtxsids = new Set([...physchemData.map(data => data.dtxsid)]);
  totalChemicalsCount.value = unqiueDtxsids.size;
};

const setMatchedChemicalsWithoutPhyschemData = (physchemData: PhyschemSummary[]) => {
  // unique set of chemical names
  const uniqueNames = Array.from(new Set([...physchemData.map(data => data.preferredName)]));
  const namesNotFound = selectedChemicalsNameList.value.filter(name => !uniqueNames.includes(name));
  namesNotFound.sort((a, b) => a.localeCompare(b));
  matchedChemicalsWithoutPhyschemData.value = namesNotFound;
};

const getPhyschemData = async() => {
  try {
    const {$repositories} = useNuxtApp();
    const physchemData = await $repositories.physchem.getPhyschemSummaryData(selectedDtxsids.value);
    setTotalChemicalsCount(physchemData);
    setMatchedChemicalsWithoutPhyschemData(physchemData);
    physchemChemsWithNoData.value = removeDuplicates(physchemData.map(({dtxsid}) => dtxsid));
    rowData.value = physchemData;

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
  await getPhyschemData();
});

const onSelectionChange = (physchemMap: DtxsidMap) => {
  physchemPatch((state) => { state.physchemDataSelected = physchemMap; });
};

const setChemReviewedCount = (count: number) => {
  chemicalsReviewedCount.value = count;
};

// No data dialog
const showNoDataDialog = ref(false);

// Handle refresh / session
const {hasVisited} = storeToRefs(usePhyschemStore());
onBeforeMount(() => {
  sectionVisitedHandler('physChem', hasVisited);
});
</script>

<style scoped>

</style>
