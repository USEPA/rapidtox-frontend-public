<template>
  <section>
    <SectionHeader
      section="Bioactivity"
      header-align-self="center"
      title="Bioactivity Summary"
      tooltip-text="The bioactivity tab provides in vitro cell-based assay information, where and when available,
      such as tabular and visual (plot) summaries of bioactivity (e.g., active counts, percentiles), alerts for
      modeled activity in endocrine systems (e.g., estrogen or androgen binding and activity), and opportunities
      to calculate bioactivity-exposure-ratios (BERs) based on ToxCast bioactivity and SEEM3 exposure data."
    >
      <template #prepend>
        <BreadCrumbs
          :items="breadcrumbItems"
          :active-item="activeBreadCrumb"
          @update-active-item="updateActiveSection"
        />
      </template>
    </SectionHeader>
    <Spinner v-if="isLoading" />
    <SummarySection
      v-else-if="activeSection === BIOACTIVITY_SECTIONS.SUMMARY"
      :row-data="summaryData"
      :has-error="errorLoadingData.SUMMARY"
    />
    <ToxcastSection
      v-else-if="activeSection === BIOACTIVITY_SECTIONS.TOXCAST"
      :row-data="toxcastData"
      :has-error="errorLoadingData.TOXCAST"
    />
    <Seem3BerSection
      v-else-if="activeSection === BIOACTIVITY_SECTIONS.SEEM3BER"
      :row-data="seem3BerData"
      :has-error="errorLoadingData.SEEM3BER"
    />
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '../SectionHeader.vue';
import type {InternalBreadcrumbItem} from '../shared/components/types';
import {sectionVisitedHandler} from '../shared/helpers';
import BreadCrumbs from '../shared/components/BreadCrumbs.vue';
import {
  BIOACTIVITY_SECTIONS,
} from './constants';
import type {
  BioactivitySectionError, BioactivitySectionTitle, BioactivitySectionBreadcrumb,
} from './types';
import SummarySection from './components/SummarySection.vue';
import Seem3BerSection from './components/Seem3BerSection.vue';
import ToxcastSection from './components/ToxcastSection.vue';
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';
import type {
  BioactivityBerRes, BioactivityBaseRes, BioactivityToxcastRes,
} from '~/api/Bioactivity/types';

/**  Get all Bioactivity Data on mount */
const isLoading = ref(true);
const errorLoadingData = ref<BioactivitySectionError>({
  SUMMARY: false,
  SEEM3BER: false,
  TOXCAST: false,
});

const {selectedDtxsids} = storeToRefs(useChemicalSearchStore());
const {initializeBerCalcData} = useBioactivityStore();
const {
  bioActivityChemsWithNoBer, bioActivityChemsWithNoToxcast, bioActivityChemsWithNoSummary,
} = storeToRefs(useBioactivityStore());

const summaryData = ref<BioactivityBaseRes[]>([]);
const toxcastData = ref<BioactivityToxcastRes[]>([]);
const seem3BerData = ref<BioactivityBerRes[]>([]);

const setChemsFromResponse = ({
  summary, toxcast, seem3Ber,
}: {
  summary: BioactivityBaseRes[];
  toxcast: BioactivityToxcastRes[];
  seem3Ber: BioactivityBerRes[];
}) => {
  bioActivityChemsWithNoBer.value = selectedDtxsids.value
    .filter(selectedChemical => !seem3Ber
      .map(chx => chx.dtxsid)
      .includes(selectedChemical));
  bioActivityChemsWithNoToxcast.value = selectedDtxsids.value
    .filter(selectedChemical => !toxcast
      .map(chx => chx.dtxsid)
      .includes(selectedChemical));
  bioActivityChemsWithNoSummary.value = selectedDtxsids.value
    .filter(selectedChemical => !summary
      .map(tx => tx.dtxsid)
      .includes(selectedChemical));
};

const getBioactivityData = async() => {
  const {$repositories} = useNuxtApp();
  const [summaryDataRes, toxcastDataRes, berDataRes] = await Promise.allSettled([
    $repositories.bioactivity.getBioactivityData(selectedDtxsids.value),
    $repositories.bioactivity.getToxCastBioactvityData(selectedDtxsids.value),
    $repositories.bioactivity.getBioactivityBerData(selectedDtxsids.value),
  ]);
  errorLoadingData.value.SEEM3BER = berDataRes.status === 'rejected';
  errorLoadingData.value.TOXCAST = toxcastDataRes.status === 'rejected';
  errorLoadingData.value.SUMMARY = summaryDataRes.status === 'rejected';
  summaryData.value = summaryDataRes.status === 'fulfilled' ? summaryDataRes.value : [];
  toxcastData.value = toxcastDataRes.status === 'fulfilled' ? toxcastDataRes.value : [];
  seem3BerData.value = berDataRes.status === 'fulfilled' ? berDataRes.value : [];

  setChemsFromResponse({
    summary: summaryData.value, toxcast: toxcastData.value, seem3Ber: seem3BerData.value,
  });

  initializeBerCalcData(seem3BerData.value);
};

onMounted(async() => {
  try {
    isLoading.value = true;
    await getBioactivityData();
  } finally {
    isLoading.value = false;
  }
});

/**  Sections State */
const activeSection = ref<BioactivitySectionTitle>(BIOACTIVITY_SECTIONS.SUMMARY);
const updateActiveSection = (title: string) => {
  const incomingSection = sections.value.find(({section}) => section === title) as BioactivitySectionBreadcrumb;
  activeSection.value = incomingSection?.section;
};

const breadcrumbItems = computed<InternalBreadcrumbItem[]>(() => {
  return sections.value.map(({
    section, disabled,
  }) => ({
    title: section,
    disabled,
  }));
});

const activeBreadCrumb = computed(() => breadcrumbItems.value
  .find(({title}) => title === activeSectionObj.value.section) as InternalBreadcrumbItem);

const sections = computed<BioactivitySectionBreadcrumb[]>(() => ([
  {
    section: BIOACTIVITY_SECTIONS.SUMMARY,
    disabled: isLoading.value,
  },
  {
    section: BIOACTIVITY_SECTIONS.TOXCAST,
    disabled: isLoading.value,
  },
  {
    section: BIOACTIVITY_SECTIONS.SEEM3BER,
    disabled: isLoading.value,
  },
]));

const activeSectionObj = computed(() => sections.value
  .find(({section}) => section === activeSection.value) as BioactivitySectionBreadcrumb);

/**  Handle refresh / session */
const {hasVisited} = storeToRefs(useBioactivityStore());
onBeforeMount(() => {
  sectionVisitedHandler('bioAct', hasVisited);
});
</script>

<style scoped>

</style>
