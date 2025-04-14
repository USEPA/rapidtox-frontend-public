<template>
  <v-container fluid>
    <v-row class="multi-search-container-row">
      <v-col
        id="multiple-chemical-search-col"
        cols="6"
        sm="6"
      >
        <v-textarea
          v-model.trim="searchInput"
          rows="20"
          aria-label="Multiple Chemical Search"
        />
        <section class="d-flex justify-content-between overflow-auto">
          <v-btn
            data-testid="clear-btn"
            :class="`bg-${workflowId} text-white`"
            variant="flat"
            @click="searchInput = ''"
          >
            <template #prepend>
              <nuxt-icon name="b/times-circle" />
            </template>
            Clear
          </v-btn>
          <v-btn
            data-testid="recent-searches-btn"
            :class="`bg-${workflowId} text-white`"
            variant="flat"
            @click="showRecentSearches = !showRecentSearches"
          >
            <template #prepend>
              <nuxt-icon name="b/clock-history" />
            </template>
            {{ showRecentSearches ? 'Hide' : 'Show' }} Recent Searches
          </v-btn>
          <v-btn
            data-testid="multi-search-btn"
            :class="`bg-${workflowId} text-white`"
            variant="flat"
            :disabled="searchDisabled"
            @click="multiSearch()"
          >
            <template #prepend>
              <nuxt-icon name="b/search" />
            </template>
            Search
          </v-btn>
        </section>
      </v-col>
      <v-col sm="6">
        <RecentChemicalSearches
          v-if="showRecentSearches"
          @fill-text-area="copyRecentSearch"
        />
        <SectionExplanations
          v-else
          title="Multiple Chemical Search"
          subtitle="This style of workflowId will allow you to search and compare multiple chemicals at once."
          type="Multiple"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import RecentChemicalSearches from './RecentChemicalSearches.vue';
import SectionExplanations from './SectionExplanations.vue';
import type {RecentSearch} from '~/api/ChemicalSearch/types';

const {workflowId} = useWorkflowData();

const searchInput = ref('');

const {chemicalSelect} = useChemicalSearchStore();

const showRecentSearches = ref(false);

const copyRecentSearch = (searchItem: RecentSearch) => {
  searchInput.value = searchItem.searchText;
};

const searchDisabled = computed(() => {
  if (!searchInput.value) { return true; }
  if (searchInput.value.split('\n').every(term => !term)) { return true; }

  return false;
});

const multiSearch = () => {
  if (!searchDisabled.value) {
    chemicalSelect({searchText: searchInput.value, searchIdentifiers: searchInput.value.split('\n')});
  }
};
</script>

<style scoped>
#multiple-chemical-search-col {
  height: fit-content;
}
:deep(.nuxt-icon svg) {
  width: 20px !important;
  height: 20px !important;
}
</style>
