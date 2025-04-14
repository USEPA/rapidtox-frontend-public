<template>
  <v-stepper
    v-model="activeStep"
    max-width="100%"
    flat
  >
    <v-stepper-header>
      <template
        v-for="(step, idx) in props.steps"
        :key="step"
      >
        <v-stepper-item
          :color="getIconColor"
          :complete="step.completed"
          :title="step.name"
          :value="step.step + 1"
        />
        <v-divider v-if="idx !== props.steps.length -1" />
      </template>
    </v-stepper-header>
  </v-stepper>
</template>

<script setup lang="ts">
const props = defineProps<{
  steps: {
    step: number;
    name: string;
    key: string;
    completed: boolean;
  }[];
  currentStep: number;
}>();
const getIconColor = computed(() => getWorkflowColor());

const activeStep = computed({
  get() {
    return props.currentStep + 1;
  },
  set() {
    return null;
  },
});
</script>

<style scoped>

</style>
