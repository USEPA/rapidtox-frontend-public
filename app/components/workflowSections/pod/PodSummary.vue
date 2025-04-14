<template>
  <section>
    <SectionHeader
      section="Pod"
      header-align-self="center"
      title="Selected Hazard and Dose-Response Data"
      tooltip-text="The dose response summary value (DRSV) tab collects and displays all DRSVs selected by
      the user across the options provided in the In Vivo Toxicity tab (i.e., existent traditional assay-based DRSVs;
      read-across surrogate DRSVs; and/or bioactivity-based DRSVs). This tab also provides the option to derive interim
      non-cancer human health reference values using an uncertainty factor application modal."
    >
      <template #append>
        <v-col cols="auto">
          <BreadCrumbs
            :items="breadcrumbItems"
            :active-item="activeBreadCrumb"
            @update-active-item="updateActiveSection"
          />
        </v-col>
      </template>
    </SectionHeader>
    <Spinner v-if="isLoading" />
    <PodAnalogueGrid
      v-else-if="activeSection === POD_SECTIONS.ANALOGUE"
      :row-data="analoguePodData"
      :pod-data-selected="podDataSelected"
      :section="activeSection"
      @update-pod-data-selected="updatePodDataSelected"
    />
    <PodBioactivityGrid
      v-else-if="activeSection === POD_SECTIONS.BIOACTIVITY"
      :row-data="bioActivityData"
    />
    <PodUncertaintyGrid
      v-else-if="activeSection === POD_SECTIONS.UNCERTAINTY"
      :row-data="uncertaintyData"
    />
    <PodInVivoToxGrid
      v-else-if="activeSection === POD_SECTIONS.IN_VIVO_TOX"
      :row-data="hazardApiResponseData"
      :pod-data-selected="podDataSelected"
      :section="activeSection"
      :hazard-chart-data="hazardChartData"
      :hazard-data-selected="hazardDataSelected"
      @update-pod-data-selected="updatePodDataSelected"
    />
    <NoDataFoundDialog
      id="pod-data-no-data-found"
      section="POD"
      :show="showNoDataDialog"
      @close-dialog="showNoDataDialog = false"
    />
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '../SectionHeader.vue';
import BreadCrumbs from '../shared/components/BreadCrumbs.vue';
import type {InternalBreadcrumbItem} from '../shared/components/types';
import {sectionVisitedHandler} from '../shared/helpers';
import NoDataFoundDialog from '../shared/dialog/NoDataFoundDialog.vue';
import type {PodSection, PodSectionName} from './types';
import PodAnalogueGrid from './grids/PodAnalogueGrid.vue';
import PodBioactivityGrid from './grids/PodBioactivityGrid.vue';
import PodUncertaintyGrid from './grids/PodUncertaintyGrid.vue';
import PodInVivoToxGrid from './grids/PodInVivoToxGrid.vue';
import {POD_SECTIONS} from './constants';
import {uncertaintyMapper} from './helpers/helpers';
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';
import type {
  Dtxsid, DtxsidMap, PodData,
} from '~~/types';

/** Sections - In Vivo Tox, Bioactivity, Analogue, Uncertainty **/

// Analogue
const analogueStore = useAnalogueStore();
const {analogueChemicalsStepInfo} = storeToRefs(analogueStore);

const analoguePodData = computed(() => {
  return analogueChemicalsStepInfo.value.reduce((acc, cv) => {
    if (cv.selectedPODS?.length) {
      const raDtxsidArr = cv.selectedPODS.map(pod => pod.dtxsid);
      const podArr = raDtxsidArr.map(dtxsid => ({
        ...cv,
        preferredName: cv.preferredName || cv.searchWord,
        dtxsid: cv.dtxsid || cv.unmatchedDtxsid,
        readAcrossDtxsid: dtxsid,
        readAcrossPrefName: cv.selectedAnalogues.find(({dtxsid: analogueDtxsid}) => analogueDtxsid === dtxsid)?.name,
        readAcrossType: cv.selectedPODS?.find(({dtxsid: podDtxsid}) => podDtxsid === dtxsid)?.type || '',
        readAcrossValue: cv.selectedPODS?.find(({dtxsid: podDtxsid}) => podDtxsid === dtxsid)?.value || '',
        readAcrossUnits: cv.selectedPODS?.find(({dtxsid: podDtxsid}) => podDtxsid === dtxsid)?.units || '',
        readAcrossExpoRoute: cv.selectedPODS?.find(({dtxsid: podDtxsid}) => podDtxsid === dtxsid)?.exposureRoute || '',
        readAcrossSpecies: cv.selectedPODS?.find(({dtxsid: podDtxsid}) => podDtxsid === dtxsid)?.speciesCommon || '',
        readAcrossCE: cv.selectedPODS?.find(({dtxsid: podDtxsid}) => podDtxsid === dtxsid)?.criticalEffect || '',
        readAcrossSource: cv.selectedPODS?.find(({dtxsid: podDtxsid}) => podDtxsid === dtxsid)?.source || '',
        podId: cv.selectedPODS?.find(({dtxsid: podDtxsid}) => podDtxsid === dtxsid)?.id,
        toxvalUnits: cv.selectedPODS?.find(({dtxsid: podDtxsid}) => podDtxsid === dtxsid)?.units || '',
      })) as unknown as AnaloguePodDataSelection[];
      acc.push(...podArr);
    }

    return acc;
  }, [] as AnaloguePodDataSelection[]);
});
const isAnalogueDisabled = computed(() => !analoguePodData.value.length);

// Bioactivity
const bioactivityStore = useBioactivityStore();
const {selectedDtxsids} = storeToRefs(useChemicalSearchStore());
const {selectedBerCalcData} = storeToRefs(bioactivityStore);
const bioActivityData = computed(() => selectedDtxsids.value.reduce((acc, cv) => {
  const selectedBerRow = selectedBerCalcData.value.find(chem => chem.dtxsid === cv);
  if (selectedBerRow) {
    const bioactivityRows = selectedBerRow.rows.filter(({addRow}) => !addRow);
    acc.push(...bioactivityRows);
  }
  return acc;
}, [] as BerCalcRow[]));
const isBioactivityDisabled = computed(() => !bioActivityData.value.length);

// Uncertainty
const podStore = usePodStore();
const {updatePodDataSelected} = podStore;
const {podDataSelected} = storeToRefs(podStore);

const uncertaintyData = computed(() => uncertaintyMapper(podDataSelected.value));
const isUncertaintyDisabled = computed(() => !podDataSelected.value.length);

// In Vivo Toxicity
const hazardStore = useHazardStore();
const {hazardChartData, hazardDataSelected} = storeToRefs(hazardStore);
const isLoading = ref(true);
const hazardApiResponseData = ref<PodData[]>([]);
const isHazardDisabled = computed(() => !hazardApiResponseData.value.length &&
  !hazardChartData.value.some(({superCategory}) => superCategory === SUPER_HAZARD_TYPES.CUSTOM_POD_NAME));

const getHazardIds = () => {
  if (Object.keys(hazardDataSelected.value).length) {
    const hazardData = hazardDataSelected.value as DtxsidMap;
    const ids = Object.keys(hazardData).reduce((acc, cv) => {
      if (hazardData[cv as Dtxsid]) {
        acc.push(...hazardData[cv as Dtxsid] as number[]);
      }
      return acc;
    }, [] as number[]);
    return removeDuplicates(ids);
  }
  return [];
};

/**  Mounted Setup - get hazard data, show no data dialog if necessary or set active section to first available section. */
const showNoDataDialog = ref(false);
const loadHazardData = async() => {
  const {$repositories} = useNuxtApp();
  const hazardResponseData = await $repositories.pod.getPODHazardData(getHazardIds());
  hazardApiResponseData.value = hazardResponseData;
};

const setFirstAvailableSection = () => {
  const firstAvailableSection = sections.value.find(({disabled}) => !disabled);
  if (firstAvailableSection) {
    activeSection.value = firstAvailableSection.section;
  }
};

const showNoDataDialogIfNecessary = () => {
  if (sections.value.every(({disabled}) => !!disabled)) {
    showNoDataDialog.value = true;
  }
};

onMounted(async() => {
  try {
    isLoading.value = true;
    await loadHazardData();
    setFirstAvailableSection();
    showNoDataDialogIfNecessary();
  } finally {
    isLoading.value = false;
  }
});

/**  Sections State */
const activeSection = ref<PodSectionName>(POD_SECTIONS.IN_VIVO_TOX);
const updateActiveSection = (title: string) => {
  const incomingSection = sections.value.find(({label}) => label === title) as PodSection;
  activeSection.value = incomingSection.section;
};

const breadcrumbItems = computed<InternalBreadcrumbItem[]>(() => {
  return sections.value.map(({
    label, disabled,
  }) => ({
    title: label,
    disabled,
  }));
});

const activeBreadCrumb = computed(() => breadcrumbItems.value
  .find(({title}) => title === activeSectionObj.value.label) as InternalBreadcrumbItem);

const sections = computed<PodSection[]>(() => ([
  {
    section: POD_SECTIONS.IN_VIVO_TOX,
    label: '<i>In Vivo Toxicity</i>',
    disabled: isHazardDisabled.value,
  },
  {
    section: POD_SECTIONS.ANALOGUE,
    label: 'Analogue',
    disabled: isAnalogueDisabled.value,
  },
  {
    section: POD_SECTIONS.BIOACTIVITY,
    label: 'Bioactivity',
    disabled: isBioactivityDisabled.value,
  },
  {
    section: POD_SECTIONS.UNCERTAINTY,
    label: 'Uncertainty',
    disabled: isUncertaintyDisabled.value,
  },
]));

const activeSectionObj = computed(() => sections.value.find(({section}) => section === activeSection.value) as PodSection);

/**  Handle refresh / session */
const {hasVisited} = storeToRefs(usePodStore());
onBeforeMount(() => {
  sectionVisitedHandler('pod', hasVisited);
});
</script>

<style scoped>

</style>
