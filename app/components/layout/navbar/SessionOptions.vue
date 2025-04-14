<template>
  <section>
    <SessionModal
      :workflow="workflow"
      :from-workflow="true"
    />
    <v-menu
      v-if="inWorkflow"
      attach="#top-nav-bar"
      role="button"
      open-on-hover
    >
      <template #activator="{ props }">
        <v-btn
          color="white"
          class="session-dropdown"
          flat
          v-bind="props"
        >
          Session Options
        </v-btn>
      </template>
      <v-list
        attach="#top-nav-bar"
        role="list"
      >
        <v-list-item
          style="border-bottom: 1px solid black; pointer-events: none !important;"
          role="listitem"
        >
          Session Name: {{ sessionTitle }}
        </v-list-item>
        <v-list-item
          role="listitem"
          data-cy="saveSessionTab"
          tabindex="0"
          @click="doSaveSession"
          @shortkey="doSaveSession"
        >
          <span title="Click here to manually save your current session.">
            <nuxt-icon
              name="b/cloud-upload"
              alt="Save Session"
              aria-hidden="true"
              class="ml-2 new-session-icon"
            /> Save Session
          </span>
        </v-list-item>
        <v-list-item
          ref="showResetTab"
          role="listitem"
          data-cy="showResetTab"
          tabindex="0"
          @click="showReset"
        >
          <span
            title="Click here to restart your selections to your current session. All generated reports will remain saved."
          >
            <nuxt-icon
              name="b/arrow-counterclockwise"
              alt="Restart Session"
              aria-hidden="true"
              class="ml-2 new-session-icon"
            /> Restart Selections
          </span>
        </v-list-item>
        <v-list-item
          ref="showPrevReports"
          data-cy="showPrevReportsTab"
          role="listitem"
          tabindex="0"
          @click="showPrevReportsModal"
        >
          <span
            title="Click here to view previous reports for your current session."
          >
            <nuxt-icon
              name="b/arrow-counterclockwise"
              alt="Restart Session"
              aria-hidden="true"
              class="ml-2 new-session-icon"
            /> Previous Session Reports
          </span>
        </v-list-item>
        <v-list-item
          role="listitem"
          data-cy="showNewSessionTab"
          tabindex="0"
          @click="showNewSessionModal"
        >
          <span
            title="Click here to start a new session."
          >
            <nuxt-icon
              name="b/file-earmark-fill"
              alt="Start New Session"
              aria-hidden="true"
              class="ml-2 new-session-icon"
            /> New Session
          </span>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog
      aria-label="restart session selections"
      :activator="showResetTab"
      max-width="540"
    >
      <template #default="{ isActive }">
        <v-card>
          <template #title>
            <section
              :class="`pl-4 p-2 text-white ${workflowBG}`"
            >
              Confirm
            </section>
          </template>
          <template #subtitle>
            <section
              class="p-4 text-black fw-medium"
            >
              Are you sure you want to restart this workflow? All data selected will be removed.
            </section>
          </template>
          <template #actions>
            <v-btn
              data-cy="CloseButton"
              aria-label="Close button"
              size="default"
              class="back-button"
              variant="flat"
              :class="`create-button session-button ${workflowBG} text-white mr-4`"
              @click="isActive.value = false"
            >
              Close
            </v-btn>
            <v-btn
              aria-label="restart button"
              data-cy="RestartButton"
              class="create-button"
              :class="`create-button session-button ${workflowBG} text-white mr-4`"
              size="default"
              variant="flat"
              @click="resetSession(isActive)"
            >
              Restart
            </v-btn>
          </template>
        </v-card>
      </template>
    </v-dialog>
    <v-dialog
      aria-label="Previous reports"
      :activator="showPrevReports"
      max-width="1400"
    >
      <template #default="{ isActive }">
        <v-card>
          <template #title>
            <section
              :class="`pl-4 p-2 text-white ${workflowBG}`"
            >
              Previously Generated Reports For Session ({{ sessionTitle }})
            </section>
          </template>
          <template #subtitle>
            <section
              class="row p-4 text-black fw-medium"
            >
              <h3
                v-if="gridData.length === 0"
              >
                No Previously Generated Session Reports for this session.
              </h3>
              <!-- TODO: Finish Grid When Reports section is complete. -->
              <PreviousReportGrid
                v-else-if="gridData.length > 0 && !isLoading"
                :is-loading="isLoading"
                grid-reference="prevReports"
                grid-heading="Previously Generated Reports"
                :grid-data="gridData"
                :grid-size="gridSize"
              />
            </section>
          </template>
          <template #actions>
            <v-btn
              data-cy="CloseButton"
              aria-label="Close button"
              size="default"
              class="back-button"
              variant="flat"
              :class="`create-button session-button ${workflowBG} text-white mr-4`"
              @click="isActive.value = false"
            >
              Close
            </v-btn>
          </template>
        </v-card>
      </template>
    </v-dialog>
  </section>
</template>

<script setup lang="ts">
import SessionModal from '~/components/workflowSections/session/SessionModal.vue';
import PreviousReportGrid from '~/components/workflowSections/workflowReports/PreviousReportGrid.vue'; // will be used when the report grid can refurn data
import type {SessionModalProps} from '~/components/workflowSections/workflowReports/workflowConstants';
import type {PreviousReport} from '~/api/Report/types';

const baseStore = useAppBaseStore();
const {activeTab} = storeToRefs(useAppBaseStore());
const {$patch: basePatch, resetWorkflowState} = baseStore;
// eslint-disable-next-line no-shadow
const setActiveSessionTab = ({activeTab}: {
  activeTab: TabKey;
}) => basePatch({activeTab});

const sessionStore = useSessionStore();
const {
  sessionRecallFailed, sessionTitle, sessionId,
} = storeToRefs(sessionStore);
const {$patch: sessionPatch} = sessionStore;
const showSessionsCreationModal = (showSessionCreationModal: boolean) => sessionPatch({showSessionCreationModal});
const doSaveSession = (msg?: SnackBarMsg | MouseEvent | KeyboardEvent) => {
  const message = typeof msg === 'string' ? msg : '';
  sessionStore.saveSession(activeTab.value, message);
};
const {
  workflowId, title, redirectUrl, description, stylesheet,
} = useWorkflowData();

const {inWorkflow} = useLocation();

const workflowBG = computed(() => { return `bg-${workflowId}`; });

const loading = ref(false);

onBeforeMount(() => {
  sessionPatch({showSessionCreationModal: false});
});
// new session funcionality
const workflow = ref<SessionModalProps>({
  workflowId: workflowId,
  description: description,
  title: title,
  redirectUrl: redirectUrl,
  stylesheet: stylesheet,
});

const showNewSessionModal = () => {
  showSessionsCreationModal(true); // put her because the if fails
  if (sessionRecallFailed.value || loading.value) {
    showSessionsCreationModal(true);
  }
  // NOTE: Navigation is controlled from store/session/actions.js now.
};

// reset session functionality
const showReset = () => {
  return true;
};
const showResetTab = ref('');
const resetSession = (isActive: globalThis.Ref<boolean>) => {
  resetWorkflowState();
  setActiveSessionTab({activeTab: 'chemSearch'});
  if (activeTab.value === 'chemSearch') {
    doSaveSession('Session has successfully been reset.');
  }
  isActive.value = false;
};

// show reports functionality
const gridSize = ref('height: 650px; width:95%; overflow:auto; text-align: left !important');
const gridData = ref<PreviousReport[]>([]);
const isLoading = ref(true);
const showPrevReportsModal = async() => {
  const {$repositories} = useNuxtApp();
  isLoading.value = true;
  gridData.value = await $repositories.report.getPrevReports(sessionId.value);
  // add mock data
  // TO DO remove this when actual reports are available
  if (gridData.value.length === 0) {
    gridData.value = [
      {
        reportId: 2485,
        reportDesc: 'testre',
        reportType: 'BATCH',
        sessionKey: '2c92808290504f60019086c12c97294f',
        clowderId: '66a95693e4b0a7c65d282df0',
        createdBy: 'Sean Hamilton (shamilto)',
        createdAt: '2024-07-30T21:09:39.551358Z',
      },
      {
        reportId: 2484,
        reportDesc: 'testre',
        reportType: 'BATCH',
        sessionKey: '2c92808290504f60019086c12c97294f',
        clowderId: '66a95611e4b0a7c65d282dd2',
        createdBy: 'Sean Hamilton (shamilto)',
        createdAt: '2024-07-30T21:07:29.319798Z',
      },
    ];
  }
  isLoading.value = false;
  return true;
};

const showPrevReports = ref('');
</script>

<style lang="scss" scoped>
:deep(.v-card-item) {
    align-items: center;
    display: grid;
    flex: none;
    grid-template-areas: "prepend content append";
    grid-template-columns: max-content auto max-content;
    padding: 0rem !important;
}
:deep(.v-card-item .v-card-subtitle) {
  white-space: normal !important;
  color: black !important;
  font-size: 1rem !important;
  font-weight: 600 !important;

}
:deep(.v-list-item :hover) {
  width: 100% !important;
  background-color: gainsboro !important;
  cursor: pointer !important;
}
</style>
