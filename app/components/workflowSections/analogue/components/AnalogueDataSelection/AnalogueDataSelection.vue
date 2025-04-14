<template>
  <div>
    <v-col
      cols="6"
      sm="12"
    >
      <Slider
        ref="analogueSlider"
        @search="search"
      />
    </v-col>
    <v-row>
      <v-col
        cols="2"
        class="fit-content"
      >
        <SelectedAnaloguesDialog
          :current-analogue-steps-data="props.currentAnalogueStepsData"
          :loading="loading"
          @remove-analogue="removeAnalogue"
        />
      </v-col>
      <v-col
        cols="2"
        offset="2"
      >
        <AnalogueDataSelectionFilter
          :type="selected"
          @update-type="updateSelected"
        />
      </v-col>
      <v-col
        v-if="showTargetLegend"
        cols="2"
        offset="4"
        align-self="end"
      >
        <TargetChemicalLegend />
      </v-col>
    </v-row>
    <v-col cols="12">
      <Spinner v-if="loading" />
      <ErrorLoadingGridAlert v-else-if="errorLoadingData" />
      <AnalogueDataSelectionGrid
        v-else
        :row-data="filteredAnalogueData"
        :current-analogue-steps-data="currentAnalogueStepsData"
        @update-step-info="updateStepInfo"
      />
    </v-col>
    <NoAnalogueDataDialog
      :show="showNoAnalogueDialog"
      :message="noAnalogueDialogMessage"
      @close-analogue="showNoAnalogueDialog = false"
      @close-main-analogue-dialog="emits('closeMainAnalogueDialog')"
    />
  </div>
</template>

<script setup lang="ts">
import AnalogueDataSelectionGrid from '../../grids/AnalogueDataSelectionGrid.vue';
import SelectedAnaloguesDialog from '../../dialogs/SelectedAnaloguesDialog.vue';
import TargetChemicalLegend from '../TargetChemicalLegend.vue';
import NoAnalogueDataDialog from '../../dialogs/NoAnalogueDataDialog.vue';
import Slider from './Slider.vue';
import AnalogueDataSelectionFilter from './AnalogueDataSelectionFilter.vue';
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';
import type {ERAnalogue, HHRAnalogue} from '~/api/Analogue/types';
import ErrorLoadingGridAlert from '~/components/workflowSections/shared/alerts/ErrorLoadingGridAlert.vue';

const props = defineProps<{
  currentAnalogueStepsData: AnalogueStepInfo | undefined;
}>();

const emits = defineEmits<{
  updateStepInfo: [stepInfo: UpdateStepInfoParams];
  removeAnalogue: [analogue: SelectedAnalogue];
  closeMainAnalogueDialog: [];
}>();

// Slider
const analogueSlider = ref<InstanceType<typeof Slider>>();

// Selected (Top x)
export type SelectedType = '10' | '25' | '50' | '100' | 'All';
const selected = ref<SelectedType>('All');

const updateSelected = (type: SelectedType) => {
  selected.value = type;
};

const removeAnalogue = (analogue: SelectedAnalogue) => {
  emits('removeAnalogue', analogue);
};

const updateStepInfo = (stepInfo: UpdateStepInfoParams) => {
  emits('updateStepInfo', stepInfo);
};

const showTargetLegend = computed(() => filteredAnalogueData.value.some(({isTarget}) => isTarget));

// Grid Data
const loading = ref(false);

const analogueResponseData = ref<ERAnalogue[] | HHRAnalogue[]>([]);
const errorLoadingData = ref(false);

onMounted(async() => {
  await getSelectionData();
});

const filteredAnalogueData = computed(() => selected.value === 'All' ? analogueResponseData.value : analogueResponseData.value.slice(0, Number.parseInt(selected.value, 10)));
const getSelectionData = async() => {
  try {
    loading.value = true;
    const {$repositories} = useNuxtApp();
    const {
      dtxsid, smileString, unmatchedDtxsid,
    } = props.currentAnalogueStepsData as AnalogueStepInfo;
    const sliderValue = analogueSlider.value?.sliderValue.toString() || '';
    const analogueData = await $repositories.analogue
      .getAnalogues(unmatchedDtxsid || dtxsid, smileString, sliderValue, useWorkflowData().workflowId);
    analogueResponseData.value = analogueData as ERAnalogue[] | HHRAnalogue[];
    if (!analogueData.length) {
      noAnalogueDialogMessage.value = 'There are no Analogues for this selected chemical and similiarity weight.';
      showNoAnalogueDialog.value = true;
      return;
    }
    if (analogueData.length === 1 && analogueData[0]?.isTarget) {
      noAnalogueDialogMessage.value = 'The target chemical is the only Analogue found with this similiarity weight.';
      showNoAnalogueDialog.value = true;
    }
  } catch {
    errorLoadingData.value = true;
  } finally {
    loading.value = false;
  }
};

const search = async() => {
  await getSelectionData();
};

// No analogues dialog
const showNoAnalogueDialog = ref(false);
const noAnalogueDialogMessage = ref('');

defineExpose({
  analogueResponseData,
});
</script>

<style scoped>

</style>
