<template>
  <Suspense>
    <div v-if="isChartRow">
      <Spinner
        v-if="isLoading"
        figure-class="spinner-figure"
        height="50"
        :show-caption="false"
        width="50"
      />
      <ChartDialog
        v-else
        :preferred-name="props.params.data?.preferredName || ''"
        :chart-type="chartType"
        :is-oral-disabled="!oralImg"
        :active-img="activeImg"
        :alt-text="activeAltText"
        :is-inhalation-disabled="!inhalationImg"
        :is-loading-chart-img="isRefreshingChartImg"
        :is-disabled="isChartDisabled"
        @set-chart-type="setChartType"
      >
        <template #title>
          <i>In Vivo</i>&nbsp;Toxicity Scatter Plot
        </template>
        <template #chart-label>
          <i>* Only In Vivo selections with units of mg/kg-day (oral) and mg/m3 (inhalation) are included *</i>
        </template>
        <template #append-actions>
          <UserExposureDialog
            :dtxsid="currentDtxsid"
            @update-exposure="updateExposure"
          />
        </template>
      </ChartDialog>
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import ChartDialog from '../../pod/dialogs/ChartDialog.vue';
import type {ChartDialogImgType} from '../../pod/types';
import {POD_SECTIONS} from '../../pod/constants';
import {embeddedImg} from '../../pod/helpers/helpers';
import {getChartImages} from '../../shared/helpers';
import {getToxNodeData} from '../../shared/mappers';
import UserExposureDialog from '../dialogs/UserExposureDialog.vue';
import type {
  PodData, Dtxsid, DtxsidMap,
} from '~~/types';
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';

const props = defineProps<{
  params: ICellRendererParams<PodData> & {
    dtxsid: Dtxsid;
    getDataSelected: () => DtxsidMap;
    getChartData: () => PodData[];
    hazardApiResponse: () => PodData[];
    exposureData: () => {
      dtxsid: Dtxsid;
      type: 'line' | 'range';
      value: string;
    }[];
    // eslint-disable-next-line no-unused-vars
    updateExposureData: (exposure: {
      dtxsid: Dtxsid;
      type: string;
      value: string | number;
    }) => void;
  };
}>();

// Dialog
const chartType = ref<ChartDialogImgType>('oral');
const inhalationImg = ref<string | null>('start');
const oralImg = ref<string | null>('start');
const inhalationAltText = ref<string>('');
const oralAltText = ref<string>('');
const activeImg = computed(() => chartType.value === 'oral' ? oralImg.value : inhalationImg.value);
const setChartType = (type: ChartDialogImgType) => {
  chartType.value = type;
};
const activeAltText = computed(() => chartType.value === 'oral' ? oralAltText.value : inhalationAltText.value);

const isRefreshingChartImg = ref(false);

// Exposure Dialog
const updateExposure = async({value, type}: {
  value: number;
  type: string;
}) => {
  try {
    isRefreshingChartImg.value = true;
    props.params.updateExposureData({
      value,
      dtxsid: currentDtxsid.value,
      type,
    });

    await setChartData();
  } finally {
    isRefreshingChartImg.value = false;
  }
};

// Button
const currentDtxsid = computed(() => {
  if (isChartRow.value) {
    return props.params.node.allLeafChildren?.[0]?.data?.dtxsid || '' as Dtxsid;
  }
  return '' as Dtxsid;
});
const isChartRow = computed(() => props.params.node.rowGroupIndex === 0);
const hasDataSelected = computed(() => {
  const data = props.params.getDataSelected();
  if (data) {
    return currentDtxsid.value in data;
  }
  return false;
});

// Refresh chart if selections change
watch(() => props.params.getDataSelected(), async(newVal, oldVal) => {
  const newSelections = newVal[currentDtxsid.value];
  const oldSelections = oldVal[currentDtxsid.value];

  // Avoid refresh of data for cells not changed
  if (!newSelections && !oldSelections) {
    return;
  }
  // Avoid refresh If both are identical
  if (Array.isArray(newSelections) && Array.isArray(oldSelections) &&
    (JSON.stringify(newSelections.sort()) === JSON.stringify(oldSelections.sort()))) {
    return;
  }

  await getChartData();
});

const embedImgToString = (imageBuffer: string | undefined) => {
  return imageBuffer ? embeddedImg(imageBuffer) : (imageBuffer || null);
};

const isLoading = ref(true);
const isChartDisabled = computed(() => (!inhalationImg.value && !oralImg.value) || !hasDataSelected.value);

const setChartData = async() => {
  const nodeData = getToxNodeData(props.params.node.allLeafChildren);
  const nodeDataDtxsid = props.params.node.allLeafChildren?.[0]?.data?.dtxsid;
  if (nodeData && nodeData.length && nodeDataDtxsid) {
    const {oralChart, inhalationChart} = await getChartImages({
      nodeDataDtxsid,
      section: POD_SECTIONS.IN_VIVO_TOX,
      showCustomData: true,
    });

    oralImg.value = embedImgToString(oralChart?.imageBuffer);
    inhalationImg.value = embedImgToString(inhalationChart?.imageBuffer);
    oralAltText.value = oralChart?.descriptiveText || '';
    inhalationAltText.value = inhalationChart?.descriptiveText || '';

    // Set chart type to inhalation if oral is unavailable.
    chartType.value = oralImg.value ? 'oral' : 'inhalation';
  }
};

const getChartData = async() => {
  try {
    isLoading.value = true;
    await setChartData();
  } finally {
    isLoading.value = false;
  }
};

onMounted(async() => {
  if (isChartRow.value) {
    await getChartData();
  }
});
</script>

<style scoped>

</style>
