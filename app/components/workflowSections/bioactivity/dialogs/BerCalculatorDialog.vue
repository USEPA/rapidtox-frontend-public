<template>
  <v-dialog
    aria-label="Custom BER Calculator"
    max-width="900"
    height="85%"
    @after-enter="onDialogOpen"
    @after-leave="isLoading = true"
  >
    <template #activator="{ props: dialogProps }">
      <v-btn
        v-bind="dialogProps"
        tabindex="0"
        variant="text"
        aria-label="Custom BER Calculator"
        size="large"
      >
        <template #prepend>
          <nuxt-icon
            name="fa/calculator"
            class="rapidtox-icon"
          />
        </template>
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar
          color="primary"
          :class="`pl-4 bg-${getWorkflowBgColor()}`"
          tag="section"
          dark
        >
          Custom BER Calculator
          <v-spacer />
          <v-btn
            @click="isActive.value = false"
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
          <v-container>
            <v-row justify="center">
              <v-col
                cols="8"
              >
                <v-alert
                  type="warning"
                  class="text-black fs-4"
                  aria-label="Unit Alert"
                >
                  <span>All calculations should use mg/kg/day.</span>
                </v-alert>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <Spinner
                  v-if="isLoading"
                  height="300"
                  width="300"
                />
                <BioactivityBerCalculatorGrid
                  v-else
                  ref="seem3GridRef"
                  :row-data="berCalcRowData"
                />
              </v-col>
            </v-row>
            <v-row
              v-if="!isSaveEnabled"
              justify="center"
            >
              <v-col
                cols="8"
              >
                <v-alert
                  type="error"
                  class="fs-6"
                  aria-label="Unit Alert"
                >
                  <span>All entries must have a DRSV-NAM selection and a valid Exposure Value(number above 0).</span>
                </v-alert>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Close"
            variant="flat"
            @click="isActive.value = false"
          />
          <WorkflowButton
            text="Save"
            :disabled="!isSaveEnabled"
            @click="save(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import {getWorkflowBgColor} from '../../shared/helpers';
import BioactivityBerCalculatorGrid from '../grids/BioactivityBerCalculatorGrid.vue';
import WorkflowButton from '../../shared/components/WorkflowButton.vue';
import type {UpdateBerSeem3CalcEvent} from '../types';
import type {BioactivityBerRes} from '~/api/Bioactivity/types';
import type {Dtxsid} from '~~/types';
import Spinner from '~/components/layout/UI/Spinner/Spinner.vue';

const props = defineProps<{
  params: ICellRendererParams<BioactivityBerRes> & {
    berCalcData: () => BerCalcData[];
    // eslint-disable-next-line no-unused-vars
    saveBerCalcEntry: (data: SaveBerCalcEntryParams) => void;
  };
}>();

/** Grid & Form Data - Every time this dialog opens the grid data is created and used for
  making updates/adding rows. None of the updates/new rows are persisted until
  the save button is pressed. */
const berCalcRowData = ref<BerCalcRow[]>([]);

const isLoading = ref(true);

const actualDataRows = computed(() => berCalcRowData.value.filter(row => !row.addRow));

const seem3GridRef = ref<InstanceType<typeof BioactivityBerCalculatorGrid>>();

const onDialogOpen = () => {
  berCalcRowData.value = props.params.data && props.params.data?.dtxsid ?
    (props.params.berCalcData().find(({dtxsid}) => dtxsid === props.params.data?.dtxsid)?.rows
      ?.filter(row => !row.default && !row.hide) || []) :
    [];

  useOn('update-seem3-ber-calc-row', (params) => {
    updateBerCalcRow(params);
  });

  useOn('update-seem3-ber-calc-remove-row', ({rowData, rowIndex}) => {
    removeRow({rowData, rowIndex});
  });
  isLoading.value = false;
};

/** All update/remove calculator events */

// Ber Value (calculated from pod / exposure)
const getBerCalculation = (podDropDown: string | number | {
  label: string;
  val: number;
} | undefined, exposureValue: string | number | undefined) => {
  if (typeof exposureValue === 'undefined' || typeof podDropDown === 'undefined') {
    return null;
  }

  // get Pod Val
  const parsedPodVal = typeof podDropDown === 'object' && podDropDown.val ? podDropDown.val : podDropDown;

  return Number(parsedPodVal) / Number(exposureValue);
};
const updateBer = (rowIndex: number, rowData: BerCalcRow) => {
  if (seem3GridRef.value?.gridApi && typeof rowData.uniqueId === 'number') {
    const idxToUpdate = berCalcRowData.value.findIndex(row => row.uniqueId === rowData.uniqueId);
    const rowToUpdate = seem3GridRef.value?.gridApi.getDisplayedRowAtIndex(rowIndex);
    if (idxToUpdate >= 0 && rowToUpdate) {
      const calcRow = berCalcRowData.value[idxToUpdate];
      const ber = getBerCalculation(calcRow?.podDropDown, calcRow?.exposureValue);
      if (!Number.isNaN(ber) && ber !== Infinity && ber !== null) {
        calcRow!.ber = ber;
        rowToUpdate.setDataValue('ber', ber);
        useEvent('update-seem3-ber-value', {
          rowData, rowIndex, ber,
        });
      }
    }
  }
};

// Update exposure number value or pod-nam dropdown
const updateBerCalcRow = ({
  rowData, valueToUpdate, newVal, rowIndex,
}: UpdateBerSeem3CalcEvent) => {
  const rowDataToUpdateIdx = berCalcRowData.value
    .findIndex(row => !row.addRow && row.uniqueId === rowData.uniqueId &&
      row.dtxsid === rowData.dtxsid);
  if (rowDataToUpdateIdx >= 0) { // update existing
    berCalcRowData.value[rowDataToUpdateIdx] = {
      ...berCalcRowData.value[rowDataToUpdateIdx],
      ...(valueToUpdate && {[valueToUpdate]: newVal}),
    } as BerCalcRow;

    updateBer(rowIndex, berCalcRowData.value[rowDataToUpdateIdx]);
  } else { // add new
    berCalcRowData.value.splice(berCalcRowData.value.length - 1, 0, rowData);
    updateBer(rowIndex, rowData);
  }
};

// Removing row
const removeRow = ({rowData, rowIndex}: Pick<UpdateBerSeem3CalcEvent, 'rowData' | 'rowIndex'>) => {
  const rowDataToUpdateIdx = berCalcRowData.value
    .findIndex(row => row.uniqueId === rowData.uniqueId &&
      row.dtxsid === rowData.dtxsid);
  if (rowDataToUpdateIdx >= 0 && typeof rowData.uniqueId === 'number') {
    berCalcRowData.value.splice(rowIndex, 1);
  }
};

/** Save Button */
const isSaveEnabled = computed(() => {
  // Must be able to save with NO entries in case of user removing existing entries.
  if (!actualDataRows.value.length) {
    return true;
  }

  return actualDataRows.value.every(row => row.podDropDown &&
    row.exposureValue &&
    Number(row.exposureValue) > 0 &&
    Number(row.exposureValue) <= Number.MAX_SAFE_INTEGER);
});

const save = (isActive: globalThis.Ref<boolean, boolean>) => {
  if (isSaveEnabled.value) {
    props.params.saveBerCalcEntry({
      dtxsid: props.params.data?.dtxsid as Dtxsid,
      rowData: actualDataRows.value,
    });
    isActive.value = false;
  }
};
</script>

<style scoped>

</style>
