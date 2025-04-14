<template>
  <v-col sm="1">
    <section
      tabindex="0"
      aria-label="Previous button"
      class="float-left"
    >
      <WorkflowButton
        :disabled="props.isPreviousDisabled"
        @click="emits('previous')"
      >
        <template #prepend>
          <nuxt-icon
            class="stepper-back-next-icons"
            name="b/arrow-left-circle-fill"
            alt="back arrow icon"
          />
        </template>
        Previous
      </WorkflowButton>
    </section>
  </v-col>
  <v-col
    sm="1"
    align-self="end"
  >
    <WorkflowButton
      class="float-right"
      :disabled="props.isNextDisabled"
      @click="emits('next')"
    >
      <template
        v-if="!props.isFinalStep"
        #append
      >
        <nuxt-icon
          name="b/arrow-right-circle-fill"
          alt="back arrow icon"
        />
      </template>
      {{ props.isFinalStep ? 'Finish' : 'Next' }}
    </WorkflowButton>
  </v-col>
</template>

<script setup lang="ts">
import WorkflowButton from '../../shared/components/WorkflowButton.vue';

const props = defineProps<{
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  isFinalStep: boolean;
}>();

const emits = defineEmits<{
  next: [];
  previous: [];
}>();
</script>

<style scoped>

</style>
