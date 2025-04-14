<template>
  <Suspense>
    <div
      class="cursor-pointer"
      tabindex="0"
      @click="addRow"
      @keyup.enter="addRow"
      @keyup.space="addRow"
    >
      <nuxt-icon
        name="fa/circle-plus"
        class="mr-2 text-white"
      />
      <span class="text-white">Click here to add a row</span>
      <nuxt-icon

        name="fa/circle-plus"
        class="ml-2 text-white"
      />
    </div>
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams, IRowNode} from 'ag-grid-community';
import type {Dtxsid} from '~~/types';

const props = defineProps<{
  params: ICellRendererParams<BerCalcRow>;
}>();

const getRowNodes = () => {
  const rows: IRowNode<BerCalcRow>[] = [];
  props.params.api.forEachNodeAfterFilterAndSort((node) => {
    rows.push(node);
  });
  return rows;
};

const addRow = () => {
  const rows = getRowNodes();
  const existingIds = rows.filter(row => row.data?.uniqueId).map(row => row.data?.uniqueId);

  let newUniqueId = generateRandomNumberWithDigits(7);
  while (existingIds.includes(newUniqueId)) {
    newUniqueId = generateRandomNumberWithDigits(7);
  }

  const newRow: BerCalcRow = {
    podDropDown: '',
    exposureValue: '',
    exposureUnits: props.params.data?.exposureUnits || '',
    ber: '',
    type: 'Custom',
    preferredName: props.params.data?.preferredName || '',
    dtxsid: props.params.data?.dtxsid || '' as Dtxsid,
    podDropDownOptions: props.params.data?.podDropDownOptions || [],
    uniqueId: newUniqueId,
  };

  useEvent('update-seem3-ber-calc-row', {
    rowData: newRow,
    rowIndex: props.params.node.rowIndex as number,
  });
  props.params.api.applyTransaction({add: [newRow], addIndex: getRowNodes().length - 1});
};
</script>

<style scoped>

</style>
