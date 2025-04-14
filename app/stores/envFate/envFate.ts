import type {EnvFateSessionData} from './types';
import type {Dtxsid, DtxsidMap} from '~~/types';

export const useEnvFateStore = defineStore('envFate', () => {
  // Env Fate Session data
  const hasVisited = ref(false);

  const loadEnvFateSession = (sessionData: EnvFateSessionData) => {
    if (!sessionData) {
      return;
    }
    envFateChemsWithNoData.value = sessionData.envFateChemsWithNoData || [];
    chemicalsReviewedCount.value = sessionData.chemicalsReviewedCount || 0;
    totalChemicalsCount.value = sessionData.totalChemicalsCount || 0;
    envFateDataSelected.value = sessionData.envFateDataSelected || {};
    hasVisited.value = sessionData.hasVisited || false;
  };

  const resetEnvFate = () => {
    hasVisited.value = false;
    totalChemicalsCount.value = 0;
    chemicalsReviewedCount.value = 0;
    envFateDataSelected.value = {};
    envFateChemsWithNoData.value = [];
  };

  // Env Fate Data Selection
  const totalChemicalsCount = ref(0);
  const chemicalsReviewedCount = ref(0);
  const envFateDataSelected: Ref<DtxsidMap | Record<string, never>> = ref({});
  const envFateChemsWithNoData: Ref<Dtxsid[]> = ref([]);
  const chemicalsWorkedOnCount = computed(() => Object.keys(envFateDataSelected.value).length);

  return {
    hasVisited,
    loadEnvFateSession,
    resetEnvFate,
    totalChemicalsCount,
    envFateDataSelected,
    envFateChemsWithNoData,
    chemicalsWorkedOnCount,
    chemicalsReviewedCount,
  };
});
