import {defineStore} from 'pinia';
import {type Ref, ref} from 'vue';
import type {
  TabKey, Tab, SnackbarType,
} from './types';
import {useAnalogueStore} from './analogue/analogue';
import {useBioactivityStore} from './bioActivity/bioActivity';
import {useEnvFateStore} from './envFate/envFate';
import {useHazardStore} from './hazard/hazard';
import {usePhyschemStore} from './physchem/physchem';
import {usePodStore} from './pod/pod';
import {useReportStore} from './report/report';
import {useChemicalSearchStore} from './chemicalSearch/chemicalSearch';

export const useAppBaseStore = defineStore('appBaseStore', () => {
  // Tabs
  const activeTab: Ref<TabKey> = ref('chemSearch');
  const tabOrder: Ref<Tab[]> = ref([
    {
      tabKey: 'chemSearch', tabDisplayName: 'Search', stepperIcon: 'mdi/magnify',
    },
    {
      tabKey: 'chemSearchResults', tabDisplayName: 'Search Results', stepperIcon: 'mdi/clipboard-text-search',
    },
    {
      tabKey: 'physChem', tabDisplayName: 'Physchem', stepperIcon: 'mdi/flask',
    },
    {
      tabKey: 'envFate', tabDisplayName: 'Env. Fate', stepperIcon: 'mdi/earth',
    },
    {
      tabKey: 'hazard', tabDisplayName: 'In Vivo Toxicity', stepperIcon: 'mdi/biohazard',
    },
    {
      tabKey: 'analogue', tabDisplayName: 'Analogue', stepperIcon: 'mdi/hubspot',
    },
    {
      tabKey: 'bioAct', tabDisplayName: 'Bioactivity', stepperIcon: 'mdi/dna',
    },
    {
      tabKey: 'pod', tabDisplayName: 'Summary', stepperIcon: 'mdi/chart-scatter-plot',
    },
    {
      tabKey: 'report', tabDisplayName: 'Report', stepperIcon: 'mdi/chart-areaspline',
    },
  ]);
  const tabsVisited: Ref<TabKey[]> = ref([]);

  const resetTabsVisited = () => {
    tabsVisited.value = [];
  };

  const addTabVisited = (tabKey: TabKey) => {
    if (!tabsVisited.value.includes(tabKey)) {
      tabsVisited.value.push(tabKey);
    }
  };

  const reloadVisitedTabs = () => {
    const {hasVisited: hasVisitedAnalogue} = useAnalogueStore();
    const {hasVisited: hasVisitedBioactivity} = useBioactivityStore();
    const {hasVisited: hasVisitedHazard} = useHazardStore();
    const {hasVisited: hasVisitedEnvFate} = useEnvFateStore();
    const {hasVisited: hasVisitedPhyschem} = usePhyschemStore();
    const {hasVisited: hasVisitedPod} = usePodStore();
    const {hasVisited: hasVisitedReport} = useReportStore();
    const {hasChemSearchResultsVisited, hasChemSearchVisited} = useChemicalSearchStore();
    if (hasVisitedHazard) { addTabVisited('hazard'); }
    if (hasVisitedPhyschem) { addTabVisited('physChem'); }
    if (hasVisitedEnvFate) { addTabVisited('envFate'); }
    if (hasVisitedAnalogue) { addTabVisited('analogue'); }

    if (hasVisitedBioactivity) { addTabVisited('bioAct'); }
    if (hasVisitedPod) { addTabVisited('pod'); }
    if (hasVisitedReport) { addTabVisited('report'); }
    if (hasChemSearchVisited) { addTabVisited('chemSearch'); }
    if (hasChemSearchResultsVisited) { addTabVisited('chemSearchResults'); }
  };

  const nextStep = () => {
    const currentTab = activeTab.value;
    const tabs = tabOrder.value;
    const currentIdx = tabs.findIndex(tab => tab.tabKey === currentTab);
    activeTab.value = tabs[currentIdx + 1]!.tabKey;
  };

  const previousStep = () => {
    const currentTab = activeTab.value;
    const tabs = tabOrder.value;
    const currentIdx = tabs.findIndex(tab => tab.tabKey === currentTab);
    activeTab.value = tabs[currentIdx - 1]!.tabKey;
  };

  const resetWorkflowState = () => {
    const {resetAnalogue} = useAnalogueStore();
    const {resetBioactivity} = useBioactivityStore();
    const {resetHazard} = useHazardStore();
    const {resetEnvFate} = useEnvFateStore();
    const {resetPhyschem} = usePhyschemStore();
    const {resetPod} = usePodStore();
    const {resetReport} = useReportStore();
    const {resetChemical} = useChemicalSearchStore();
    resetChemical();
    resetPhyschem();
    resetEnvFate();
    resetAnalogue();
    resetBioactivity();
    resetHazard();
    resetReport();
    resetPod();
    resetTabsVisited();
  };

  // Header and Footer
  const showEpaHeaderFooter = ref(true);
  const showEpaHeaderFooterSnackbar = ref(false);
  const epaHeaderFooterSnackbarContentClass = ref('epa-header-footer-snackbar-content-class');

  // Redirect Errors
  const showRedirectErrorModal = ref(false);
  const redirectErrorModalMsg = ref('');
  const redirectErrorModalShouldRedirect = ref(true);

  const displayRedirectErrorModal = ({
    show = true, errorMsg = 'Sorry, there has been an error loading this page.', redirectHome = true,
  }: {
    show?: boolean;
    errorMsg?: string;
    redirectHome?: boolean;
  } = {
    show: true,
    errorMsg: 'Sorry, there has been an error loading this page.',
    redirectHome: true,
  }) => {
    redirectErrorModalShouldRedirect.value = redirectHome;
    redirectErrorModalMsg.value = errorMsg;
    showRedirectErrorModal.value = show;
  };

  // SnackBar Orchestration (Stackable) - ONLY USE FOR Snackbars imitating toasts that have location: 'top right'
  const snackbarsQueue = ref<SnackbarType[]>([]);

  const addToQueue = (contentClass: string) => {
    if (snackbarsQueue.value.some(snackbar => snackbar.contentClass === contentClass)) {
      return;
    }

    // Always have Epa Header/Footer Snackbar on top
    if (contentClass === epaHeaderFooterSnackbarContentClass.value) {
      snackbarsQueue.value.unshift({
        contentClass,
      });
      return;
    }
    snackbarsQueue.value.push({
      contentClass,
    });
  };
  const removeFromQueue = (contentClass: string) => {
    const snackbarIdx = snackbarsQueue.value
      .findIndex(snackbar => snackbar.contentClass === contentClass);
    if (snackbarIdx !== -1) {
      snackbarsQueue.value.splice(snackbarIdx, 1);
    }
  };

  // Gets Relative margin for top right snackbars only
  const getMargin = (contentClass: string): string => {
    const defaultTopMargin = '50px';
    const snackbarIdx = snackbarsQueue.value.findIndex(snackbar => snackbar.contentClass === contentClass);
    if (snackbarIdx === 0 || !snackbarsQueue.value.length) {
      return defaultTopMargin;
    }

    // When triggered on leave transition find last element otherwise find element displayed before
    const idxToFind = snackbarIdx === -1 ? snackbarsQueue.value.length - 1 : snackbarIdx - 1;

    const elementToPositionUnder = document.querySelector(`.${snackbarsQueue.value[idxToFind]?.contentClass}`);
    if (elementToPositionUnder) {
      const {height, top} = elementToPositionUnder.getBoundingClientRect();
      return `${(height + top + 12).toString()}px`;
    }

    return defaultTopMargin;
  };

  return {
    activeTab,
    tabOrder,
    tabsVisited,
    resetTabsVisited,
    nextStep,
    previousStep,
    resetWorkflowState,
    addTabVisited,
    showEpaHeaderFooter,
    showRedirectErrorModal,
    redirectErrorModalMsg,
    redirectErrorModalShouldRedirect,
    reloadVisitedTabs,
    displayRedirectErrorModal,
    showEpaHeaderFooterSnackbar,
    epaHeaderFooterSnackbarContentClass,
    getMargin,
    addToQueue,
    snackbarsQueue,
    removeFromQueue,
  };
});
