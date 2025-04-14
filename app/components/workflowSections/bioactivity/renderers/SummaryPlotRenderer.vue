<template>
  <Suspense>
    <div>
      <SummaryPlotDialog
        v-if="!isLoading && showPlotIcon"
        :plot-url="plotUrl"
        :params="params"
      />
      <Spinner v-else-if="isLoading && showPlotIcon" />
      <div v-else>
        No Plot Found
      </div>
    </div>
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import SummaryPlotDialog from '../dialogs/SummaryPlotDialog.vue';
import type {BioactivityBaseRes} from '~/api/Bioactivity/types';
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';
import type {Dtxsid} from '~~/types';

const props = defineProps<{
  params: ICellRendererParams<BioactivityBaseRes>;
}>();

const isLoading = ref(false);

const plotUrl = ref('');

const showPlotIcon = computed(() => !!plotUrl.value);

const getPlot = async() => {
  const {$repositories} = useNuxtApp();
  const plotInfo = await $repositories.bioactivity.getSummaryPlotInfo(props.params.data?.dtxsid as Dtxsid);

  plotUrl.value = plotInfo;
};

onMounted(async() => {
  try {
    isLoading.value = true;
    await getPlot();
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>

</style>
