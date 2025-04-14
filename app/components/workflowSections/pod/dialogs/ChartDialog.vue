<template>
  <v-dialog
    aria-label="Oral/Inhalation Chart"
    max-width="90%"
    height="90%"
  >
    <template
      #activator="{ props: dialogProps }"
    >
      <v-btn
        :disabled="!!props.isDisabled"
        variant="text"
        v-bind="dialogProps"
        tabindex="0"
        size="large"
        aria-label="Oral/Inhalation Chart"
      >
        <nuxt-icon
          class="rapidtox-icon"
          name="mdi/chart-scatter-plot"
          alt="Generate Plot"
        />
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar
          color="primary"
          :class="`pl-4 bg-${getWorkflowBgColor()}`"
          dark
        >
          <slot name="title">
            {{ props.title }}
          </slot>
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
          <v-row>
            <v-col cols="12">
              <v-btn-toggle
                v-model="displayChartType"
              >
                <WorkflowButton
                  :disabled="isOralDisabled"
                >
                  Oral
                </WorkflowButton>
                <WorkflowButton
                  :disabled="isInhalationDisabled"
                >
                  Inhalation
                </WorkflowButton>
              </v-btn-toggle>
              <slot name="append-actions" />
            </v-col>
            <v-col
              cols="12"
              class="text-center"
            >
              <label>
                <slot name="chart-label">
                  {{ props.chartLabel }}
                </slot>
              </label>
            </v-col>
            <v-col
              cols="12"
              class="text-center"
            >
              <Spinner
                v-if="isLoadingChartImg"
                figure-class="chartImage w-100 mt-12"
              />
              <img
                v-else
                tabindex="0"
                :src="(props.activeImg as string)"
                class="chartImage"
                :alt="props.altText"
                :aria-label="`${props.preferredName} ${props.chartType} chart`"
              >
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
import type {ChartDialogImgType} from '../types';
import WorkflowButton from '../../shared/components/WorkflowButton.vue';
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';

const props = defineProps<{
  preferredName: string;
  activeImg: string | null;
  chartType: ChartDialogImgType;
  isOralDisabled: boolean;
  altText: string;
  title?: string;
  chartLabel?: string;
  isDisabled?: boolean;
  isLoadingChartImg?: boolean;
  isInhalationDisabled: boolean;
}>();

const emits = defineEmits<{
  closeDialog: [];
  setChartType: [type: ChartDialogImgType];
}>();

const displayChartType = computed({
  get() {
    return props.chartType === 'oral' ? 0 : 1;
  },
  set(chartIndex: number) {
    const chartType = chartIndex === 0 ? 'oral' : 'inhalation';
    const isActionDisabled = chartType === 'oral' ? props.isOralDisabled : props.isInhalationDisabled;
    if (!isActionDisabled) {
      emits('setChartType', chartType);
    }
  },
});
</script>

<style scoped>
.chartImage
{
  width: 100%;
  height: 100%;
}
</style>
