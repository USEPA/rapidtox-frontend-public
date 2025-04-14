<template>
  <Suspense>
    <ChartDialog
      v-if="showChartIcon && isChartRow && !isLoading"
      :preferred-name="preferredName"
      :chart-type="chartType"
      :active-img="activeImg"
      :chart-label="chartLabel"
      :alt-text="activeAltText"
      :title="preferredName"
      :is-oral-disabled="!oralImg"
      :is-inhalation-disabled="!inhalationImg"
      @set-chart-type="setChartType"
    />
    <Spinner
      v-else-if="showChartIcon && isChartRow && isLoading"
      figure-class="spinner-figure"
      height="50"
      :show-caption="false"
      width="50"
    />
    <span v-else />
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams, IRowNode} from 'ag-grid-community';
import type {ChartDialogImgType} from '../types';
import {embeddedImg} from '../helpers/helpers';
import ChartDialog from '../dialogs/ChartDialog.vue';
import {POD_SECTIONS} from '../constants';
import {getChartImages} from '../../shared/helpers';
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';
import type {
  DtxsidMap, PodData,
} from '~~/types';

const props = defineProps<{
  params: ICellRendererParams<AnaloguePodDataSelection | HazardPodDataSelection> & {
    section: string;
    hazardDataSelected: () => DtxsidMap | Record<string, never>;
    hazardChartData: () => PodData[];
    physchemDataSelected: () => DtxsidMap | Record<string, never>;
    analogueStepsData: () => AnalogueStepInfo[];
  };
}>();

// ChartDialog
const chartType = ref<ChartDialogImgType>('oral');
const inhalationImg = ref<string | null>('start');
const oralImg = ref<string | null>('start');
const inhalationAltText = ref<string>('');
const oralAltText = ref<string>('');
const setChartType = (type: ChartDialogImgType) => {
  chartType.value = type;
};
const activeImg = computed(() => chartType.value === 'oral' ? oralImg.value : inhalationImg.value);
const activeAltText = computed(() => chartType.value === 'oral' ? oralAltText.value : inhalationAltText.value);

const preferredName = ref('');

const isLoading = ref(false);

const isChartRow = computed(() => props.params.node.level === 0);

const showChartIcon = computed(() => inhalationImg.value || oralImg.value);

const getToxNodeData = (leafChildren: IRowNode<globalThis.HazardPodDataSelection>[] | null) => {
  if (leafChildren?.length) {
    const regExp = /[a-dA-D]|[f-zF-Z]/g;
    return leafChildren.reduce((acc, cv) => {
      if (!regExp.test(cv.data?.toxvalNumeric as string)) {
        acc.push({
          ...cv.data,
          toxvalNumeric: parseFloat(cv.data?.toxvalNumeric as string),
        } as HazardPodDataSelection);
      }
      return acc;
    }, [] as HazardPodDataSelection[]);
  }
  return [];
};

const getAnalogueNodeData = (leafChildren: IRowNode<globalThis.AnaloguePodDataSelection>[] | null) => leafChildren?.length ?
  [leafChildren?.[0]?.data] :
  [];

const embedImgToString = (imageBuffer: string | undefined) => {
  return imageBuffer ? embeddedImg(imageBuffer) : (imageBuffer || null);
};

const helpTextUnits = computed(() => chartType.value === 'oral' ? 'kg-day' : 'm^3');
const chartLabel = computed(() => `*All other candidate DRSVs with units other than
              mg/${helpTextUnits.value} are available in the accompanying table`);

const getChartData = async() => {
  const nodeData = props.params.section === 'In Vivo Toxicity' ?
    getToxNodeData(props.params.node.allLeafChildren as IRowNode<globalThis.HazardPodDataSelection>[]) :
    getAnalogueNodeData(props.params.node.allLeafChildren as IRowNode<globalThis.AnaloguePodDataSelection>[]);

  preferredName.value = nodeData?.[0]?.preferredName || '';
  const nodeDataDtxsid = nodeData[0]?.dtxsid;

  if (nodeData.length && nodeDataDtxsid) {
    const section = props.params.section.toLowerCase() === POD_SECTIONS.ANALOGUE ?
      POD_SECTIONS.ANALOGUE :
      POD_SECTIONS.IN_VIVO_TOX;
    const {oralChart, inhalationChart} = await getChartImages({
      nodeDataDtxsid,
      section,
    });
    oralImg.value = embedImgToString(oralChart?.imageBuffer);
    inhalationImg.value = embedImgToString(inhalationChart?.imageBuffer);
    oralAltText.value = oralChart?.descriptiveText || '';
    inhalationAltText.value = inhalationChart?.descriptiveText || '';

    // Set chart type to inhalation if oral is unavailable.
    chartType.value = oralImg.value ? 'oral' : 'inhalation';
  }
};

onMounted(async() => {
  if (isChartRow.value) {
    try {
      isLoading.value = true;
      await getChartData();
    } finally {
      isLoading.value = false;
    }
  }
});
</script>

<style scoped>
</style>
