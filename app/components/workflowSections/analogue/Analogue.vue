<template>
  <section>
    <SectionHeader
      title="Analogue Chemical Selection"
      section="Analogue"
      tooltip-text="The analogue tab facilitates identification of chemicals
      structurally similar to a target chemical of interest. The analogues
      are sourced only from a structural landscape in which a given chemical has
      an existent human health assessment relevant dose response summary values (e.g., IRIS; PPRTV; ATSDR).
      The tab also provides data for selected physicochemical and toxicokinetic properties for the analogue(s)
      and target chemical to support expert-driven read-across."
    >
      <template #append>
        <v-col cols="auto">
          <MatchedAndUnmatchedRadio
            :display-type="displayType"
            :has-unmatched-data="hasUnmatchedData"
            :has-matched-data="hasMatchedData"
            @set-display-type="setDisplayType"
          />
        </v-col>
      </template>
    </SectionHeader>
    <AnalogueGrid
      ref="selectionGridRef"
      :row-data="selectedChemicals"
      :display-type="displayType"
    />
    <AnalogueDialog
      v-if="showAnalogueModal"
      :show="showAnalogueModal"
      :current-analogue="currentAnalogueSelectedChemical"
      :current-analogue-idx="analogueToUpdateIdx"
      :analogue-steps-info="analogueChemicalsStepInfo"
      @close-dialog="closeSelectionsDialog"
    />
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '../SectionHeader.vue';
import {sectionVisitedHandler} from '../shared/helpers';
import MatchedAndUnmatchedRadio from './components/MatchedAndUnmatchedRadio.vue';
import type {DisplayType} from './types';
import AnalogueGrid from './grids/AnalogueGrid.vue';
import AnalogueDialog from './dialogs/AnalogueDialog.vue';

const {
  selectedChemicals, unmatchedChemicalsCount, matchedCount,
} = storeToRefs(useChemicalSearchStore());

// Grid
const rowData = ref<SelectedChemical[]>([]);
const selectionGridRef = ref<InstanceType<typeof AnalogueGrid>>();

// Unmatched & Matched chemicals
const displayType = ref<DisplayType>('matched');
const setDisplayType = (type: DisplayType) => {
  displayType.value = type;
};
const hasUnmatchedData = computed(() => !!unmatchedChemicalsCount.value);
const hasMatchedData = computed(() => !!matchedCount.value);

// Handle refresh / session
const {hasVisited} = storeToRefs(useAnalogueStore());
onBeforeMount(() => {
  rowData.value = selectedChemicals.value;
  sectionVisitedHandler('analogue', hasVisited);
});

// Selections Dialog
const analogueStore = useAnalogueStore();
const {closeAnalogueModal} = analogueStore;
const {
  showAnalogueModal, currentAnalogueSelectedChemical, analogueToUpdateIdx, analogueChemicalsStepInfo,
} = storeToRefs(analogueStore);

const closeSelectionsDialog = () => {
  const currentSelected = currentAnalogueSelectedChemical.value as AnalogueSelectedChemical;
  closeAnalogueModal();
  selectionGridRef?.value?.refocusCellOnDialogClose(currentSelected.rowIndex, currentSelected.colId);
};
</script>

<style scoped>

</style>
