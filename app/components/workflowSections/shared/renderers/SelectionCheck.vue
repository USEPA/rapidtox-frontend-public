<template>
  <Suspense>
    <v-tooltip
      v-if="props.params.hasData() || props.params.containsData()"
      :aria-label="getIconTitle"
      open-on-focus
      height="auto"
      content-class="ag-grid-tooltip-class"
      width="250"
    >
      <template #activator="{ props: tooltipProps }">
        <nuxt-icon
          tabindex="0"
          v-bind="tooltipProps"
          :name="getIconName"
          class="rapidtox-icon cursor-help"
          data-testid="selection-check-icon"
        />
      </template>
      <template #default>
        {{ getIconTitle }}
      </template>
    </v-tooltip>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';

const props = defineProps<{
  params: ICellRendererParams<SelectedChemical> & {
    section: string;
    hasData: () => boolean;
    containsData: () => boolean;
  };
}>();

const getIconName = computed(() => {
  if (props.params.containsData()) {
    return 'b/check2';
  }
  if (props.params.hasData()) {
    return 'b/info-circle';
  }
  return '';
});

const getIconTitle = computed(() => {
  if (props.params.containsData()) {
    return `${props.params.section} data selected for this chemical`;
  }
  if (props.params.hasData()) {
    return `${props.params.section} data was available but was not selected for this chemical`;
  }
  return '';
});
</script>

<style scoped>

</style>
