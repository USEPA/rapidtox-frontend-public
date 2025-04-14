import type {
  AnaloguePodDataSelection, HazardPodDataSelection, PodDataTypes, PodSessionData,
  UpdatePodCalcParams,
} from './types';
import type {Dtxsid} from '~~/types';

export const usePodStore = defineStore('pod', () => {
  // Pod session data
  const hasVisited = ref(false);

  const resetPod = () => {
    hasVisited.value = false;
    podDataSelected.value = [];
    podChemsWithNoUncertaintyData.value = [];
  };

  const loadPodSession = (sessionData: PodSessionData) => {
    if (!sessionData) {
      return;
    }
    hasVisited.value = sessionData.hasVisited || false;
    podDataSelected.value = sessionData.podDataSelected || [];
    podChemsWithNoUncertaintyData.value = sessionData.podChemsWithNoUncertaintyData || [];
  };

  // Pod Data Selections
  const podDataSelected: Ref<PodDataTypes[]> = ref([]);
  const podChemsWithNoUncertaintyData: Ref<Dtxsid[]> = ref([]);

  const updateSelectedPodCalc = (updatedData: UpdatePodCalcParams): PodDataTypes => {
    const {
      uncertaintyFactorData, compositeUf, interimRfV, podId, conversionData,
    } = updatedData;

    const podData: PodDataTypes[] =
    JSON.parse(JSON.stringify(podDataSelected.value));
    const updatedPodIdx = podData.findIndex(pod => pod.id === podId);

    podData[updatedPodIdx] = {
      ...podData[updatedPodIdx] as PodDataTypes,
      ...conversionData,
      podValue: podData[updatedPodIdx]!.section === 'In Vivo Toxicity' ? (podData[updatedPodIdx] as HazardPodDataSelection).toxvalNumeric : (podData[updatedPodIdx] as AnaloguePodDataSelection).readAcrossValue,
      uncertaintyFactorData,
      compositeUf,
      interimRfV,
    };
    podDataSelected.value = podData;
    return podData[updatedPodIdx] as PodDataTypes;
  };

  const updatePodDataSelected = (updatedPods: PodDataTypes[]) => {
    const podData: PodDataTypes[] = JSON.parse(JSON.stringify(podDataSelected.value));
    const addingNewPods = updatedPods.filter(pod => !podData.map(({id}) => id).includes(pod.id));
    const removePods = podData.filter(pod => !updatedPods.map(({id}) => id).includes(pod.id));
    const updatedPodsSelections = podData
      .concat(addingNewPods)
      .filter(pod => !removePods.map(({id}) => id).includes(pod.id));
    podDataSelected.value = updatedPodsSelections;
  };

  const addRfVLabelOptions = ({newTag, id}: {
    newTag: string; id: string;
  }) => {
    const podData: PodDataTypes[] = JSON.parse(JSON.stringify(podDataSelected.value));
    const updatedPodIdx = podData.findIndex(pod => pod.id === id);
    podData[updatedPodIdx]!.rfvLabelOptions = removeDuplicates(podData[updatedPodIdx]!.rfvLabelOptions.concat(newTag));
    return podData[updatedPodIdx]!.rfvLabelOptions;
  };

  return {
    hasVisited,
    resetPod,
    loadPodSession,
    podDataSelected,
    podChemsWithNoUncertaintyData,
    updateSelectedPodCalc,
    updatePodDataSelected,
    addRfVLabelOptions,
  };
});
