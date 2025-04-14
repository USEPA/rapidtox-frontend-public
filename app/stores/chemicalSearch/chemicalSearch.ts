import type {
  ChemicalSearchSessionData, Idenitifer, SelectedChemical,
} from './types';

export const useChemicalSearchStore = defineStore('chemicalSearch', () => {
  // Chemical Search Session
  const hasChemSearchVisited = ref(false);
  const hasChemSearchResultsVisited = ref(false);

  const loadChemicalSearchSession = (sessionData: ChemicalSearchSessionData) => {
    identifiers.value = sessionData.identifiers;
    multiSearchInput.value = sessionData.multiSearchInput;
    selectedChemicals.value = sessionData.selectedChemicals;
    hasChemSearchVisited.value = sessionData.hasChemSearchVisited;
    hasChemSearchResultsVisited.value = sessionData.hasChemSearchResultsVisited;
  };

  const resetChemical = () => {
    selectedChemicals.value = [];
    hasChemSearchResultsVisited.value = false;
    identifiers.value = {};
  };

  // Search Variables - most can be computed from selectedChemicals
  const multiSearchInput = ref('');
  const selectedChemicals: Ref<SelectedChemical[]> = ref([]);
  const identifiers: Ref<Idenitifer | Record<string, never>> = ref({});

  const chemSearchDisabled = computed(() => selectedChemicals.value?.length < 1);
  const identifiersCount = computed(() => {
    if (!identifiers.value) { return 0; }

    if (!Object.keys(identifiers.value)?.length || !identifiers.value?.searchItems) {
      return 0;
    }
    return identifiers.value.searchItems.split('\n')?.length;
  });

  const selectedMatchedChemicals = computed(() => {
    if (!selectedChemicals.value?.length || !selectedChemicals.value.some(chemical => chemical.searchGroup !== 'NOT FOUND')) {
      return [];
    }
    return selectedChemicals.value.filter(chemical => chemical.searchGroup !== 'NOT FOUND');
  });

  const matchedCount = computed(() => selectedMatchedChemicals.value?.length);

  const selectedUnmatchedChemicals = computed(() => {
    if (!Array.isArray(selectedChemicals.value)) {
      return [];
    }
    return selectedChemicals.value.filter(chemical => chemical.searchGroup === 'NOT FOUND');
  });
  const unmatchedChemicalsCount = computed(() => selectedUnmatchedChemicals.value?.length);
  const selectedChemicalsNameList = computed(() => {
    if (!selectedChemicals.value?.length || selectedChemicals.value
      .every(chemical => !chemical.preferredName || !chemical.searchWord)) {
      return [];
    }
    return selectedChemicals.value
      .filter(chemical => chemical.searchGroup !== 'NOT FOUND')
      .map(chemical => chemical.preferredName || chemical.searchWord);
  });
  const selectedDtxsids = computed(() => {
    if (!selectedChemicals.value?.length || selectedChemicals.value
      .every(chemical => !chemical.preferredName || !chemical.searchWord)) {
      return [];
    }
    return selectedChemicals.value
      .map(chemical => chemical.dtxsid)
      .filter(chemical => chemical);
  });

  const isSingleSearch = computed(() => selectedChemicals.value?.length === 1);

  const chemicalSelect = ({
    searchText, searchIdentifiers,
  }: {
    searchText: string; searchIdentifiers: string[];
  }) => {
    const searchStrings = searchIdentifiers.join('\n');
    const {resetWorkflowState} = useAppBaseStore();
    resetWorkflowState();

    const {$repositories} = useNuxtApp();
    const {$patch: baseStorePatch} = useAppBaseStore();

    // Saving recent search
    const {user: currentUser} = useOidcAuth();
    const currentUserName = currentUser?.value?.claims?.email as string;
    if (currentUserName) {
      $repositories.recentSearch.saveRecentChemicalSearch(searchText);
    }

    // Setting data for the chemical search results section
    multiSearchInput.value = searchStrings;
    identifiers.value = {searchItems: searchStrings};
    baseStorePatch({activeTab: 'chemSearchResults'});
  };

  return {
    hasChemSearchVisited,
    hasChemSearchResultsVisited,
    loadChemicalSearchSession,
    resetChemical,
    isSingleSearch,
    chemSearchDisabled,
    multiSearchInput,
    selectedDtxsids,
    selectedChemicals,
    selectedChemicalsNameList,
    selectedMatchedChemicals,
    selectedUnmatchedChemicals,
    unmatchedChemicalsCount,
    identifiers,
    identifiersCount,
    chemicalSelect,
    matchedCount,
  };
});
