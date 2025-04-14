<template>
  <ag-grid-vue
    class="ag-theme-balham"
    :column-defs="inVivoToxColDefs"
    :style="defaultGridstyle()"
    :row-data="gridData"
    :group-row-renderer-params="groupRowRendererParams"
    :grid-options="inVivoToxGridOptions"
    @first-data-rendered="onFirstRendered"
    @selection-changed="onSelectionChanged"
  />
</template>

<script setup lang="ts">
import type {
  FirstDataRenderedEvent, SelectionChangedEvent,

} from 'ag-grid-community';
import {defaultGridstyle} from '../../shared/helpers';
import ChartRenderer from '../renderers/ChartRenderer.vue';
import {defaultUncertaintyFactorData, mapDuplicateAndExistingSelections} from '../helpers/helpers';
import type {PodSectionName, PodTempObj} from '../types';
import BasicFocusableTooltipRenderer from '../../shared/renderers/BasicFocusableTooltipRenderer.vue';
import RFVLabels from '~/assets/fixtures/UncertaintyRFVLabels.json';
import type {
  Dtxsid, DtxsidMap, PodData,
} from '~~/types';

const inVivoToxColDefs = computed(() => podHazardColumnsDefs);
const inVivoToxGridOptions = computed(() => podHazardGridOptions);
const groupRowRendererParams = {
  suppressCount: true,
};

const props = defineProps<{
  rowData: PodData[];
  podDataSelected: PodDataTypes[];
  hazardDataSelected: DtxsidMap | Record<string, never>;
  hazardChartData: PodData[];
  section: PodSectionName;
}>();

const gridData = computed(() => props.rowData
  .concat(props.hazardChartData.filter(({
    id, dtxsid,
  }) => (props.hazardDataSelected as DtxsidMap)?.[dtxsid]?.includes(id))));

const emits = defineEmits<{
  updatePodDataSelected: [podData: PodDataTypes[]];
}>();

const hazardPodDataSelected = computed(() => props.podDataSelected
  .filter(({section}) => section.toLowerCase() === props.section.toLowerCase()));

const fillPreviousSelections = (params: FirstDataRenderedEvent<PodData>) => {
  const hazardPodDataSelectedMap = hazardPodDataSelected.value.reduce((acc, cv) => {
    const key = `${cv.dtxsid}-${cv.podId}`;
    acc[key] = true;
    return acc;
  }, {} as {
    [key: string]: boolean;
  });
  params.api.forEachNodeAfterFilterAndSort((node) => {
    if (node.level === 2 && node.selectable) {
      const key = `${node.data?.dtxsid}-${node.data?.id}`;
      if (key in hazardPodDataSelectedMap) {
        node.setSelected(true, false);
      }
    }
  });
};

const onFirstRendered = (params: FirstDataRenderedEvent<PodData>) => {
  fillPreviousSelections(params);
  params.api.expandAll();
};

const onSelectionChanged = (params: SelectionChangedEvent<PodData>) => {
  if (params.source === 'checkboxSelected' || params.source === 'uiSelectAll') {
    const selectedRows = params.api.getSelectedRows();
    const dataMap = [] as HazardPodDataSelection[];
    if (selectedRows.length) {
      params.api.forEachNodeAfterFilterAndSort((node) => {
        const tempObj = {} as PodTempObj;
        if (node.isSelected() && node.level === 2) {
          const podIdFound = hazardPodDataSelected.value.find(pod => pod.podId === node.data?.id);
          if (podIdFound && ('id' in podIdFound)) {
            tempObj.id = podIdFound.id as string;
            tempObj.rfvLabel = podIdFound.rfvLabel || '';
          } else {
            tempObj.id = genUID('pod');
            tempObj.rfvLabel = '';
          }
          tempObj.podId = node.data?.id;
          tempObj.section = props.section;
          tempObj.dtxsid = node.data?.dtxsid as Dtxsid;
          tempObj.toxvalNumeric = node.data?.toxvalNumeric as number | string;
          tempObj.toxvalUnits = node.data?.toxvalUnits as string;
          tempObj.preferredName = node.data?.preferredName as string;
          tempObj.rfvLabelOptions = tempObj?.rfvLabelOptions || RFVLabels.map(label => label);
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
    emits('updatePodDataSelected', dataMap.concat(otherSectionSelections as HazardPodDataSelection[], updatedDups as HazardPodDataSelection[]));
  }
};

defineExpose({
  ChartRenderer,
  BasicFocusableTooltipRenderer,
});
</script>

<style scoped>

</style>
