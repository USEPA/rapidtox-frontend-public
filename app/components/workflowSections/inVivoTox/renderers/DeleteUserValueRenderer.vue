<template>
  <WorkflowButton
    tabindex="0"
    @click="deleteCustomData"
  >
    Delete
  </WorkflowButton>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import WorkflowButton from '../../shared/components/WorkflowButton.vue';
import type {
  PodData,
} from '~~/types';

const props = defineProps<{
  params: ICellRendererParams<PodData>;
}>();

const {hazardChartData} = storeToRefs(useHazardStore());
const {saveSession} = useSessionStore();

const deleteCustomData = async() => {
  hazardChartData.value = hazardChartData.value.filter(({id}) => id !== props.params?.data?.id);
  await saveSession('hazard');
};
</script>

<style scoped>

</style>
