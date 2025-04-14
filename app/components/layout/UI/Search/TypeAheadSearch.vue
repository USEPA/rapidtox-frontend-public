<template>
  <v-autocomplete
    id="type-ahead-auto-complete"
    ref="autoCompleteRef"
    v-model="searchItem"
    data-cy="chemical-search-input"
    :items="items"
    :loading="isSearchLoading"
    :label="TYPEAHEAD_SEARCH_LABEL"
    :aria-label="TYPEAHEAD_SEARCH_LABEL"
    no-filter
    return-object
    role="search"
    :title="TYPEAHEAD_SEARCH_LABEL"
    @update:search="search"
    @update:model-value="updateModel"
    @update:menu="updateMenu"
  >
    <template #no-data>
      <span
        v-if="isSearchLoading"
        class="ml-4"
        role="option"
      >
        Searching <v-progress-circular
          class="ml-1"
          indeterminate
        />
      </span>
      <option
        v-else
        class="ml-4"
        aria-label="Search"
      >
        {{ noDataMsg }}
      </option>
    </template>
    <template #prepend-item>
      <h5
        v-if="isSuggestions"
        class="mt-2 ml-2 text-wrap"
      >
        Sorry, no matches were found. Related suggestions below:
      </h5>
    </template>
    <template
      #item="{ item, props }"
    >
      <v-list-item
        v-bind="props"
        :value="item.value"
        :disabled="item.raw.isSuggestionTitle"
        max-width="inherit"
        role="option"
        tabindex="0"
      >
        <template
          #title
        >
          <div>
            <ChemicalImageIcon
              height="45"
              width="45"
              :data="item.raw"
            />

            <div
              class="mt-2"
            >
              <h6> <strong>{{ item.raw.searchWord }} </strong></h6>
              <h6> <i>{{ item.raw.dtxsid || item.raw.dtxcid }}</i></h6>
            </div>
          </div>
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import {useDebounceFn} from '@vueuse/core';
import ChemicalImageIcon from './ChemicalImageIcon.vue';
import {TYPEAHEAD_SEARCH_LABEL} from './constants';
import type {TypeAheadSearchItem} from '~/components/workflowSections/chemicalSearch/types';

const emits = defineEmits<{
  onSelect: [onSelectParams: {
    chem: TypeAheadSearchItem; searchText: string;
  }];
}>();

// Search
const items = ref<TypeAheadSearchItem[]>([]);
const searchItem = ref<TypeAheadSearchItem | null>(null);
const searchText = ref('');
const isSuggestions = ref(false);

const noDataMsg = ref('Start typing to search.');

const isSearchLoading = ref(false);

const autoCompleteRef = ref(null);
const updateModel = () => {
  if (searchItem.value) {
    emits('onSelect', {chem: searchItem.value, searchText: searchText.value});
  }
};

const search = useDebounceFn(async(value: string) => {
  searchText.value = value.trim();

  // Do not run search on DTXSID's or DTXCID's unless 9 characters have been typed in.
  if (searchText.value.toLowerCase().startsWith('dtx') && searchText.value.length <= 8) {
    return;
  }

  if (searchText.value && searchText.value.length > 2 && isMenuOpen.value) {
    try {
      items.value = [];
      isSearchLoading.value = true;
      const {$repositories} = useNuxtApp();
      const searchResults = await $repositories.chemicalSearch.startsWith(searchText.value);
      // No results
      if (searchResults && !searchResults.results?.length && !searchResults.suggestions?.length) {
        noDataMsg.value = 'Sorry, no matches or suggestions were found. Please adjust your search and try again.';
        return;
      }

      // If there are no results but suggestions are available
      if (searchResults && !searchResults.results?.length && searchResults.suggestions?.length) {
        items.value = searchResults!.suggestions.map(result => ({
          ...result,
          title: result.searchWord,
          value: result.searchWord,
        }));

        // Add caption to let user know they are looking at suggestions.
        isSuggestions.value = true;
        return;
      }

      items.value = searchResults?.results?.map(result => ({
        ...result,
        title: result.searchWord,
        value: result.searchWord,
      })) || [];
    } finally {
      isSearchLoading.value = false;
    }
  }
}, 500);

const attachAriaLabelToList = () => {
  const ele = document.getElementsByClassName('v-autocomplete__content')?.[0]?.getElementsByClassName('v-list');
  if (ele) {
    Array.from(ele).forEach((element) => {
      element.setAttribute('aria-label', 'search');
    });
  }
};

// Menu
const isMenuOpen = ref(false);
const updateMenu = (isOpen: boolean) => {
  isMenuOpen.value = isOpen;

  // This attaches an aria label to the dropdown - pass accessibility
  if (isOpen) {
    nextTick(() => attachAriaLabelToList());
  }

  // If user clicks away (blur) clear search
  if (!isOpen) {
    items.value = [];
    searchItem.value = null;
    searchText.value = '';
    isSuggestions.value = false;
    noDataMsg.value = 'Start typing to search.';
  }
};
</script>

<style scoped>
:deep(.v-label) {
  opacity: 1;
}
</style>
