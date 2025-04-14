<template>
  <Suspense>
    <v-tooltip
      v-if="props.params.value"
      open-on-focus
      content-class="ag-grid-tooltip-class"
      :aria-label="tooltip"
      :text="tooltip"
      width="400"
    >
      <template #activator="{ props: tooltipProps }">
        <span
          v-bind="tooltipProps"
          tabindex="0"
          class="workflow-property-column-with-tooltip"
        >{{ text }}</span>
      </template>
    </v-tooltip>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import type {PhyschemSummary} from '~/api/Physchem/types';
import physchemPropertyTooltips from '~/assets/fixtures/physchemPropertyTooltips.json';

const props = defineProps<{
  params: ICellRendererParams<PhyschemSummary>;
}>();

const unit = (props.params.data?.unit ? `(${props.params.data?.unit})` : '');
const text = computed(() => `${props.params.data?.property || ''} ${unit}`);

// TODO: Not sure why there are converted in original code? Need to dig deeper before removing/refactoring.
const getPropertyJsonKey = (property: string | undefined) => {
  switch (property) {
    case 'Atmos. Hydroxylation Rate':
      return 'Atmospheric Hydroxylation Rate';
    case 'Biodeg. Half-Life':
      return 'Biodegradation Half-Life';
    case 'Fish Biotrans. Half-Life (Km)':
      return 'Fish Biotransformation Half-Life (Km)';
    case 'Soil Adsorp. Coeff. (Koc)':
      return 'Soil Adsorption Coefficient (Koc)';
    default:
      return property;
  }
};

const tooltip = computed(() => {
  const property = getPropertyJsonKey(props.params.data?.property);
  return property && property in physchemPropertyTooltips ?
    physchemPropertyTooltips[property as keyof typeof physchemPropertyTooltips] :
    property;
});
</script>

<style scoped>
.workflow-property-column-with-tooltip {
  cursor: help;
  text-decoration: dotted underline;
}
</style>
