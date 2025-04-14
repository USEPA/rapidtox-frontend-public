import type {SelectedChemical} from '../chemicalSearch/types';
import {useChemicalSearchStore} from '../chemicalSearch/chemicalSearch';
import type {
  AnaloguePodData, AnalogueSelectedChemical, AnalogueSessionData, AnalogueStepInfo, SelectedAnalogue, UpdateStepInfoParams,
} from './types';
import type {Dtxsid} from '~~/types';

export const useAnalogueStore = defineStore('analogue', () => {
  // Analogue Session Data
  const hasVisited = ref(false);
  const loadAnalogueSession = (sessionData: AnalogueSessionData) => {
    if (!sessionData) {
      return;
    }
    analogueChemicalsStepInfo.value = sessionData.analogueChemicalsStepInfo;
    currentAnaloguePodData.value = sessionData.currentAnaloguePodData;
    currentAnalogueSelectedChemical.value = sessionData.currentAnalogueSelectedChemical;
    currentKetcherSmileString.value = sessionData.currentKetcherSmileString;
    errorMessage.value = sessionData.errorMessage;
    errorMolFile.value = sessionData.errorMolFile;
    ketcher.value = sessionData.ketcher;
    showAnalogueModal.value = sessionData.showAnalogueModal;
    showAnaloguePodModal.value = sessionData.showAnaloguePodModal;
    hasVisited.value = sessionData.hasVisited;
  };

  const resetAnalogue = () => {
    showAnaloguePodModal.value = false;
    currentAnaloguePodData.value = {
      title: '',
      dtxsid: '',
      podData: [],
    };
    ketcher.value = null;
    currentKetcherSmileString.value = '';
    showAnalogueModal.value = false;
    currentAnalogueSelectedChemical.value = {};
    analogueChemicalsStepInfo.value = [];
    errorMolFile.value = false;
    errorMessage.value = '';
    hasVisited.value = false;
  };

  // Selected Analogue Data
  const showAnaloguePodModal = ref(false);

  const currentAnaloguePodData: Ref<AnaloguePodData> = ref({
    title: '',
    dtxsid: '',
    podData: [],
  });

  // Ketcher
  const ketcher: Ref<object | null> = shallowRef(null);
  const currentKetcherSmileString = ref('');

  const setKetcher = (ketcherObj: object | null) => {
    ketcher.value = ketcherObj;
  };
  const setCurrentSmileString = async() => {
    // @ts-ignore
    const smileString = await ketcher?.value?.getSmilesAsync();
    const analogueChemsStepInfo = JSON.parse(JSON.stringify(analogueChemicalsStepInfo.value));

    const analogueIdxToUpdate = analogueToUpdateIdx.value;
    analogueChemsStepInfo[analogueIdxToUpdate].smileString = smileString;
    if (smileString !== currentKetcherSmileString.value) {
      analogueChemicalsStepInfo.value = analogueChemsStepInfo;
    }
  };
  const loadKetcherImage = async(smileStr: string) => {
    try {
      const {$repositories} = useNuxtApp();
      const molFile = await $repositories.analogue.getMolFile(smileStr);
      // @ts-expect-error - TODO: Remove when ketcher gets typed
      await ketcher.value.setMolecule(molFile);
    } catch {
      errorMessage.value = 'Error Retrieving Structure';
      errorMolFile.value = true;
    }
  };

  // Analogue Modal
  const showAnalogueModal = ref(false);

  const currentAnalogueSelectedChemical: Ref<AnalogueSelectedChemical | Record<string, never>> = ref({});

  const displayAnalogueModal = (analogueSelectedChemical: AnalogueSelectedChemical) => {
    currentAnalogueSelectedChemical.value = analogueSelectedChemical;
    showAnalogueModal.value = true;
  };

  const closeAnalogueModal = () => {
    showAnalogueModal.value = false;
  };

  // Analogue Chemicals data throughout the different Analogue steps
  const analogueChemicalsStepInfo: Ref<AnalogueStepInfo[]> = ref([]);

  const analogueToUpdateIdx = computed(() => analogueChemicalsStepInfo.value.findIndex((chem) => {
    const currentAnalogue = currentAnalogueSelectedChemical as Ref<AnalogueSelectedChemical>;
    if (chem.dtxsid) {
      return chem.dtxsid === currentAnalogue.value.dtxsid;
    }
    return chem.searchWord === currentAnalogue.value.searchWord;
  }));

  const setCurrentUnmatchedDtxsid = (dtxsid: Dtxsid) => {
    const analogueChemsStepInfo = JSON.parse(JSON.stringify(analogueChemicalsStepInfo.value));

    analogueChemsStepInfo[analogueToUpdateIdx.value].unmatchedDtxsid = dtxsid;
    analogueChemicalsStepInfo.value = analogueChemsStepInfo;
  };

  const updateAnalogueChemicalsStepInfo = ({
    finishedStepOne, finishedStepTwo, nextStep, selectedAnalogues, unselectedAnalogues,
    selectedReadAcross, unselectedReadAcross, selectedPODS, unselectedPODS, PODJustifications,
  }: UpdateStepInfoParams) => {
    const chemicalUpdateIdx = analogueToUpdateIdx.value;

    const updatedAnalogueChemicalsStepInfo: AnalogueStepInfo[] = JSON.parse(JSON.stringify(analogueChemicalsStepInfo.value));

    const currentSelectedAnalogues = unselectedAnalogues ?
      updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]
        ?.selectedAnalogues
        .filter(analogue => !unselectedAnalogues
          .includes(analogue.dtxsid)) :
      updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]?.selectedAnalogues;

    const currentSelectedReadAcross = unselectedReadAcross ?
      updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]
        ?.selectedReadAcross
        .filter(readAcross => !unselectedReadAcross
          .includes(readAcross.dtxsid)) :
      updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]?.selectedReadAcross;

    updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]!.currentStep = (nextStep === 0 || nextStep) ?
      nextStep :
      updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]?.currentStep as number;

    updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]!.finishedStepOne =
    finishedStepOne || updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]?.finishedStepOne as boolean;

    updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]!.finishedStepTwo =
    finishedStepTwo || updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]?.finishedStepTwo as boolean;

    updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]!.selectedAnalogues = selectedAnalogues ?
      currentSelectedAnalogues?.concat(selectedAnalogues) as SelectedAnalogue[] :
      currentSelectedAnalogues as SelectedAnalogue[];

    // Remove possible duplicates of selected analogues
    updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]!.selectedAnalogues =
    updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]!.selectedAnalogues
      .filter((analogue, index, localSelf) => index === localSelf.findIndex(dupAnalogue => (
        dupAnalogue.dtxsid === analogue.dtxsid
      )));

    updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]!.selectedReadAcross =
    selectedReadAcross ?
      currentSelectedReadAcross!.concat(selectedReadAcross) as unknown[] :
      currentSelectedReadAcross as unknown[];

    const currentSelectedPODS = unselectedPODS ?
      (updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]?.selectedPODS
        .filter(({id}) => !unselectedPODS
          .includes(id)) || []) :
      (updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]?.selectedPODS || []);

    if (updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]) {
      const updatedPODS = selectedPODS ? currentSelectedPODS.concat(selectedPODS) : currentSelectedPODS;
      updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx].selectedPODS =
      updatedPODS.filter(({dtxsid}) => !(unselectedAnalogues || []).includes(dtxsid));
    }

    const uniqueSelectedPods = updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]!.selectedPODS
      .reduce((r, i) => (!r.some(j => JSON.stringify(i) === JSON.stringify(j)) ? [...r, i] : r)
        , [] as SelectedPod[]);
    if (PODJustifications) {
      updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]!.PODJustifications = PODJustifications;
    }
    if (updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]) {
      updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx].selectedPODS = uniqueSelectedPods;
    }

    // remove justifications if selectedPods were updated
    if (selectedPODS && unselectedPODS && updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]!.PODJustifications) {
      const justifications = updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]!.PODJustifications;
      const filtered = justifications.filter(item => uniqueSelectedPods.some(POD => POD.dtxsid === item.dtxsid));
      updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]!.PODJustifications = filtered;
    }
    analogueChemicalsStepInfo.value = updatedAnalogueChemicalsStepInfo;
  };

  const removeSelectedAnalogue = (analogueToRemove: AnalogueStepInfo | SelectedAnalogue) => {
    const updatedAnalogueChemicalsStepInfo: AnalogueStepInfo[] = JSON.parse(JSON.stringify(analogueChemicalsStepInfo.value));
    const chemicalUpdateIdx = analogueToUpdateIdx.value;

    updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]!.selectedPODS =
    updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]!.selectedPODS
      .filter(({dtxsid}) => dtxsid !== analogueToRemove.dtxsid);
    updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]!.selectedAnalogues =
    updatedAnalogueChemicalsStepInfo[chemicalUpdateIdx]!.selectedAnalogues
      .filter(analogue => analogue.dtxsid !== analogueToRemove.dtxsid);
    analogueChemicalsStepInfo.value = updatedAnalogueChemicalsStepInfo;
  };

  const initialAnalogueChemicalsStepInfo = (selectedChemicals: SelectedChemical[]) => {
    const initialStepInfo: AnalogueStepInfo[] = selectedChemicals.map((chemical, index) => ({
      analogueChemId: index,
      currentStep: 0,
      searchWord: chemical.searchWord,
      preferredName: chemical.preferredName,
      smileString: chemical.smiles,
      unmatchedDtxsid: chemical.unmatchedDtxsid,
      finishedStepOne: false,
      dtxsid: chemical.dtxsid,
      finishedStepTwo: false,
      finishedAnalogueSelection: false,
      selectedAnalogues: [],
      selectedReadAcross: [],
      selectedPODS: [],
      PODJustifications: [],
    }));
    analogueChemicalsStepInfo.value = initialStepInfo;
  };

  const setupAnalogueChemicalsStepInfo = () => {
    const {selectedChemicals} = useChemicalSearchStore();

    // eslint-disable-next-line no-unused-expressions
    analogueChemicalsStepInfo.value.length ?
      checkAndUpdateAnalogueChemicalsStepInfo(selectedChemicals) :
      initialAnalogueChemicalsStepInfo(selectedChemicals);
  };

  const checkAndUpdateAnalogueChemicalsStepInfo = (selectedChemicals: SelectedChemical[]) => {
    const analgoueChemStepInfoSearchWords = analogueChemicalsStepInfo.value
      .map(chemical => chemical.searchWord);
    const selectedChemicalsSearchWords = [...selectedChemicals.map(chemical => chemical.searchWord)];
    const currentAnalogChemStepInfo = selectedChemicals.reduce((acc, cv) => {
      analgoueChemStepInfoSearchWords.forEach((chem) => {
        if (!selectedChemicalsSearchWords.includes(chem)) {
          // eslint-disable-next-line no-param-reassign
          acc = acc.filter(word => word.searchWord !== chem);
        }
      });

      if (!analgoueChemStepInfoSearchWords.includes(cv.searchWord)) {
        acc.push({
          analogueChemId: Math.max(...acc.map(chemical => chemical.analogueChemId as number)) + 1,
          currentStep: 0,
          searchWord: cv.searchWord,
          preferredName: cv.preferredName,
          finishedStepOne: false,
          dtxsid: cv.dtxsid,
          smileString: cv.smiles,
          unmatchedDtxsid: cv.unmatchedDtxsid,
          finishedStepTwo: false,
          finishedAnalogueSelection: false,
          selectedAnalogues: [],
          selectedReadAcross: [],
          selectedPODS: [],
          PODJustifications: [],
        });
      }

      return [...acc];
    }, [...analogueChemicalsStepInfo.value] as AnalogueStepInfo[]);
    analogueChemicalsStepInfo.value = currentAnalogChemStepInfo;
  };

  // Mole file error
  const errorMolFile = ref(false);

  const errorMessage = ref('');

  const clearMolFileError = () => {
    errorMolFile.value = false;
    errorMessage.value = '';
  };

  return {
    showAnaloguePodModal,
    currentAnalogueSelectedChemical,
    ketcher,
    showAnalogueModal,
    displayAnalogueModal,
    currentAnaloguePodData,
    closeAnalogueModal,
    analogueChemicalsStepInfo,
    analogueToUpdateIdx,
    setCurrentUnmatchedDtxsid,
    updateAnalogueChemicalsStepInfo,
    removeSelectedAnalogue,
    setupAnalogueChemicalsStepInfo,
    checkAndUpdateAnalogueChemicalsStepInfo,
    errorMolFile,
    errorMessage,
    clearMolFileError,
    hasVisited,
    loadAnalogueSession,
    setCurrentSmileString,
    loadKetcherImage,
    setKetcher,
    resetAnalogue,
  };
});
