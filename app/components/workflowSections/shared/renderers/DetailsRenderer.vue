<template>
  <Suspense>
    <span
      v-if="isRow"
      class="details-renderer-container"
    >
      <nuxt-icon
        name="fa/flask"
        class="rapidtox-icon"
        aria-label="Experimental Details"
        alt-text="Experimental Details"
        :tabindex="isIconEnabled('experimentalData') ? '0' : '-1'"
        :class="getIconClass('experimentalData')"
        @click="iconClickHandler('experimentalData')"
        @keyup.enter="iconClickHandler('experimentalData')"
      />
      <nuxt-icon
        name="fa/calculator"
        class="rapidtox-icon"
        aria-label="Predicted Details"
        alt-text="Predicted Details"
        :tabindex="isIconEnabled('predictedData') ? '0' : '-1'"
        :class="getIconClass('predictedData')"
        @click="iconClickHandler('predictedData')"
        @keyup.enter="iconClickHandler('predictedData')"
      />
      <DetailsDialog
        attach-class=".details-renderer-container"
        :show="showDialog"
        :title="dialogTitle"
        :row-data="dialogRowData"
        :column-defs="dialogColDefs"
        :type="currentDialogType"
        @close-dialog="dialogCloseHandler"
      />
    </span>
  </Suspense>
</template>

<script setup lang="ts">
import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import DetailsDialog from '../dialog/DetailsDialog.vue';
import type {
  PhyschemExperimental, PhyschemPredicted, PhyschemSummary,
} from '~/api/Physchem/types';

const props = defineProps<{
  params: ICellRendererParams<PhyschemSummary>;
}>();

interface DetailsType extends Pick<PhyschemSummary, 'experimentalData' | 'predictedData'> {}

const isRow = computed(() => !(props.params.node.group));

// Dialog Data
const showDialog = ref(false);
const dialogTitle = ref('');
const dialogColDefs = ref<ColDef<PhyschemPredicted | PhyschemExperimental>[]>([]);
const dialogRowData = ref<PhyschemPredicted[] | PhyschemExperimental[]>([]);
const currentDialogType = ref<keyof DetailsType>('experimentalData');

const getDialogTitle = (type: keyof DetailsType) => {
  const titlePrefix = `${type === 'experimentalData' ? 'Experimental' : 'Predicted'} Details`;
  return `${titlePrefix} ${props.params.data?.property || ''} ${props.params.data?.unit || ''}`;
};

const predictedData = computed(() => {
  if (!props.params.data?.predictedData) { return []; }
  return props.params.data?.predictedData;
});

const experimentalData = computed(() => {
  if (!props.params.data?.experimentalData) { return []; }
  return props.params.data?.experimentalData;
});

const isIconEnabled = (type: keyof DetailsType) => {
  return props.params.data?.[type] && Array.isArray(props.params.data?.[type]) && props.params.data?.[type].length;
};

const getIconClass = (type: keyof DetailsType) => isIconEnabled(type) ? 'rapidtox-icon' : 'disabled-icon';

const iconClickHandler = (type: keyof DetailsType) => {
  if (isIconEnabled(type)) {
    dialogTitle.value = getDialogTitle(type);
    dialogColDefs.value = type === 'experimentalData' ?
      expColumnDefs as ColDef<PhyschemPredicted | PhyschemExperimental>[] :
      predColumnDefs as ColDef<PhyschemPredicted | PhyschemExperimental>[];
    dialogRowData.value = type === 'experimentalData' ? experimentalData.value : predictedData.value;
    currentDialogType.value = type;
    showDialog.value = true;
  }
};

const dialogCloseHandler = () => {
  showDialog.value = false;

  // refocus cell when dialog closed via keyboard naivation
  nextTick(() => {
    gridUtil.gridEvents.refocusElementOnDialogClose(props.params);
  });
};
</script>
