<template>
  <div>
    <v-row justify="end">
      <v-col cols="2">
        <TargetChemicalLegend />
      </v-col>
    </v-row>
    <v-col cols="12">
      <Spinner v-if="loading" />
      <ErrorLoadingGridAlert v-else-if="errorLoadingData" />
      <AnalogueReadAcrossGrid
        v-else
        :row-data="readAcrossData"
      />
    </v-col>
  </div>
</template>

<script setup lang="ts">
import AnalogueReadAcrossGrid from '../../grids/AnalogueReadAcrossGrid.vue';
import TargetChemicalLegend from '../TargetChemicalLegend.vue';
import type {Dtxsid} from '~~/types';
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';
import ErrorLoadingGridAlert from '~/components/workflowSections/shared/alerts/ErrorLoadingGridAlert.vue';
import type {ReadAcross} from '~/api/Analogue/types';

const props = defineProps<{
  currentAnalogueStepsData: AnalogueStepInfo | undefined;
}>();

const readAcrossData = ref<ReadAcross[]>([]);
const loading = ref(false);
const errorLoadingData = ref(false);

onMounted(async() => {
  await getData();
});

const getData = async() => {
  try {
    loading.value = true;
    const {$repositories} = useNuxtApp();

    const selectedDtxsidList = props.currentAnalogueStepsData?.selectedAnalogues.map(({dtxsid}) => dtxsid) as Dtxsid[];
    const inputDtxsid = props.currentAnalogueStepsData?.unmatchedDtxsid || props.currentAnalogueStepsData?.dtxsid;
    const readAcrossResponse = await $repositories.analogue
      .getReadAcross(inputDtxsid as Dtxsid, selectedDtxsidList, useWorkflowData().workflowId);
    readAcrossResponse.sort((a, b) => selectedDtxsidList.indexOf(a.dtxsid) - selectedDtxsidList.indexOf(b.dtxsid));
    readAcrossData.value = readAcrossResponse;
  } catch {
    errorLoadingData.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>

</style>
