<template>
  <section>
    <SectionHeader
      title="Chemical Search Results"
      tooltip-text="The chemical search results tab contains a table with all of the results of your search.
       On this tab you will select the chemical(s) to use throughout the workflow."
      section="chemSearchResults"
      :chemicals-not-found="[]"
    />

    <Spinner
      v-if="isLoading"
    />
    <ErrorLoadingGridAlert v-else-if="errorLoadingGrid" />
    <ChemicalSearchResultsGrid
      v-else
      :row-data="selectedChemicals"
    />
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '../SectionHeader.vue';
import {sectionVisitedHandler} from '../shared/helpers';
import ChemicalSearchResultsGrid from './ChemSearchResultsGrid.vue';
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';
import ErrorLoadingGridAlert from '~/components/workflowSections/shared/alerts/ErrorLoadingGridAlert.vue';

// Grid Data
const selectedChemicals = ref<SelectedChemical[]>([]);

const chemicalStore = useChemicalSearchStore();

const {identifiers} = storeToRefs(chemicalStore);

const isLoading = ref(true);
const errorLoadingGrid = ref(false);

const getSearchResults = async() => {
  try {
    const {$repositories} = useNuxtApp();
    const searchResults = await $repositories.chemicalSearch.chemicalMultiSearch(identifiers.value as Idenitifer);
    selectedChemicals.value = searchResults;
  } catch {
    errorLoadingGrid.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(async() => {
  await getSearchResults();
});

// Handle refresh / session
const {hasChemSearchResultsVisited} = storeToRefs(chemicalStore);
onBeforeMount(() => {
  sectionVisitedHandler('chemSearchResults', hasChemSearchResultsVisited);
});
</script>

<style scoped>
:deep(.nuxt-icon svg) {
  width: 40px;
  height: 50px;
}
</style>
