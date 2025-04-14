<template>
  <v-dialog
    aria-label="In Vivo Toxicity Data"
    max-width="600"
  >
    <template #activator="{ props: dialogProps }">
      <nuxt-icon
        v-if="showHazardIcon"
        v-bind="dialogProps"
        name="mdi/biohazard"
        title="Click here to view additional information"
        class="rapidtox-icon pod-info-icon"
        tabindex="0"
        @keyup.enter="$event => dialogProps.onClick($event)"
      />
      <nuxt-icon
        v-else-if="showAnalogueIcon"
        v-bind="dialogProps"
        name="mdi/hubspot"
        title="Click here to view additional information"
        class="rapidtox-icon pod-info-icon"
        tabindex="0"
      />
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar
          color="primary"
          :class="`pl-4 bg-${getWorkflowBgColor()}`"
          dark
        >
          In Vivo Toxicity Data
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
          <v-row
            v-for="toxData in props.data"
            :key="toxData.label"
          >
            <v-col cols="3">
              {{ toxData.label }} :
            </v-col>
            <v-col>
              {{ toxData.value }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Close"
            variant="flat"
            @click="isActive.value = false"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import {getWorkflowBgColor} from '../../shared/helpers';

const props = defineProps<{
  showHazardIcon: boolean;
  showAnalogueIcon: boolean;
  data: {
    label: string;
    value: string;
  }[];
  isValidData: boolean;
}>();
</script>

<style scoped>
.pod-info-icon {
  font-size: 1.5em !important;
  color: #0071bc;
}
</style>
