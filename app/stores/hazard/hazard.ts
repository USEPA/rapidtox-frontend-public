import type {ExposureChartData, HazardSessionData} from './types';
import type {
  Dtxsid, DtxsidMap, PodData,
} from '~~/types';

export const useHazardStore = defineStore('hazard', () => {
  // Hazard session data
  const hasVisited = ref(false);

  const loadHazardSession = (sessionData: HazardSessionData) => {
    if (!sessionData) {
      return;
    }
    hazardDataSelected.value = sessionData.hazardDataSelected || {};
    totalChemicalsCount.value = sessionData.totalChemicalsCount;
    hazardToxChemsWithNoData.value = sessionData.hazardToxChemsWithNoData || [];
    hazardPodChemsWithNoData.value = sessionData.hazardPodChemsWithNoData || [];
    hasVisited.value = sessionData.hasVisited;
    hazardChartData.value = sessionData.hazardChartData || [];
    chartExposure.value = sessionData.chartExposure || [];
  };

  const resetHazard = () => {
    hazardToxChemsWithNoData.value = [];
    hazardPodChemsWithNoData.value = [];
    hazardChartData.value = [];
    chartExposure.value = [];
    totalChemicalsCount.value = 0;
    hasVisited.value = false;
    hazardDataSelected.value = {};
  };

  // Used for report? TODO: refactor when migrating report store
  const hazardToxChemsWithNoData: Ref<Dtxsid[]> = ref([]);
  const hazardPodChemsWithNoData: Ref<Dtxsid[]> = ref([]);

  // In vivo toxicity selection data
  const totalChemicalsCount = ref(0);

  const chemicalsReviewedCount = ref(0);

  const hazardDataSelected: Ref<DtxsidMap | Record<string, never>> = ref({});

  const hazardChartData: Ref<PodData[]> = ref([]);

  const chartExposure: Ref<ExposureChartData[]> = ref([]);

  const hazardApiResponse = ref<PodData[]>([]);

  const chemicalsWorkedOnCount = computed(() => Object.keys(hazardDataSelected.value).length);

  return {
    hasVisited,
    loadHazardSession,
    hazardToxChemsWithNoData,
    hazardPodChemsWithNoData,
    hazardDataSelected,
    hazardChartData,
    chemicalsReviewedCount,
    chemicalsWorkedOnCount,
    totalChemicalsCount,
    chartExposure,
    hazardApiResponse,
    resetHazard,
  };
});
