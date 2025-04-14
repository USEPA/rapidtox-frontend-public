<template>
  <v-dialog
    v-model="showDialog"
    :max-width="maxWidth"
    width="unset"
  >
    <v-card>
      <v-toolbar
        color="primary"
        :class="`pl-4 ${getWorkflowBgColor()}`"
        dark
      >
        <span>{{ props.title }}</span>
        <v-spacer />
        <v-btn
          class="chem-data-not-found-x-btn"
          data-testid="chem-data-not-found-x-btn"
          @click="showDialog = false"
        >
          <nuxt-icon
            id="chem-data-not-found-dialog-close-x"
            class="min-nuxt-icon"
            alt="Close"
            aria-label="Close"
            name="mdi/close"
          />
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <ag-grid-vue
          class="ag-theme-balham"
          :row-data="props.rowData"
          :column-defs="props.columnDefs"
          :style="`height: 400px; width: ${gridWidth}`"
          :row-height="100"
          :header-height="60"
          @on-grid-ready="onGridReady"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn
          text="Close"
          variant="flat"
          data-testid="chem-data-not-found-footer-close-btn"
          @click="showDialog = false"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type {ColDef, GridReadyEvent} from 'ag-grid-community';
import {getWorkflowBgColor} from '../helpers';
import type {
  PhyschemPredicted, PhyschemExperimental, PhyschemSummary,
} from '~/api/Physchem/types';

const emits = defineEmits<{
  closeDialog: [];
}>();

const props = defineProps<{
  show: boolean;
  attachClass?: string;
  title: string;
  type: keyof Pick<PhyschemSummary, 'experimentalData' | 'predictedData'>;
  rowData: PhyschemPredicted[] | PhyschemExperimental[];
  columnDefs: ColDef<PhyschemPredicted | PhyschemExperimental>[];
}>();

const showDialog = computed({
  get() {
    return props.show;
  },
  set() {
    emits('closeDialog');
  },
});

// Grid Config
const onGridReady = (params: GridReadyEvent) => {
  params.api.sizeColumnsToFit();
};

const maxWidth = '900';
const gridWidth = computed(() => {
  return props.type === 'experimentalData' ? `${Number.parseInt(maxWidth, 10) - 50}px` : '500px';
});
</script>

<style scoped>
</style>
