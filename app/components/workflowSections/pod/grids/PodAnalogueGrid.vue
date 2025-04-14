<template>
  <ag-grid-vue
    class="ag-theme-balham"
    :column-defs="analogueColumnDefs"
    :style="defaultGridstyle()"
    :grid-options="analogueGridOptions"
    :row-data="props.rowData"
    @first-data-rendered="onFirstRendered"
    @selection-changed="onSelectionChanged"
  />
</template>

<script setup lang="ts">
import type {FirstDataRenderedEvent, SelectionChangedEvent} from 'ag-grid-community';
import {defaultGridstyle} from '../../shared/helpers';
import ChartRenderer from '../renderers/ChartRenderer.vue';
import {defaultUncertaintyFactorData, mapDuplicateAndExistingSelections} from '../helpers/helpers';
import type {PodSectionName, PodTempObj} from '../types';
import RFVLabels from '~/assets/fixtures/UncertaintyRFVLabels.json';
import type {Dtxsid} from '~~/types';

const props = defineProps<{
  rowData: AnaloguePodDataSelection[];
  podDataSelected: PodDataTypes[];
  section: PodSectionName;
}>();

const emits = defineEmits<{
  updatePodDataSelected: [podData: PodDataTypes[]];
}>();

const analogueColumnDefs = computed(() => podAnalogueColumnsDefs);
const analogueGridOptions = computed(() => podAnalogueGridOptions);
const analoguePodDataSelected = computed(() => props.podDataSelected
  .filter(podData => podData.section.toLowerCase() === props.section.toLowerCase() &&
    !podData.dupRow) as AnaloguePodDataSelection[]);

const fillPreviousSelections = (params: FirstDataRenderedEvent<AnaloguePodDataSelection>) => {
  params.api.forEachNodeAfterFilterAndSort((node) => {
    const nodeObj = analoguePodDataSelected.value
      .find(({dtxsid, podId}) => podId === node.data?.podId && dtxsid === node.data?.dtxsid);
    if (node.level === 1 && nodeObj) {
      node.setSelected(true);
    }
  });
};

const onFirstRendered = (params: FirstDataRenderedEvent<AnaloguePodDataSelection>) => {
  fillPreviousSelections(params);
  params.api.expandAll();
};

const onSelectionChanged = (params: SelectionChangedEvent<AnaloguePodDataSelection>) => {
  const selectedRows = params.api.getSelectedRows();
  const dataMap = [] as AnaloguePodDataSelection[];

  if (selectedRows.length) {
    params.api.forEachNodeAfterFilterAndSort((node) => {
      if (node.isSelected() && node.level === 1) {
        const tempObj = {} as PodTempObj;
        const podIdFound = analoguePodDataSelected.value.find(pod => pod.podId === node.data?.podId);
        if (podIdFound && ('id' in podIdFound)) {
          tempObj.id = podIdFound.id;
          tempObj.rfvLabel = podIdFound.rfvLabel || '';
        } else {
          tempObj.id = genUID('pod');
          tempObj.rfvLabel = '';
        }
        tempObj.podId = node.data?.podId as string;
        tempObj.section = props.section.toLowerCase();
        tempObj.dtxsid = node.data?.dtxsid as Dtxsid;
        tempObj.readAcrossDtxsid = node.data?.readAcrossDtxsid as Dtxsid;
        tempObj.readAcrossValue = node.data?.readAcrossValue as number | string;
        tempObj.toxvalUnits = node.data?.toxvalUnits as string;
        tempObj.rfvLabelOptions = tempObj.rfvLabelOptions || RFVLabels.map(label => label);
        tempObj.preferredName = node.data?.preferredName as string;
        tempObj.uncertaintyFactorData = tempObj.uncertaintyFactorData ||
          JSON.parse(JSON.stringify(defaultUncertaintyFactorData));
        dataMap.push({
          ...JSON.parse(JSON.stringify(node.data)),
          ...tempObj,
        });
      }
    });
  }
  const currentSelectedPodIds = dataMap.map(({podId}) => podId);
  const {updatedDups, otherSectionSelections} =
    mapDuplicateAndExistingSelections(props.section, currentSelectedPodIds, props.podDataSelected);
  emits('updatePodDataSelected', dataMap.concat(otherSectionSelections as AnaloguePodDataSelection[], updatedDups as AnaloguePodDataSelection[]));
};

defineExpose({
  ChartRenderer,
});
</script>

<style scoped>

</style>
