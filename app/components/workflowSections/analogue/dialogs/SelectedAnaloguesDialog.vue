<template>
  <v-dialog
    v-model="showDialog"
    max-width="400"
    aria-label="Selected Analogues"
  >
    <template #activator="{ props: activatorProps }">
      <v-alert
        :icon="false"
        class="display-inline-flex"
        type="info"
        color="#d1ecf1"
      >
        <v-btn
          v-bind="activatorProps"
          ref="selectedAnaloguesDialog"
          variant="text"
          size="lg"
          :disabled="!analgouesSelected?.length || loading"
        >
          <u class="mr-2">{{ props.currentAnalogueStepsData?.selectedAnalogues?.length || 0 }}</u> Selected
        </v-btn>
      </v-alert>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar
          color="primary"
          :class="`pl-4 bg-${getWorkflowBgColor()}`"
          dark
        >
          Selected Analogues
          <v-spacer />
          <v-btn
            @click="isActive.value = false"
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
          <TransitionGroup
            name="fade"
            tag="v-list"
          >
            <v-list-item
              v-for="analogue in analgouesSelected"
              :key="analogue.dtxsid"
              transition="fade-transition"
              class="selected-analogues-list"
            >
              <template #title>
                <span
                  :key="`${analogue.dtxsid}-span`"
                  class="fs-4"
                >{{ analogue.dtxsid }}</span>
              </template>
              <template #prepend>
                <nuxt-icon
                  :key="`${analogue.dtxsid}-icon`"
                  name="b/times-circle-fill"
                  aria-label="Deselect chemical"
                  tabindex="0"
                  class="mr-1 selected-analogues-list-icon cursor-pointer"
                  @click="removeAnalogue(analogue)"
                  @keyup.enter="removeAnalogue(analogue)"
                />
              </template>
            </v-list-item>
          </TransitionGroup>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import {getWorkflowBgColor} from '../../shared/helpers';

const props = defineProps<{
  currentAnalogueStepsData: AnalogueStepInfo | undefined;
  loading: boolean;
}>();

const emits = defineEmits<{
  removeAnalogue: [analogue: SelectedAnalogue];
}>();

const removeAnalogue = (analogue: SelectedAnalogue) => {
  emits('removeAnalogue', analogue);
};

const showDialog = ref(false);
const selectedAnaloguesDialog = ref(null);

const analgouesSelected = computed(() => props.currentAnalogueStepsData?.selectedAnalogues);

watch(() => props.currentAnalogueStepsData, () => {
  if (!props.currentAnalogueStepsData?.selectedAnalogues.length) {
    showDialog.value = false;
  }
});
</script>

<style scoped>
.selected-analogues-list-icon {
  color: red;
}
.fade-leave-active {
    transition: opacity .5s ease;
}
.fade-enter-from, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
}
.fade-move {
    transition: transform 1s;
}
</style>
