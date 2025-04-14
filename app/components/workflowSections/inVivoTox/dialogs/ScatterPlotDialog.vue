<template>
  <v-dialog
    v-model="showDialog"
    name="Scatter Plot Dialog"
    aria-label="Scatter Plot Dialog"
    max-width="1100"
  >
    <v-card>
      <v-toolbar
        color="primary"
        :class="`pl-4 bg-${getWorkflowBgColor()}`"
        dark
      >
        <i>In Vivo</i>&nbsp;Toxicity Scatter Plot
        <v-spacer />
        <v-btn
          @click="showDialog = false"
        >
          <nuxt-icon
            class="min-nuxt-icon text-white"
            alt="Close"
            aria-label="Close"
            name="mdi/close"
          />
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <p>
          <i>* Only In Vivo selections with units of mg/kg-day (oral) and mg/m3 (inhalation) are included *</i>
        </p>

        <v-row>
          <v-col sm="12">
            <ScatterPlotChartGrid
              v-if="chartOptions"
              :options="chartOptions"
            />
          </v-col>
          <v-col
            sm="3"
            offset="3"
          >
            <WorkflowButton
              @click="showExposureDialog = true"
            >
              Insert Exposure
            </WorkflowButton>
          </v-col>
          <v-col sm="4">
            <v-radio-group
              v-model="exposureRoute"
              inline
              class="text-center"
            >
              <v-radio
                label="Oral"
                value="oral"
              />
              <v-radio
                value="inhalation"
                label="Inhalation"
              />
            </v-radio-group>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text="Close"
          variant="flat"
          @click="showDialog = false"
        />
      </v-card-actions>
    </v-card>
    <UserExposureDialog
      :show="showExposureDialog"
      :ber-data="berData"
      :dtxsid="selectedDtxsid"
      @close-exposure-dialog="showExposureDialog = false"
      @update-exposure="updateExposure"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import type {
  AgBaseChartOptions,
  AgBaseCrossLineOptions,
} from 'ag-charts-community';
import type {AgScatterSeriesOptions} from 'ag-grid-enterprise';
import WorkflowButton from '../../shared/components/WorkflowButton.vue';
import {getWorkflowBgColor} from '../../shared/helpers';
import ScatterPlotChartGrid from '../grids/ScatterPlotChartGrid.vue';
import {
  filterByRoute, filterUnits, getChartOptions, getExposureData, getSeriesData, mapChartData,
} from '../helpers/scatterPlotHelpers';
import UserExposureDialog from './UserExposureDialog.vue';
import type {
  Dtxsid, DtxsidMap, PodData,
} from '~~/types';
import type {BioactivityBerRes} from '~/api/Bioactivity/types';

const props = defineProps<{
  show: boolean;
  hazardDataSelected: DtxsidMap;
  hazardChartData: PodData[];
  exposureData: ExposureChartData[];
  data: PodData[];
  selectedDtxsid: Dtxsid;
}>();

const emits = defineEmits<{
  closeDialog: [];
}>();

const {$patch: hazardPatch} = useHazardStore();

const showDialog = computed({
  get() {
    return props.show;
  },
  set() {
    emits('closeDialog');
  },
});

// Form Values
const exposureRoute = ref<'oral' | 'inhalation'>('oral');

// User Exposure Dialog
const showExposureDialog = ref(false);
const berData = ref<BioactivityBerRes[]>([]);
const exposureLine = ref(0);

const updateExposure = ({value, type}: {
  value: number; type: string;
}) => {
  const currentExposureValues = [...props.exposureData];
  const newExposure = {
    value,
    dtxsid: props.selectedDtxsid,
    type,
  };

  try {
    if (currentExposureValues.length && currentExposureValues.some(exposure => exposure.dtxsid === props.selectedDtxsid)) {
      const exposureIdx = currentExposureValues.findIndex(exposure => exposure.dtxsid === props.selectedDtxsid);
      hazardPatch((state) => {
        state.chartExposure[exposureIdx] = newExposure;
      });
      return;
    }
    hazardPatch((state) => {
      state.chartExposure.push(newExposure);
    });
  } finally {
    showExposureDialog.value = false;
  }
};

// Chart
export interface ChartPodData {
  study: string;
  toxVal?: number;
  type?: string;
  species?: string;
  source?: string;
}

const getFilteredData = (podData: PodData[]) => podData.filter(({id, dtxsid}) => dtxsid === props.selectedDtxsid &&
  props.hazardDataSelected[props.selectedDtxsid]?.includes(id));

const selectedHazardData = computed(() => getFilteredData(props.data));

const selectedChartData = computed(() => getFilteredData(props.hazardChartData));
const combinedChartData = computed(() => selectedChartData.value
  .filter(podData => filterByRoute(podData, exposureRoute.value))
  .concat(selectedHazardData.value.filter(podData => filterByRoute(podData, exposureRoute.value)))
  .filter(({toxvalUnits}) => filterUnits(toxvalUnits)));

watch(showDialog, async(newVal, oldVal) => {
  if (newVal && !oldVal) {
    const {$repositories} = useNuxtApp();
    berData.value = await $repositories.bioactivity.getBioactivityBerData([props.selectedDtxsid]);
    exposureLine.value = 0;
  }
});

const exposureData: AgBaseCrossLineOptions = computed(() => {
  if (props.exposureData && props.exposureData.some(exposure => exposure.dtxsid === props.selectedDtxsid)) {
    const expVal = props.exposureData.find(exp => exp.dtxsid === props.selectedDtxsid) as ExposureChartData;
    return getExposureData(expVal);
  }
  return [];
});

const mappedData = () => {
  return mapChartData(combinedChartData.value);
};

const chartOptions: Ref<AgBaseChartOptions> = computed(() => {
  const data = mappedData();
  const seriesData = getSeriesData(data) as AgScatterSeriesOptions[];
  return getChartOptions(seriesData, exposureData.value, props.exposureData, props.selectedDtxsid, exposureRoute.value);
});
</script>

<style scoped>

</style>
