<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="6"
        sm="6"
      >
        <TypeAheadSearch @on-select="onSelect" />
      </v-col>
      <v-col sm="6">
        <SectionExplanations
          title=" Single Chemical Search"
          subtitle="This workflow mode will target information for a specific chemical of interest."
          type="Single"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import SectionExplanations from './SectionExplanations.vue';
import type {TypeAheadSearchItem} from './types';
import TypeAheadSearch from '~/components/layout/UI/Search/TypeAheadSearch.vue';

const {chemicalSelect} = useChemicalSearchStore();

const onSelect = ({chem, searchText}: {
  chem: TypeAheadSearchItem; searchText: string;
}) => {
  chemicalSelect({searchText, searchIdentifiers: [chem.dtxsid]});
};
</script>

<style scoped>

</style>
