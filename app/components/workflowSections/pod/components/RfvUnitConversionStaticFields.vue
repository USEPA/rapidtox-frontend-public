<template>
  <v-row>
    <template
      v-for="field in staticFields"
      :key="field.title"
    >
      <v-col cols="6">
        <v-text-field
          :id="`unit-conversion-${field.title}-${props.params?.data?.id || ''}-static-field`"
          readonly
          :model-value="field.value"
          :aria-label="field.title"
        >
          <template #prepend>
            {{ field.title }}
            <v-tooltip
              height="auto"
              width="200"
              open-on-focus
              :aria-label="field.tooltip"
            >
              <template #activator="{ props: tooltipProps }">
                <sup><nuxt-icon
                  name="b/info-circle"
                  v-bind="tooltipProps"
                  :alt="`${field.title} Information`"
                  tabindex="0"
                  class="rapidtox-icon min-nuxt-icon ml-1"
                /></sup>
              </template>
              <template #default>
                {{ field.tooltip }}
              </template>
            </v-tooltip>
          </template>
        </v-text-field>
      </v-col>
    </template>
  </v-row>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';

const props = defineProps<{
  params: ICellRendererParams<PodUncertaintyData>;
}>();

const dataObj = computed(() => {
  if ('selectedPODS' in (props.params?.data || {})) {
    const analogueData = (props.params?.data as AnaloguePodDataSelection)
      .selectedPODS.find(({id}) => id === props.params.data?.podId) as SelectedPod;
    return analogueData;
  }

  return props.params.data;
});

const staticFields = computed(() => {
  const {
    toxvalType, exposureRoute, speciesCommon, effect, studyType, superSource,
  } = dataObj.value as SelectedPod;

  return [
    {
      title: 'Type', value: toxvalType, tooltip: 'Indicates type of source DRSV (e.g., NOAEL, LOAEL, BMDL, etc.)',
    },
    {
      title: 'Exposure Route', value: exposureRoute, tooltip: 'Indicates route of chemical exposure resulting in the source DRSV',
    },
    {
      title: 'Species', value: speciesCommon, tooltip: 'Indicates species in which the source DRSV is identified',
    },
    {
      title: 'Critical Effect', value: effect, tooltip: 'Indicates the effect on which the source DRSV is based',
    },
    {
      title: 'Study Type', value: studyType, tooltip: 'Indicates the exposure duration associated with the source DRSV',
    },
    {
      title: 'Source', value: superSource, tooltip: 'Indicates the source of information populated in this unit conversion modal',
    },
  ];
});
</script>

<style scoped>

</style>
