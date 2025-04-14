<template>
  <v-dialog
    v-model="showDialog"
    max-width="500"
    persistent
  >
    <v-card>
      <v-toolbar
        color="primary"
        :class="`pl-4 bg-${getWorkflowBgColor()}`"
        dark
      >
        <span>{{ props.section }} Data Selection Alert</span>
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
        There is no {{ section }} data for your selected chemicals. There may be data for these chemicals
        within other sections. Please continue to the next section.
      </v-card-text>
      <v-card-actions>
        <v-btn
          text="Close"
          variant="flat"
          @click="showDialog = false"
        />
        <v-btn
          text="Okay"
          variant="flat"
          @click="okayHandler"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {getWorkflowBgColor} from '../helpers';

const {nextStep} = useAppBaseStore();

const props = defineProps<{
  id: string;
  show: boolean;
  section: string;
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

const okayHandler = () => {
  showDialog.value = false;
  nextStep();
};
</script>

<style scoped>

</style>
