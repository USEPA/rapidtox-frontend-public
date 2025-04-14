<template>
  <div>
    <v-dialog
      class="chem-data-not-found-dialog"
      content-class="chem-data-not-found-dialog-content"
      max-width="600"
      aria-label="Chemicals Not Found"
      attach=".chem-data-not-found-alert"
    >
      <template #activator="{ props: activatorProps }">
        <v-alert
          type="warning"
          rounded
          class="fit-content text-black chem-data-not-found-alert"
        >
          <span
            v-bind="activatorProps"
            class="chem-data-not-found-text"
            tabindex="0"
            @keyup.enter="$event => activatorProps.onClick($event)"
          >
            <u
              data-testid="chem-data-not-found-dialog-activator"
            >
              {{ props.chemicalsNotFound.length }} chemical{{ props.chemicalsNotFound.length > 1 ? 's' : '' }}
              - No {{ props.section }} data
            </u>
          </span>
        </v-alert>
      </template>

      <template #default="{ isActive }">
        <v-card>
          <v-toolbar
            color="primary"
            :class="`pl-4 ${getWorkflowBgColor()}`"
            dark
          >
            <span>Chemicals with no {{ props.section }} data</span>
            <v-spacer />
            <v-btn
              class="chem-data-not-found-x-btn"
              data-testid="chem-data-not-found-x-btn"
              @click="isActive.value = false"
            >
              <template #prepend>
                <nuxt-icon
                  id="chem-data-not-found-dialog-close-x"
                  class="min-nuxt-icon text-white"
                  alt="Close"
                  aria-label="Close"
                  name="mdi/close"
                />
              </template>
            </v-btn>
          </v-toolbar>
          <v-card-text class="p-2 mt-4">
            <ul>
              <li
                v-for="chemical in chemicalsNotFound"
                :key="chemical"
              >
                {{ chemical }}
              </li>
            </ul>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text="Close"
              variant="flat"
              data-testid="chem-data-not-found-footer-close-btn"
              @click="isActive.value = false"
            />
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {getWorkflowBgColor} from '../helpers';

const props = defineProps<{
  chemicalsNotFound: string[];
  section: string;
}>();
</script>

<style scoped>
.chem-data-not-found-alert {
  width: fit-content !important;
}

:deep(.v-alert__content) {
  font-size: 18px;
}

.chem-data-not-found-text:hover {
  cursor: pointer;
}

.close-tooltip-button {
  background-color: inherit;
}
</style>
