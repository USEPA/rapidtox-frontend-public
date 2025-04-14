<template>
  <div class="container-fluid app-container">
    <client-only>
      <EpaHeaderFooterSnackBar />
      <SessionSnackBar />
      <Spinner v-if="isLoadingSession" />
      <template v-else>
        <div class="row">
          <div class="col-12">
            <Stepper
              @go-back="previous"
              @go-next="next"
            />
          </div>
        </div>
        <div
          v-for="tab in tabOrder"
          id="workflow"
          :key="tab.tabKey"
        >
          <transition
            v-if="tab.tabKey !== 'chemSearch'"
            name="slide"
          >
            <component
              :is="components[tab.tabKey]"
              v-if="activeTab === tab.tabKey"
            />
          </transition>
          <div v-else>
            <component
              :is="components[tab.tabKey]"
              v-if="activeTab === tab.tabKey"
            />
          </div>
        </div>
      </template>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import type {Component} from 'vue';
import Stepper from '../layout/UI/Stepper/Stepper.vue';
import EpaHeaderFooterSnackBar from '../layout/UI/Snackbars/EpaHeaderFooter/EpaHeaderFooterSnackBar.vue';
import SessionSnackBar from '../layout/UI/Snackbars/Session/SessionSnackBar.vue';
import Spinner from '../layout/UI/Spinner/Spinner.vue';
import ChemSearch from './chemicalSearch/ChemicalSearch.vue';
import ChemicalSearchResults from './chemicalSearch/ChemicalSearchResults.vue';
import Physchem from './physchem/Physchem.vue';
import EnvFate from './envFate/EnvFate.vue';
import InVivoTox from './inVivoTox/InVivoTox.vue';
import Analogue from './analogue/Analogue.vue';
import Bioactivity from './bioactivity/Bioactivity.vue';
import PodSummary from './pod/PodSummary.vue';
import Report from './report/Report.vue';

const baseStore = useAppBaseStore();

// Reset initial creating/modal state & remove epa header & footer
const {
  showEpaHeaderFooter,
  showEpaHeaderFooterSnackbar,
} = storeToRefs(baseStore);
const sessionStore = useSessionStore();
const {$patch: sessionPatch} = sessionStore;
const {$patch: basePatch} = baseStore;
onMounted(() => {
  sessionPatch({
    isCreatingSession: false,
    showSessionCreationModal: false,
  });

  // Hide EPA header & footer if visible.
  if (showEpaHeaderFooter) {
    basePatch({
      showEpaHeaderFooter: false,
    });
    showEpaHeaderFooterSnackbar.value = true;
  }
});

// Dynamic component(section) display
const {
  activeTab,
  tabOrder,
} = storeToRefs(baseStore);

// eslint-disable-next-line no-unused-vars
const components: {[key in TabKey]: Component} = {
  chemSearch: ChemSearch,
  chemSearchResults: ChemicalSearchResults,
  physChem: Physchem,
  envFate: EnvFate,
  hazard: InVivoTox,
  analogue: Analogue,
  bioAct: Bioactivity,
  pod: PodSummary,
  report: Report,
};

// Stepper actions
const {
  nextStep: next, previousStep: previous,
} = baseStore;

// Handle loading of tab state if necessary.
const {sessionId} = storeToRefs(sessionStore);
const {selectedChemicals} = storeToRefs(useChemicalSearchStore());

const {
  reloadVisitedTabs,
} = baseStore;

const {
  loadUserSession: loadSession,
} = sessionStore;

onBeforeMount(async() => {
  await setTabState();
});

const setActiveTab = (tabKey: TabKey) => {
  if ((activeTab.value === 'hazard' || activeTab.value === 'physChem' || activeTab.value === 'envFate' || activeTab.value === 'analogue' || activeTab.value === 'report' || activeTab.value === 'pod') &&
    selectedChemicals.value.length > 0 &&
    tabKey === 'chemSearch') {
    basePatch({activeTab: 'chemSearchResults'});
  } else {
    basePatch({activeTab: tabKey});
  }
};

const isLoadingSession = ref(false);

const setTabState = async() => {
  const router = useRouter();
  const route = useRoute();
  try {
    // This case happens on page refresh.
    if (!route.query.fromHome) {
      isLoadingSession.value = true;
      const previousTab = await loadSession({sessionKey: sessionId.value});
      setActiveTab((previousTab as string) === 'physchem' ? 'physChem' : previousTab);
      return;
    }

    router.replace({query: {}});
  } catch {
    router.replace({query: {}});
    setActiveTab('chemSearch');
  } finally {
    reloadVisitedTabs();
    isLoadingSession.value = false;
  }
};
</script>

<style scoped>
.slide-leave-active,
.slide-enter-active {
  transition: 0.9s;
  opacity: 0;
}
.slide-out-leave-active,
.slide-out-enter-active {
  transition: 0.3s;
  opacity: 0;
}
</style>
