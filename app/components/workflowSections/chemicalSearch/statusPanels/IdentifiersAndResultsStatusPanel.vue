<template>
  <div>
    <client-only>
      <div
        class="unmatchedStatus"
        style="display: inline-block"
      >
        | {{ identifiersCount }} searched terms<span />&nbsp;<span />
      </div>
      <div
        class="unmatchedStatus"
        style="display: inline-block"
      >
        | {{ matchedCount }} chemicals matched
      </div>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import {useChemicalSearchStore} from '~/stores/chemicalSearch/chemicalSearch';

const {identifiersCount, matchedCount} = storeToRefs(useChemicalSearchStore());
</script>

<style scoped>

</style>
