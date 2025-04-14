<template>
  <client-only>
    <div class="stepper-container">
      <v-stepper :mobile="width < 1342">
        <v-stepper-header>
          <section
            :class="[getBackAndNextButtonsClass.backClass]"
            tabindex="0"
            title="Back"
            aria-label="Back button"
            @click="previousStep"
            @keyup.enter="previousStep"
          >
            <div>
              <nuxt-icon
                class="stepper-back-next-icons"
                name="b/arrow-left-circle-fill"

                alt="back arrow icon"
              />
            </div>
            <div style="margin-top:4px">
              Back
            </div>
          </section>
          <template
            v-for="(tab, idx) in tabOrder"
            :key="tab.tabKey"
          >
            <v-stepper-item
              :id="isStepActive(tab.tabKey) ? 'active-step' : ''"
              :editable="isStepEditable(tab.tabKey)"
              :complete="isStepEditable(tab.tabKey)"
              :color="getIconColor"
              :aria-label="tab.tabDisplayName"
              :title="tab.tabDisplayName"
              @click="setStep(tab.tabKey)"
              @keyup.enter="setStep(tab.tabKey)"
            >
              <template #title>
                <div v-if="tab.tabKey === 'hazard'">
                  <i>In Vivo</i> Toxicity
                </div>
                <div v-else>
                  {{ tab.tabDisplayName }}
                </div>
              </template>
              <template #icon>
                <nuxt-icon
                  class="stepper-icon"
                  :title="tab.tabDisplayName"
                  :name="tab.stepperIcon"
                />
              </template>
            </v-stepper-item>
            <v-divider
              v-if="idx !== tabOrder.length - 1"
              :key="tab.tabDisplayName"
              :class="getDividerClass(tab.tabKey)"
            />
          </template>
          <section
            :class="[getBackAndNextButtonsClass.nextClass]"
            tabindex="0"
            aria-label="Next button"
            title="Next"
            @click="nextStep"
            @keyup.enter="nextStep"
          >
            <div>
              <nuxt-icon
                class="stepper-back-next-icons"
                name="b/arrow-right-circle-fill"
                alt="back arrow icon"
              />
            </div>
            <div style="margin-top:4px">
              Next
            </div>
          </section>
        </v-stepper-header>
      </v-stepper>
    </div>
  </client-only>
</template>

<script setup lang="ts">
// Stepper Items
const baseStore = useAppBaseStore();

const chemicalSearchStore = useChemicalSearchStore();

const {tabOrder, activeTab: activeItem} = storeToRefs(baseStore);

const {width} = useWindowSize();

const getDividerClass = (tabKey: TabKey) => {
  if (isStepComplete(tabKey) && (!chemSearchDisabled.value || tabKey === 'chemSearch' || tabKey === 'chemSearchResults')) {
    return 'active-divider';
  }
  return 'inactive-divider';
};

// Back and Next Buttons
const {previousStep, nextStep} = baseStore;
const {
  identifiersCount,
  chemSearchDisabled,
  selectedChemicals,
} = storeToRefs(chemicalSearchStore);
const getBackAndNextButtonsClass = computed(() => {
  const {workflowId} = useWorkflowData();
  const backBtnClassColor = isBackEnabled.value ? ` active bg-${workflowId}` : ' inactive';
  const nextBtnClassColor = isNextEnabled.value ? ` active bg-${workflowId}` : ' inactive';
  const backClass = `stepper-back-next-buttons${backBtnClassColor} `;
  const nextClass = `stepper-back-next-buttons${nextBtnClassColor} `;
  return {
    backClass,
    nextClass,
  };
});

const isBackEnabled = computed(() => !(activeItem.value === 'chemSearch'));

const isNextEnabled = computed(() => {
  if (activeItem.value === 'chemSearchResults' && selectedChemicals.value.length) {
    return true;
  }
  if (activeItem.value === 'report') { return false; }
  if (activeItem.value === 'chemSearch' && identifiersCount.value < 1) {
    return false;
  }
  if (chemSearchDisabled.value) {
    return false;
  }
  return true;
});

// Icon
const getIconColor = computed(() => {
  const {workflowId} = useWorkflowData();
  return getWorkflowColor(workflowId);
});

// Step Status - Editable, Complete, Active
const {
  hasChemSearchResultsVisited: hasVisitedChemSearchResults,
  hasChemSearchVisited: hasVisitedChemSearch,
} = storeToRefs(chemicalSearchStore);
const {hasVisited: hasVisitedAnalogue} = storeToRefs(useAnalogueStore());
const {hasVisited: hasVisitedBioActivity} = storeToRefs(useBioactivityStore());
const {hasVisited: hasVisitedHazard} = storeToRefs(useHazardStore());
const {hasVisited: hasVisitedEnvFate} = storeToRefs(useEnvFateStore());
const {hasVisited: hasVisitedPhysChem} = storeToRefs(usePhyschemStore());
const {hasVisited: hasVisitedPod} = storeToRefs(usePodStore());
const {hasVisited: hasVisitedReport} = storeToRefs(useReportStore());

const completeMap = computed(() => {
  return {
    analogue: hasVisitedAnalogue.value,
    bioAct: hasVisitedBioActivity.value,
    hazard: hasVisitedHazard.value,
    envFate: hasVisitedEnvFate.value,
    physChem: hasVisitedPhysChem.value,
    pod: hasVisitedPod.value,
    report: hasVisitedReport.value,
    chemSearchResults: hasVisitedChemSearchResults.value,
    chemSearch: hasVisitedChemSearch.value,
  };
});

const isStepComplete = (tabKey: TabKey) => {
  const hasBeenVisited = completeMap.value[tabKey];
  const tabKeyIdx = tabOrder.value.findIndex(tab => tab.tabKey === tabKey);
  const activeIdx = tabOrder.value.findIndex(tab => tab.tabKey === activeItem.value);
  return activeIdx > tabKeyIdx || hasBeenVisited;
};
const isStepEditable = (tabKey: TabKey) => {
  return isStepComplete(tabKey) &&
    (!chemSearchDisabled.value || tabKey === 'chemSearch' || tabKey === 'chemSearchResults');
};

const isStepActive = (tabKey: TabKey) => {
  const tabKeyIdx = tabOrder.value.findIndex(tab => tab.tabKey === tabKey);
  const activeIdx = tabOrder.value.findIndex(tab => tab.tabKey === activeItem.value);
  return activeIdx === tabKeyIdx;
};

// Step Click
const {
  $patch: basePatch,
} = baseStore;
const setStep = (tabKey: TabKey) => {
  basePatch({activeTab: tabKey});
};
</script>

<style lang="scss" scoped>
:deep(.nuxt-icon svg) {
  width: 24px;
  height: 24px;
}
:deep(.v-stepper-header) {
  display: flex;
}
:deep(.v-stepper.v-sheet) {
  border-radius: 16px !important;
}
:deep(.v-stepper-item) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}
:deep(.v-stepper-item__content) {
  padding-top: 10px;
  font-size: 16px !important;
}
:deep(.v-stepper-item__avatar) {
  height: 40px !important;
  width: 40px !important;
}
:deep(.v-stepper-item--complete), :deep(#active-step), :deep(.v-stepper-item--selected) {
  opacity: 1.0 !important;
}

.stepper-back-next-icons {
  color:white;
  width:40px;
  height:40px;
}
.stepper-back-next-buttons:hover {
  cursor: pointer;
}

.stepper-container {
  margin:30px 15px 0 15px;
}
.stepper-back-next-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 115px;
  color:white;
  vertical-align: middle;
  min-width: 75px;
}

.active:hover {
  background-color:rgb(26, 126, 192);
}
.inactive {
  background-color:#757575;
  pointer-events: none;
}
::v-deep(.v-sheet.v-stepper:not(.v-sheet--outlined)) {
    border: 1px solid black;
}
::v-deep(#active-step > .v-stepper-item__avatar) {
    background-color: green !important;
    border-color: green !important;
    opacity: 1.0 !important;
}
.italicized-text
{
  font-style: italic;
}
</style>
