<template>
  <v-dialog
    aria-label="Uncertainty Factor Dialog"
    max-width="800"
  >
    <template #activator="{ props: dialogProps }">
      <sup><nuxt-icon
        name="b/info-circle"
        v-bind="dialogProps"
        alt="Chemical Search Information"
        title="Click for more information"
        tabindex="0"
        class="rapidtox-icon min-nuxt-icon ml-1"
        @keyup.enter="$event => dialogProps.onClick($event)"
      /></sup>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar
          color="primary"
          :class="`pl-4 bg-${getWorkflowBgColor()}`"
          dark
        >
          Uncertainty Factor
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
          Uncertainty Factor: One of several, generally 10-fold, factors used in operationally deriving an oral RfD
          and/or inhalation RfC from experimental data; for more information regarding uncertainty factors and there
          application please see section 4.4.5 in the following U.S. EPA resource document <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.epa.gov/risk/review-reference-dose-and-reference-concentration-processes-document"
          >https://www.epa.gov/risk/review-reference-dose-and-reference-concentration-processes-document.</a>
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
</script>

<style scoped>

</style>
