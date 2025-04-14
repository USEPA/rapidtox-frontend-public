import type {PodSectionName} from '../pod/types';
import {sectionGroupDefaultExpandedMap} from './constants';
import {mapChartData} from './mappers';
import type {
  Dtxsid,
} from '~~/types';

export const getGridHeight = () => {
  return 900;
};

export const getWorkflowBgColor = () => {
  const {workflowId} = useWorkflowData();
  return `bg-${workflowId}`;
};

// Default grid style
export const defaultGridstyle = ({
  height = '900px',
  width = '100%',
  paddingBottom = '20px !important',
  additionalStyles,
}: {
  height?: string;
  width?: string;
  paddingBottom?: string;
  additionalStyles?: string;
} = {}) => {
  return `height: ${height}; width: ${width}; padding-bottom: ${paddingBottom} ${additionalStyles ? `;${additionalStyles}` : ''}`;
};

// Used to mark section as visited when mounted
export const sectionVisitedHandler = (section: TabKey, hasVisited: Ref<boolean>) => {
  const route = useRoute();

  const {saveSession} = useSessionStore();

  const {addTabVisited} = useAppBaseStore();
  if (!hasVisited.value) {
    hasVisited.value = true;
    addTabVisited(section);
  }

  if (!route.query.activeTab) {
    saveSession(section);
  }
};

// Used on In Vivo & POD Summary sections to obtain chart images and alt text for inhalation/oral
export const getChartImages = async({
  nodeDataDtxsid, section, showCustomData = false,
}: {
  nodeDataDtxsid: Dtxsid;
  section: PodSectionName;
  showCustomData?: boolean;
}) => {
  const {$repositories} = useNuxtApp();
  const {
    user: currentUser,
  } = useOidcAuth();
  const currentUserName = currentUser?.value?.claims?.email as string;

  const predictedExposure = showCustomData ?
    useHazardStore().chartExposure.find(({dtxsid}) => dtxsid === nodeDataDtxsid)?.value :
    null;

  const mappedChartData = mapChartData({
    customChartData: useHazardStore().hazardChartData,
    hazardDataSelected: useHazardStore().hazardDataSelected,
    physchemDataSelected: usePhyschemStore().physchemDataSelected,
    analogueSteps: useAnalogueStore().analogueChemicalsStepInfo,
    nodeDataDtxsid,
    section,
    username: currentUserName,
    ...(predictedExposure && {predictedExposure: Number(predictedExposure)}),
  });

  const oralChart = $repositories.pod.getChemicalChart({
    ...mappedChartData,
    chartType: 'Oral',
  });

  const inhalationChart = $repositories.pod.getChemicalChart({
    ...mappedChartData,
    chartType: 'Inhalation',
  });

  const [oralResponse, inhalationResponse] = await Promise.allSettled([oralChart, inhalationChart]);

  return {
    oralChart: oralResponse?.status === 'fulfilled' ? oralResponse.value : null,
    inhalationChart: inhalationResponse?.status === 'fulfilled' ? inhalationResponse.value : null,
  };
};

/**
 * @param tabKey section
 * @returns number for default row group expansion
 * https://www.ag-grid.com/vue-data-grid/grid-options/#reference-rowGrouping-groupDefaultExpanded
 */
export const getDefaultGroupExpansion = (tabKey: TabKey) => {
  const isSingleSearch = useChemicalSearchStore().isSingleSearch;

  if (!sectionGroupDefaultExpandedMap[tabKey]) {
    return 0;
  }

  if (isSingleSearch) {
    return sectionGroupDefaultExpandedMap[tabKey].singleChemcal;
  }

  return sectionGroupDefaultExpandedMap[tabKey].multiChemical;
};
