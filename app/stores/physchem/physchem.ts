import type {PhyschemSessionData} from './types';
import type {Dtxsid, DtxsidMap} from '~~/types';

export const usePhyschemStore = defineStore('physchem', () => {
  // Physchem session data
  const hasVisited = ref(false);

  const loadPhyschemSession = (sessionData: PhyschemSessionData) => {
    if (!sessionData) {
      return;
    }
    hasVisited.value = sessionData.hasVisited || false;
    chemicalsReviewedCount.value = sessionData.chemicalsReviewedCount || 0;
    totalChemicalsCount.value = sessionData.totalChemicalsCount || 0;
    physchemDataSelected.value = sessionData.physchemDataSelected || {};
    physchemChemsWithNoData.value = sessionData.physchemChemsWithNoData || [];
  };

  const resetPhyschem = () => {
    hasVisited.value = false;
    chemicalsReviewedCount.value = 0;
    totalChemicalsCount.value = 0;
    physchemDataSelected.value = {};
    physchemChemsWithNoData.value = [];
  };

  // physchemem Data Selection
  const chemicalsReviewedCount = ref(0);
  const totalChemicalsCount = ref(0);
  const physchemDataSelected: Ref<DtxsidMap | Record<string, never>> = ref({});
  const physchemChemsWithNoData: Ref<Dtxsid[]> = ref([]);
  const chemicalsWorkedOnCount = computed(() => Object.keys(physchemDataSelected.value).length);
  return {
    hasVisited,
    loadPhyschemSession,
    resetPhyschem,
    chemicalsWorkedOnCount,
    chemicalsReviewedCount,
    totalChemicalsCount,
    physchemDataSelected,
    physchemChemsWithNoData,
  };
});
