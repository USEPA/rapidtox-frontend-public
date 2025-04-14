<template>
  <v-dialog
    v-model="showDialog"
    persistent
    aria-label="Analogue Selections"
    attach="body"
    height="90%"
  >
    <v-card>
      <v-toolbar
        color="primary"
        :class="`pl-4 bg-${getWorkflowBgColor()}`"
        dark
      >
        Analogue
        <v-spacer />
        <v-btn
          @click="showDialog = false"
        >
          <nuxt-icon
            class="min-nuxt-icon text-white"
            alt="Close"
            aria-label="Close"
            name="mdi/close"
          />
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col
            cols="8"
            offset="2"
          >
            <AnalogueDialogStepper
              :steps="steps"
              :current-step="currentStep"
            />
          </v-col>
        </v-row>
        <v-row justify="space-between">
          <AnalogueDialogNextAndBackButtons
            :is-previous-disabled="isPreviousDisabled"
            :is-next-disabled="isNextDisabled"
            :is-final-step="isFinalStep"
            @next="next"
            @previous="previous"
          />
        </v-row>
        <v-row>
          <v-col cols="12">
            <AnalogueStructureSelection
              v-if="steps[currentStep]?.key === 'Ketcher'"
              :current-analogue-steps-data="currentAnalogueStepsData"
            />
            <AnalogueDataSelection
              v-else-if="steps[currentStep]?.key === 'AnalogDataSelection'"
              ref="analogueDataSelectionRef"
              :current-analogue-steps-data="currentAnalogueStepsData"
              @update-step-info="updateAnalogueChemicalsStepInfo"
              @remove-analogue="removeSelectedAnalogue"
              @close-main-analogue-dialog="showDialog = false"
            />
            <AnalogueReadAcross
              v-else-if="steps[currentStep]?.key === 'FinalStep'"
              :current-analogue-steps-data="currentAnalogueStepsData"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text="Close"
          variant="flat"
          @click="showDialog = false"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {getWorkflowBgColor} from '../../shared/helpers';
import AnalogueDialogStepper from '../components/AnalogueDialogStepper.vue';
import AnalogueDialogNextAndBackButtons from '../components/AnalogueDialogNextAndBackButtons.vue';
import AnalogueStructureSelection from '../components/AnalogueStructureSelection/AnalogueStructureSelection.vue';
import AnalogueDataSelection from '../components/AnalogueDataSelection/AnalogueDataSelection.vue';
import AnalogueReadAcross from '../components/AnalogueReadAcross/AnalogueReadAcross.vue';

// Dialog Open/Close
const props = defineProps<{
  show: boolean;
  currentAnalogue: AnalogueSelectedChemical | Record<string, never>;
  currentAnalogueIdx: number;
  analogueStepsInfo: AnalogueStepInfo[];
}>();
const emits = defineEmits<{
  closeDialog: [];
}>();
const showDialog = computed({
  get() {
    return props.show;
  },
  set() {
    emits('closeDialog');
  },
});

onMounted(() => {
  if (!props.currentAnalogue.hasStructureImage) {
    steps.value.unshift({
      step: 0, name: 'Structure Editor', key: 'Ketcher', completed: false,
    });
    steps.value = steps.value.map((step, idx) => ({
      ...step,
      step: idx,
    }));
  }

  if (currentStep.value !== 0) {
    updateLocalSteps(currentStep.value + 1);
  }
});

// Prev and Next Buttons

const analogueDataSelectionRef = ref<InstanceType<typeof AnalogueDataSelection>>();
const isPreviousDisabled = computed(() => currentStep.value < 1);
const isNextDisabled = computed(() => {
  if (steps.value[currentStep.value]?.key === 'FinalStep') {
    return false;
  }

  const analogueResponseData = analogueDataSelectionRef.value?.analogueResponseData;

  const isAnalogueResponseEmpty = !analogueResponseData?.length ||
    (analogueResponseData?.length === 1 && analogueResponseData[0]?.isTarget);

  const isAnyAnalogueSelected = !!currentAnalogueStepsData.value?.selectedAnalogues?.length;

  if (steps.value[currentStep.value]?.key === 'AnalogDataSelection' &&
    (
      isAnalogueResponseEmpty ||
      !isAnyAnalogueSelected
    )) {
    return true;
  }

  return !!(currentStep.value > 0 && props.currentAnalogue?.hasStructureImage) ||
    !!(currentStep.value > 1 && !props.currentAnalogue?.hasStructureImage);
});

const isFinalStep = computed(() => steps.value[currentStep.value]?.key === 'FinalStep');

const {
  setCurrentSmileString, updateAnalogueChemicalsStepInfo, removeSelectedAnalogue,
} = useAnalogueStore();

const updateLocalSteps = (nextStep: number) => {
  steps.value = steps.value
    .map(step => ({...step, completed: step.step < nextStep}));
};

const currentAnalogueStepsData = computed(() => props.analogueStepsInfo?.[props.currentAnalogueIdx]);

const finishedStepOne = computed(() => props.currentAnalogueIdx >= 0 ?
  (currentAnalogueStepsData.value?.finishedStepOne || 0) :
  0);

const finishedStepTwo = computed(() => props.currentAnalogueIdx >= 0 ?
  (currentAnalogueStepsData.value?.finishedStepTwo || 0) :
  0);

const next = async() => {
  if (isFinalStep.value) {
    emits('closeDialog');
    return;
  }
  if (!isNextDisabled.value) {
    if (currentAnalogueStepsData.value) {
      const nextStep = currentStep.value + 1;

      updateLocalSteps(nextStep);

      if (steps.value[currentStep.value]?.key === 'Ketcher') {
        await setCurrentSmileString();
      }

      updateAnalogueChemicalsStepInfo({
        nextStep,
        finishedStepOne: currentStep.value === 0 ? true : currentAnalogueStepsData.value.finishedStepOne,
        finishedStepTwo: currentStep.value === 1 ? true : currentAnalogueStepsData.value.finishedStepTwo,
        searchWord: props.currentAnalogue.searchWord,
      });
    }
  }
};
const previous = () => {
  if (!isPreviousDisabled.value) {
    const nextStep = currentStep.value - 1;
    updateLocalSteps(nextStep);
    updateAnalogueChemicalsStepInfo({
      nextStep,
      finishedStepOne: finishedStepOne.value as boolean,
      finishedStepTwo: finishedStepTwo.value as boolean,
      searchWord: props.currentAnalogue.searchWord,
    });
  }
};

// Steps
const steps = ref([
  {
    step: 0, name: 'Analogue Selection', key: 'AnalogDataSelection', completed: false,
  }, {
    step: 1, name: 'Read Across Selection', key: 'FinalStep', completed: false,
  },
]);

const currentStep = computed(() => props.currentAnalogueIdx >= 0 ?
  (props.analogueStepsInfo[props.currentAnalogueIdx]?.currentStep || 0) :
  0);
</script>

<style scoped>
:deep(.v-stepper-item__avatar) {
  height: 40px !important;
  width: 40px !important;
}
</style>
