<template>
  <Suspense>
    <v-tooltip
      v-if="hasData"
      open-on-focus
      :aria-label="tooltipDisplay"
      :text="tooltipDisplay"
      width="400"
    >
      <template #activator="{ props: tooltipProps }">
        <nuxt-icon
          tabindex="0"
          v-bind="tooltipProps"
          data-cy="checkIcon"
          name="b/check-lg"
          class="ml-2 selection-check rapidtox-icon"
        />
      </template>
    </v-tooltip>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';

const props = defineProps<{
  params: ICellRendererParams<SelectedChemical> & {
    tooltipText: string;
    type: string;
  };
}>();

const tooltipDisplay = computed(() => props.params?.tooltipText || '');
const hasData = computed(() => !!props.params?.data?.[props.params.type as keyof SelectedChemical]);
</script>

<style scoped>
.selection-check
{
  cursor: help !important;
}
</style>
