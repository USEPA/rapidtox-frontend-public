<template>
  <v-tabs
    v-model="tab"
    class="ml-12 mt-4"
    selected-class="selected-chemical-search-tab"
  >
    <v-tab
      :value="1"
      tabindex="0"
      class="chemical-search-tab"
    >
      Single Chemical Search
    </v-tab>
    <v-tab
      :value="2"
      tabindex="0"
      class="chemical-search-tab"
      data-testid="select-multi-chemical-search-tab"
    >
      Multiple Chemical Search
    </v-tab>
  </v-tabs>
  <v-tabs-window
    v-model="tab"
    class="ml-12 mt-4"
  >
    <v-tabs-window-item
      :key="1"
      :value="1"
    >
      <SingleChemicalSearch />
    </v-tabs-window-item>

    <v-tabs-window-item
      :key="2"
      :value="2"
    >
      <MultiChemicalSearch />
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup lang="ts">
import MultiChemicalSearch from './MultiChemicalSearch.vue';
import SingleChemicalSearch from './SingleChemicalSearch.vue';

const tab = ref(1);

const baseStore = useAppBaseStore();
const {addTabVisited} = baseStore;

const chemStore = useChemicalSearchStore();
const {$patch: chemPatch} = chemStore;
const {hasChemSearchVisited} = storeToRefs(useChemicalSearchStore());

const {saveSession} = useSessionStore();
onBeforeMount(() => {
  const route = useRoute();
  if (!route.query.activeTab && !route.query.fromHome) {
    saveSession('chemSearch');
  }
  if (!hasChemSearchVisited.value) {
    chemPatch({hasChemSearchVisited: true});
    addTabVisited('chemSearch');
  }
});
</script>

<style scoped>
</style>
