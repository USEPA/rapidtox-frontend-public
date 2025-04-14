<template>
  <Suspense>
    <span
      v-if="props.params.node.level > 1"
      class="w-100"
    >
      <nuxt-icon
        name="fa/clone"
        class="uncertainty-clone-icon cursor-pointer"
        tabindex="0"
        alt="Duplicate Row"
        @click="addRowHandler"
        @keyup.enter="addRowHandler"
      /> /
      <UncertaintyRemoveConfirmDialog
        @remove-row-handler="removeRowHandler"
      />

    </span>
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams, IRowNode} from 'ag-grid-community';
import UncertaintyRemoveConfirmDialog from '../dialogs/UncertaintyRemoveConfirmDialog.vue';

const props = defineProps<{
  params: ICellRendererParams<PodUncertaintyData> & {
    podDataSelected: () => PodDataTypes[];
    // eslint-disable-next-line no-unused-vars
    setPodDataSelected: (podData: PodDataTypes[]) => void;
  };
}>();

const addRowHandler = () => {
  const uid = genUID('haz');
  const podData: PodDataTypes[] = JSON.parse(JSON.stringify(props.params.podDataSelected()));
  const selectedRow = podData.find(({id}) => id === props.params?.data?.id);
  props.params.setPodDataSelected(podData.concat([
    {
      ...selectedRow as PodDataTypes,
      id: uid,
      dupRow: true,
    },
  ]));
};

const removeRowHandler = () => {
  const rowToRemove: PodUncertaintyData[] = [];
  props.params.api.forEachNode((node: IRowNode<PodUncertaintyData>) => {
    if (node.data?.id && node.data?.id === props.params?.data?.id) {
      rowToRemove.push(node.data);
    }
  });
  const podData: PodDataTypes[] = props.params.podDataSelected().filter(pod => pod.id !== props.params?.data?.id);
  props.params.setPodDataSelected(podData);
};
</script>

<style scoped>
.uncertainty-clone-icon {
    color: green;
    font-size: 1.5em !important;
}
</style>
