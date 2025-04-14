<template>
  <Suspense class="pod-name-suspense-container">
    <div class="pod-nam-container">
      <BerCalculatorConfirmRemoveDialog @remove-row="removeRow" />
      <v-select
        v-model="selectedOption"
        :items="items"
        tabindex="0"
        @update:model-value="onChange"
      />
    </div>
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import BerCalculatorConfirmRemoveDialog from '../dialogs/BerCalculatorConfirmRemoveDialog.vue';

const props = defineProps<{
  params: ICellRendererParams<BerCalcRow>;
}>();

const selectedOption = ref<string | number | {
  label: string; val: number;
}>('');

onMounted(() => {
  selectedOption.value = props.params.data?.podDropDown || '';
});

const onChange = () => {
  useEvent('update-seem3-ber-calc-row', {
    rowData: {
      ...props.params.data as BerCalcRow,
      podDropDown: selectedOption.value,
    },
    valueToUpdate: 'podDropDown',
    newVal: selectedOption.value,
    rowIndex: props.params.node.rowIndex as number,
  });
};

const removeRow = () => {
  if (props.params.data) {
    useEvent('update-seem3-ber-calc-remove-row', {rowData: props.params.data, rowIndex: props.params.node.rowIndex as number});
    props.params.api.applyTransaction({remove: [props.params.data]});
  }
};

const items = computed(() => props.params.data?.podDropDownOptions?.map(pod => ({
  title: pod.text,
  value: pod.value,
})));
</script>

<style scoped>
.pod-nam-container {
  height: 100%;
  display: inline-flex;
  width: 100%
}
.pod-name-suspense-container {
  height: 100%
}
</style>
