<template>
  <Suspense>
    <span v-if="!isMarkush">
      <WorkflowButton
        tabindex="0"
        @click="openDialog"
      >
        {{ hasExistingSelections ? 'edit' : 'select' }}
      </WorkflowButton>
    </span>
    <span v-else>
      <v-tooltip
        open-on-focus
        aria-label="Markush representation does not allow analogue search. Consider inputting explicit structural form."
      >
        <template #activator="{ props: tooltipProps }">
          <nuxt-icon
            tabindex="0"
            v-bind="tooltipProps"
            name="b/info-circle"
            class="rapidtox-icon cursor-help"
          />
        </template>
        <template #default>
          Markush representation does not allow analogue search. Consider inputting explicit structural form.
        </template>
      </v-tooltip>
    </span>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import WorkflowButton from '../../shared/components/WorkflowButton.vue';

const props = defineProps<{
  params: ICellRendererParams<SelectedChemical> & {
    hasSelections: () => boolean;
    // eslint-disable-next-line no-unused-vars
    openAnalogue: (analogueData: AnalogueSelectedChemical) => void;
  };
}>();

const isMarkush = computed(() => !!props.params.data?.isMarkush);

const hasExistingSelections = computed(() => props.params.hasSelections());

const openDialog = () => {
  const colId = props.params.colDef?.colId;
  const rowIndex = props.params.node.rowIndex;
  if (colId && rowIndex !== null) {
    props.params.openAnalogue({
      ...props.params.data as SelectedChemical,
      rowIndex,
      colId,
    });
  }
};
</script>

<style scoped>

</style>
