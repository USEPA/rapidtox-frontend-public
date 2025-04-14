<template>
  <Suspense>
    <BerCalculatorDialog
      v-if="showCalculator"
      :params="props.params"
    />
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import BerCalculatorDialog from '../dialogs/BerCalculatorDialog.vue';
import type {BioactivityBerRes} from '~/api/Bioactivity/types';

const props = defineProps<{
  params: ICellRendererParams<BioactivityBerRes> & {
    berCalcData: () => BerCalcData[];
    // eslint-disable-next-line no-unused-vars
    saveBerCalcEntry: (data: SaveBerCalcEntryParams) => void;
  };
}>();

const showCalculator = computed(() => !!props.params.data?.aed95Pctile95 ||
  !!props.params.data?.aed95Pctile50 || !!props.params.data?.aed95Pctile05);
</script>

<style scoped>

</style>
