<template>
  <div class="container-fluid">
    <div
      class="mt-2 row justify-content-center"
    >
      <section
        id="workflowSelect"
        aria-labelledby="workflow-select"
        class="col-md-12 col-lg-6 col-xl-5 col-xxl-4"
      >
        <h2>Please select a workflow below</h2>
        <v-select
          id="select-workflow"
          v-model="selectedWorkflow"
          data-cy="workflowSelect"
          title="select workflow"
          tabindex="0"
          role="search"
          type="datalist"
          label="Select Workflow"
          aria-labelledby="select-workflow"
          outline
          :items="workflows"
        >
          <template #item="{ props, item }">
            <v-list-item
              v-bind="props"
              :value="item.value"
              :disabled="item.raw.disabled"
              max-width="inherit"
              :data-cy="item.value"
              role="option"
              name="select item"
              :aria-label="item.title"
              tabindex="0"
            >
              <template #title>
                <span
                  :aria-label="item.title"
                  class="select-options"
                >{{ item.title }}</span>
              </template>
            </v-list-item>
          </template>
        </v-select>
      </section>
      <section
        id="sessionSelect"
        aria-labelledby="sessionSelect"
        class="col-md-12 col-lg-6 col-xl-5 col-xxl-4"
      >
        <h2>Please select a session below</h2>
        <ClientOnly>
          <v-select
            id="select-session"
            v-model="selectedSession"
            data-cy="sessionSelect"
            title="select session"
            tabindex="0"
            role="search"
            type="datalist"
            aria-label="select session"
            :label="selectedWorkflow ? 'Session Title' : ''"
            class="select-previous-sessions"
            :items="selectableOptions || ['No Data Found']"
            outline
            :disabled="!selectedWorkflow"
            @update:model-value="getPrevReports()"
          >
            <template #no-data>
              <span class="no-results-message">
                {{ noResultsMessage }}
              </span>
            </template>
            <template #item="{ item, props }">
              <v-list-item
                v-bind="props"
                :value="item.value"
                :data-cy="item.value"
                max-width="inherit"
                role="option"
                :name="item.title"
                :aria-label="item.title"
                tabindex="0"
              >
                <template #title>
                  <div :aria-labelledby="item.title">
                    <span class="select-options">{{ item.title }}</span>
                    <span class="select-options-date"><i>{{ dateFormat(item.raw.updateTimestamp) }}</i></span>
                  </div>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </ClientOnly>
      </section>
    </div>
    <div class="row">
      <div
        v-if="selectedSession"
        class="col-12"
      >
        <h3
          v-if="gridData.length === 0"
        >
          No Previously Generated Session Reports for this session.
        </h3>

        <h3
          v-else-if="gridData.length > 0 && !isLoading"
          style="text-align: left !important; font-size: 27.9px; padding-bottom: 20px; padding-top: 40px"
        >
          Previously Generated Session Reports
        </h3>
        <PreviousReportGrid
          v-show="gridData.length > 0"
          :is-loading="isLoading"
          grid-reference="prevReports"
          grid-heading="Previously Generated Reports"
          :grid-data="gridData"
          :grid-size="gridSize"
          @grid-ref="onGridRef"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {GridApi} from 'ag-grid-enterprise';
import type {PreviousReport} from '~/api/Report/types';
import PreviousReportGrid from '~/components/workflowSections/workflowReports/PreviousReportGrid.vue';

const sessionStore = useSessionStore();
const {previousUserSessions: selectableOptionsData} = storeToRefs(sessionStore);

const {setPreviousUserSessions: fillPreviousUserSessions} = sessionStore;
const gridSize = ref('height: 750px; width:100%; overflow:auto; text-align: left !important');
const gridData = ref<PreviousReport[]>([]);
const isLoading = ref(true);
const selectedWorkflow = ref('');
const selectedSession = ref('');
const workflows = ref([
  {
    title: 'Emergency Response',
    value: 'er',
  },
  {
    title: 'Human Health Assessment',
    value: 'hha',
  },
]);
const noResultsMessage = computed(() => {
  return !selectableOptions.value.length ? 'No selectable previous sessions.' : 'No matching sessions.';
});

const selectableOptions = computed(() => {
  return selectableOptionsData.value.filter(option => Object.prototype.hasOwnProperty.call(option, 'sessionTitle') && Object.prototype.hasOwnProperty.call(option, 'sessionKey') && option.workflow === selectedWorkflow?.value).map(result => ({
    ...result,
    title: result.sessionTitle,
    value: result.sessionKey,
    updateTimestamp: result.updateTimestamp,
    key: result.sessionKey,
  }));
});

watch(selectedWorkflow, (newVal) => {
  selectedSession.value = '';
});

onMounted(() => {
  fillPreviousUserSessions();
});

const dateFormat = (date: string) => {
  return new Date(date).toISOString().substring(0, 10);
};

const getPrevReports = async() => {
  const {$repositories} = useNuxtApp();
  if (selectedSession.value.length > 0) {
    isLoading.value = true;
    gridData.value = await $repositories.report.getPrevReports(selectedSession.value);
    if (gridData.value.length === 0) {
      gridData.value = [];
    }
    isLoading.value = false;
  }
};
const gridApi = shallowRef({});
const onGridRef = (params: {
  gridApi: GridApi<PreviousReport>;
}) => {
  gridApi.value = params.gridApi;
};
</script>

<style lang="scss" scoped>
:deep(.v-label.v-field-label) {
  color:black !important;
  opacity: .8 !important;
}
:deep(.v-label.v-field-label--floating) {
    --v-field-label-scale: 1.0em !important;
    font-size: var(--v-field-label-scale);
    visibility: hidden;
    max-width: 100%;
}

.no-results-message {
  font-size: 20px !important;
}
:deep(.select-options) {
  font-size: 18px !important;
}
.select-options-date {
  font-size: 12px;
  float: right;
}
</style>
