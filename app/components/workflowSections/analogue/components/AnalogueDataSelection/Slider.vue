<template>
  <div class="slider-container">
    <!-- Slider does not current have ARIA-LABEL on the thumb. This will be changed soon https://github.com/vuetifyjs/vuetify/actions/runs/9226063388/workflow -->
    <v-slider
      v-model="sliderValue"
      :min="minSliderValue"
      :max="maxSliderValue"
      :step="sliderIncrement"
      track-size="10"
      thumb-size="25"
      :track-fill-color="getColor"
      track-color="grey"
      aria-label="Similarity Slider"
      :thumb-color="getColor"
    >
      <template #prepend>
        <span class="slider-label-text">Similarity:</span>
      </template>
      <template #append>
        <span class="slider-label-text">Slider Value: {{ sliderValue.toFixed(2) }}</span>
        <WorkflowButton
          class="ml-4"
          @click="emits('search', sliderValue)"
        >
          Search
        </WorkflowButton>
      </template>
    </v-slider>
  </div>
</template>

<script setup lang="ts">
import WorkflowButton from '~/components/workflowSections/shared/components/WorkflowButton.vue';

const emits = defineEmits<{
  search: [sliderValue: number];
}>();

const sliderValue = ref(0.6);
const minSliderValue = ref(0.1);
const maxSliderValue = ref(1.0);
const sliderIncrement = ref(0.05);

const getColor = computed(() => getWorkflowColor());

defineExpose({
  sliderValue,
});
</script>

<style scoped>
.slider-container {
  font: 40px;
}

.slider-label-text {
  font-size: 20px;
}
</style>
