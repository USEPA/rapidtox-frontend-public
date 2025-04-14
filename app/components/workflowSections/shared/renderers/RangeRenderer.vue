<template>
  <Suspense>
    <v-tooltip
      v-if="range"
      open-on-focus
      :aria-label="range"
      :text="range"
      content-class="ag-grid-tooltip-class"
      width="auto"
    >
      <template #activator="{ props: tooltipProps }">
        <span
          v-bind="tooltipProps"
          tabindex="0"
          data-testid="range-span-activator"
        >{{ range }}</span>
      </template>
    </v-tooltip>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import type {PhyschemSummary} from '~/api/Physchem/types';

const props = defineProps<{
  params: ICellRendererParams<PhyschemSummary> & {
    min: keyof PhyschemSummary;
    max: keyof PhyschemSummary;
  };
}>();

const range = computed(() => {
  if (props.params.node.group) {
    return null;
  }

  const min = props.params.data?.[props.params.min];
  const max = props.params.data?.[props.params.max];

  if (!min && !max) {
    return '';
  }

  if (!min) {
    return roundedValueFormatter(max as number).toString();
  }

  if (!max) {
    return roundedValueFormatter(min as number).toString();
  }

  if (min === max) {
    return roundedValueFormatter(max as number).toString();
  }

  return `${roundedValueFormatter(min as number).toString()} to ${roundedValueFormatter(max as number).toString()}`;
});
</script>

<style scoped>

</style>
