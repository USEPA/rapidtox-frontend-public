<template>
  <div>
    <v-table
      :style="{ maxHeight: maxTableHeight }"
      class="recent-search-results-table"
    >
      <caption
        :class="`bg-${workflowId} text-white fs-4 text-center`"
      >
        {{ isLoading || errorLoadingSearches ? '' : recentSearches.length }} most recent chemical searches
        <v-progress-linear
          v-if="isLoading"
          indeterminate
        />
      </caption>
      <thead>
        <tr>
          <th
            scope="col"
            class="text-center"
          >
            Last Searched On
          </th>
          <th
            scope="col"
            class="text-center"
          >
            Number of Chemicals
          </th>
          <th
            scope="col"
            class="text-center"
          >
            Copy
          </th>
          <th
            scope="col"
            class="text-center"
          >
            Delete
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="errorLoadingSearches">
          <tr height="40" />
          <tr
            v-if="errorLoadingSearches"
            class="mt-2"
          >
            <td cols="4">
              <v-alert
                text="Error loading recent searches."
                type="error"
              />
            </td>
          </tr>
        </template>
        <tr
          v-for="searchResult in recentSearches"
          v-else
          :key="searchResult.id"
        >
          <th
            scope="row"
            class="text-center"
            tabindex="0"
          >
            {{ searchResult.searchedOn }}
          </th>
          <td
            class="text-center"
            tabindex="0"
          >
            {{ searchResult.searchText.split('\n').length }}
          </td>
          <td
            class="text-center"
            tabindex="0"
          >
            <v-btn
              :data-testid="`text-area-search-fill-btn-${searchResult.id}`"
              :class="`bg-white text-white`"
              flat
              :aria-label="`Move chemicals from ${searchResult.searchedOn} search to input`"
              @click="copyItemsToTextArea(searchResult)"
            >
              <template #prepend>
                <nuxt-icon
                  :style="{ color: getIconColor }"
                  name="b/arrow-left-square-fill"
                  aria-label="Left arrow icon"
                />
              </template>
            </v-btn>
          </td>
          <td
            class="text-center"
            tabindex="0"
          >
            <v-btn
              :data-testid="`delete-recent-search-btn-${searchResult.id}`"
              :class="`bg-white text-white`"
              flat
              :aria-label="`Delete search from ${searchResult.searchedOn}`"
              @click="deleteRecentSearch(searchResult)"
            >
              <template #prepend>
                <nuxt-icon
                  :style="{ color: getIconColor }"
                  name="b/trash"
                  aria-label="Trash can icon"
                />
              </template>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import type {RecentSearch} from '~/api/ChemicalSearch/types';

const emits = defineEmits<{
  fillTextArea: [searchItem: RecentSearch];
}>();

// Table Data
const {workflowId} = useWorkflowData();
const isLoading = ref(false);
const errorLoadingSearches = ref(false);
const recentSearches = ref<RecentSearch[]>([]);

const formatDate = (dateStr: string) => {
  return useDateFormat(dateStr, 'MMMM Do YYYY h:mm a', {locales: 'en-US'});
};

const getSearchData = async() => {
  // const {user: currentUser} = useOidcAuth();
  // const userName = currentUser?.value?.claims?.email as string;
  const {$repositories} = useNuxtApp();

  const searches = await $repositories.recentSearch.getRecentChemicalSearches();
  recentSearches.value = searches.map(searchData => ({
    ...searchData,
    searchedOn: formatDate(searchData.searchedOn).value,
  }));
};
onMounted(async() => {
  try {
    isLoading.value = true;
    await getSearchData();
  } catch {
    errorLoadingSearches.value = true;
  } finally {
    isLoading.value = false;
  }
});

// Actions Buttons - Delete and Copy
const getIconColor = computed(() => {
  return getWorkflowColor(workflowId);
});

const copyItemsToTextArea = (searchItem: RecentSearch) => {
  emits('fillTextArea', searchItem);
};

const deleteRecentSearch = async(searchItem: RecentSearch) => {
  try {
    isLoading.value = true;
    // const {user: currentUser} = useOidcAuth();
    // const userName = currentUser?.value?.claims?.email as string;
    const {$repositories} = useNuxtApp();
    await $repositories.recentSearch.deleteRecentChemicalSearch(searchItem.id);
    await getSearchData();
  } finally {
    isLoading.value = false;
  }
};

// Size Height of Table with associated text area
const maxTableHeight = ref('600px');
useResizeObserver(document.getElementById('multiple-chemical-search-col'), (entries) => {
  const entry = entries[0];
  if (entry) {
    const {height} = entry.contentRect;
    maxTableHeight.value = `${height.toString()}px`;
  }
});
</script>

<style scoped lang="scss">
.recent-search-results-table {
  min-height: 200px;
  overflow: auto;
}
caption {
  caption-side: top;
  position: sticky;
  top: 0;
  background-color: inherit;
  z-index: 1;
}
thead {
  position: sticky;
  top: 46px;
  background-color: white;
  z-index: 2;
}

th {
  background-color: white;
}
</style>
