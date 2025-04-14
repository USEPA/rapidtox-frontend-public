<template>
  <Suspense>
    <v-tooltip
      v-if="props.params.text"
      open-on-focus
      :aria-label="tooltipText"
      :text="tooltipText"
      content-class="ag-grid-tooltip-class"
      :width="`${props.params.width || '400'}`"
    >
      <template #activator="{ props: tooltipProps }">
        <span
          v-bind="tooltipProps"
          :tabindex="`${props.params.focusable ? '0' : '-1'}`"
          :class="`tooltip-cursor ${props.params.dottedUnderline ? 'tooltip-dotted-underline' : ''}`"
        >{{ props.params.text }}</span>
      </template>
    </v-tooltip>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';

const props = defineProps<{
  params: ICellRendererParams & {
    tooltip: string;
    text: string;
    focusable?: boolean;
    dottedUnderline?: boolean;
    width?: string;
  };
}>();

const tooltipText = computed(() => {
  if (props.params.tooltip && props.params.tooltip !== '-') {
    return props.params.tooltip;
  }
  return props.params.text;
});
</script>

<style scoped>
.tooltip-dotted-underline {
  text-decoration: dotted underline;
}

.tooltip-cursor {
  cursor: help;
}
</style>
