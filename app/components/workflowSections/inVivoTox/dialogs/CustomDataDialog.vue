<template>
  <v-dialog
    v-model="showDialog"
    max-width="90%"
    max-height="90%"
    aria-label="Custom Data Input Form"
  >
    <v-card>
      <v-toolbar
        color="primary"
        :class="`pl-4 bg-${getWorkflowBgColor()}`"
        dark
      >
        Custom Data Input Form
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
        <CustomDataInputTable
          @add-data="customDataSubmitHandler"
        />

        <h1 class="mt-4">
          Custom Data Table
        </h1>
      </v-card-text>
      <CustomDataGrid
        :row-data="customData"
      />
      <v-card-actions>
        <v-btn
          text="Close"
          variant="flat"
          @click="showDialog = false"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {getWorkflowBgColor} from '../../shared/helpers';
import CustomDataInputTable from '../components/CustomDataInputTable.vue';
import CustomDataGrid from '../grids/CustomDataGrid.vue';
import type {Dtxsid, PodData} from '~~/types';

const hazardStore = useHazardStore();
const {$patch: hazardPatch} = hazardStore;
const {hazardChartData} = storeToRefs(hazardStore);

const {saveSession} = useSessionStore();

const props = defineProps<{
  show: boolean;
  dtxsid: Dtxsid;
  preferredName: string;
}>();

const emits = defineEmits<{
  closeDialog: [];
}>();
const customDataSubmitHandler = async(newCustomData: PodData) => {
  hazardPatch((state) => {
    state.hazardChartData.push({
      ...newCustomData,
      dtxsid: props.dtxsid,
      preferredName: props.preferredName,
    });
  });
  await saveSession('hazard');
};

const customData = computed(() => hazardChartData.value.filter(({dtxsid, superCategory}) => dtxsid === props.dtxsid &&
  (superCategory === SUPER_HAZARD_TYPES.CUSTOM_TOX_NAME ||
    superCategory === SUPER_HAZARD_TYPES.CUSTOM_POD_NAME)));

const showDialog = computed({
  get() {
    return props.show;
  },
  set() {
    emits('closeDialog');
  },
});
</script>

<style scoped>
/* :deep(.nuxt-icon svg) {
  height: 24px;
  width: 24px;
} */
</style>
