<template>
  <Suspense>
    <div v-if="showBtn">
      <WorkflowButton
        tabindex="0"
        @click="clickHandler"
      >
        {{ hasCustomData ? 'Edit' : 'Add' }}
      </WorkflowButton>
      <CustomDataDialog
        :show="showDialog"
        :preferred-name="preferredName"
        :dtxsid="selectedDtxsid"
        @close-dialog="closeDialogHandler"
      />
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import CustomDataDialog from '../dialogs/CustomDataDialog.vue';
import WorkflowButton from '../../shared/components/WorkflowButton.vue';
import type {Dtxsid, PodData} from '~~/types';
import {SUPER_HAZARD_TYPES} from '#imports';

const props = defineProps<{
  params: ICellRendererParams<PodData> & {
    getChartData: () => PodData[];
  };
}>();
const clickHandler = () => {
  showDialog.value = true;
};

const showDialog = ref(false);

const closeDialogHandler = () => {
  showDialog.value = false;
  gridUtil.gridEvents.refocusElementOnDialogClose(props.params);
};

const showBtn = computed(() => props.params.node.rowGroupIndex === 0);

const selectedDtxsid = computed(() => {
  if (showBtn.value) {
    return props.params.node.allLeafChildren?.[0]?.data?.dtxsid as Dtxsid;
  }
  return '' as Dtxsid;
});

const preferredName = computed(() => {
  if (showBtn.value) {
    return props.params.node.allLeafChildren?.[0]?.data?.preferredName || '';
  }
  return '';
});
const hasCustomData = computed(() => {
  return props.params.getChartData().some(({superCategory, dtxsid}) => dtxsid === props.params.node
    .allLeafChildren?.[0]?.data?.dtxsid &&
    (superCategory === SUPER_HAZARD_TYPES.CUSTOM_POD_NAME ||
      superCategory === SUPER_HAZARD_TYPES.CUSTOM_TOX_NAME));
});
</script>

<style lang="scss" scoped>

</style>
