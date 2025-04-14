<template>
  <v-dialog
    aria-label="Remove Dose"
    width="650"
  >
    <template #activator="{ props: dialogProps }">
      <v-btn
        v-bind="dialogProps"
        color="error"
      >
        Remove
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar
          color="primary"
          :class="`pl-4 bg-${getWorkflowBgColor()}`"
          dark
        >
          Remove Dose
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
          Are you sure you want to remove this conversion?
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Close"
            variant="flat"
            @click="isActive.value = false"
          />
          <v-btn
            text="Remove"
            variant="flat"
            color="error"
            @click="removeConversion(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import {getWorkflowBgColor} from '../../shared/helpers';
import type {PodData} from '~~/types';

const props = defineProps<{
  params: ICellRendererParams<PodData>;
}>();

const hazardStore = useHazardStore();
const {$patch: hazardPatch} = hazardStore;

const {saveSession} = useSessionStore();

const removeConversion = (isActive: globalThis.Ref<boolean, boolean>) => {
  hazardPatch((state) => {
    state.hazardChartData = state.hazardChartData.filter(({id}) => id !== props.params.data?.id);
  });
  saveSession('hazard');
  isActive.value = false;
};
</script>

<style scoped>

</style>
