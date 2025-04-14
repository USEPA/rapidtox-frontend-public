v<template>
  <v-dialog
    aria-label="Summary Plot"
    height="80%"
    max-height="80%"
  >
    <template #activator="{ props: dialogProps }">
      <Suspense>
        <v-btn
          v-bind="dialogProps"
          tabindex="0"
          variant="text"
          aria-label="Summary Plot"
          size="large"
        >
          <template #prepend>
            <nuxt-icon
              name="mdi/chart-timeline"
              class="ml-2 rapidtox-icon"
            />
          </template>
        </v-btn>
        <template #fallback>
          Loading...
        </template>
      </Suspense>
    </template>
    <template #default="{ isActive }">
      <v-card class="h-100">
        <v-toolbar
          color="primary"
          :class="`pl-4 bg-${getWorkflowBgColor()}`"
          tag="section"
          dark
        >
          Plot Chart for {{ props.params.data?.dtxsid }}
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
          <section class="d-flex align-content-start">
            <img
              class="bg-white position-relative top-0"
              :alt="'Plot image for ' + props.params.data?.dtxsid"
              :src="props.plotUrl"
              width="100%"
              crossorigin="anonymous"
            >
          </section>
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
import type {ICellRendererParams} from 'ag-grid-community';
import {getWorkflowBgColor} from '../../shared/helpers';
import type {BioactivityBaseRes} from '~/api/Bioactivity/types';

const props = defineProps<{
  plotUrl: string;
  params: ICellRendererParams<BioactivityBaseRes>;
}>();
</script>

<style scoped>

</style>
