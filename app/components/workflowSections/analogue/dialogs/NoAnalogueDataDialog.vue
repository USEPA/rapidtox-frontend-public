<template>
  <v-dialog
    v-model="showDialog"
    aria-label="No Analogue Data"
    max-width="500"
  >
    <v-card>
      <v-toolbar
        color="primary"
        :class="`pl-4 bg-${getWorkflowBgColor()}`"
        aria-label="Error Loading Mol File Header"
        dark
      >
        No Analogue Data
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
        {{ message }} Press <i>Ok</i> to adjust the similiarity weight
        or press <i>Cancel</i> to exit out of Analogue selections for this chemical.
      </v-card-text>
      <v-card-actions>
        <v-btn
          text="Close"
          variant="flat"
          @click="emits('closeMainAnalogueDialog')"
        />
        <WorkflowButton
          text="Ok"
          @click="showDialog = false"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {getWorkflowBgColor} from '../../shared/helpers';
import WorkflowButton from '../../shared/components/WorkflowButton.vue';

const props = defineProps<{
  show: boolean;
  message: string;
}>();

const emits = defineEmits<{
  closeAnalogue: [];
  closeMainAnalogueDialog: [];
}>();

const showDialog = computed({
  get() {
    return props.show;
  },
  set() {
    emits('closeAnalogue');
  },
});
</script>

<style scoped>

</style>
