<template>
  <div>
    <client-only>
      <div
        v-if="unmatchedChemCount > 0 && unmatchedChemCount < 2"
        class="unmatchedStatus"
      >
        ({{ unmatchedChemCount }} is unmatched)
      </div>
      <div
        v-if="unmatchedChemCount > 0 && unmatchedChemCount > 1"
        class="unmatchedStatus"
      >
        ({{ unmatchedChemCount }} are unmatched)
      </div>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import {useChemicalSearchStore} from '~/stores/chemicalSearch/chemicalSearch';

const {unmatchedChemicalsCount: unmatchedChemCount} = storeToRefs(useChemicalSearchStore());
</script>

<style scoped>

</style>
