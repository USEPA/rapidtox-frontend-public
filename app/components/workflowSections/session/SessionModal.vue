<template>
  <v-row justify="center">
    <v-col cols="auto">
      <v-dialog
        v-model="showSessionModal"
        data-cy="InitiationModal"
        max-width="650"
        class="session-initiation-modal"
        :title="'Create or Restore a ' + props.workflow.title + ' Session'"
        @after-leave="resetModal()"
        @after-enter="afterSessionEnter()"
      >
        <template #default>
          <v-card>
            <v-toolbar
              color="primary"
              :class="`pl-4 ${getHeaderClass}`"
              dark
            >
              Create or Restore a  {{ props.workflow.title }} Session
            </v-toolbar>
            <v-card-text class="p-2">
              <div class="container-fluid">
                <transition
                  :name="getTransitionName()"
                  mode="out-in"
                >
                  <div
                    v-if="!createSession && !loadSession && !exportSession"
                    key="initial"
                  >
                    <div
                      class="row mt-4"
                    >
                      <div

                        key="question"
                        class="col-12 m-2"
                      >
                        <h5
                          style="color: #0071bc;"
                          data-cy="InitiationModalBody"
                        >
                          Would you like to create a new {{ props.workflow.title }} session or load
                          a previous {{ props.workflow.title }} session?
                        </h5><br>
                      </div>
                    </div>
                    <div
                      class="row mt-4"
                    >
                      <div
                        key="question"
                        class="col-12 text-center"
                      >
                        <v-btn
                          data-cy="CreateSessionButton"
                          :class="`session-button bg-${workflow.workflowId} text-white mr-4`"
                          flat
                          size="default"
                          @click="moveForward('createSession')"
                        >
                          <nuxt-icon
                            name="b/file-earmark-fill"
                            alt="Start New Session"
                            aria-hidden="true"
                          />  Create session
                        </v-btn>
                        <v-btn
                          data-cy="LoadSessionButton"
                          :class="`session-button bg-${workflow.workflowId} text-white`"
                          flat
                          size="default"
                          @click="moveForward('loadSession')"
                        >
                          <template #prepend>
                            <nuxt-icon
                              name="b/folder-open-s"
                              alt="Start New Session"
                              aria-hidden="true"
                            />
                          </template>
                          Load previous
                        </v-btn>
                      </div>
                    </div>
                  </div>
                  <SessionCreation
                    v-else-if="createSession"
                    key="create"
                    v-bind="workflow"
                    @submit="submit"
                    @previous="goFirstStep"
                  />
                  <SessionLoad
                    v-else-if="loadSession"
                    key="load"
                    v-bind="workflow"
                    :selectable-options="selectableOptions"
                    :no-results-msg="noResultsMsg"
                    @submit="submit"
                    @previous="goFirstStep"
                  />
                </transition>
              </div>
            </v-card-text>
            <v-card-actions>
              <div class="create-load-buttons-container row mt-4" />
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
    <v-snackbar
      v-model="showSnackbar"
      :timeout="2000"
    >
      {{ snackbarMsg }}

      <template #actions>
        <v-btn
          :color="snackbarBtnColor"
          variant="text"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script setup lang="ts">
import type {SessionModalProps} from '../workflowReports/workflowConstants';
import SessionCreation from './SessionCreation.vue';
import SessionLoad from './SessionLoad.vue';
import type {SelectablePreviousSession} from './types';
import SessionExport from './SessionExport.vue';

const props = defineProps<{
  workflow: SessionModalProps;
}>();

// Modal Header
const sessionActionFailed = computed(() => !!(sessionDeleteFailed.value ||
  sessionDeleteFailed.value ||
  sessionEditFailed.value ||
  sessionLoadFailed.value
));

const getHeaderClass = computed(() => {
  if (sessionActionFailed.value) {
    return 'session-initiation-modal-header-failed';
  }
  return `bg-${props.workflow.workflowId}`;
});

// Modal Body Transition Class
const back = ref(false);
const getTransitionName = () => back.value ? 'slide-out' : 'slide';

// Session Modal Show
const sessionStore = useSessionStore();
const {
  $patch: sessionPatch, resetModal: resetSessionModal, setPreviousUserSessions,
} = sessionStore;
const {showSessionCreationModal: showModal, previousUserSessions} = storeToRefs(sessionStore);
const showSessionModal = computed({
  get() {
    return showModal.value;
  },
  set(showSessionCreationModal) {
    sessionPatch({showSessionCreationModal});
  },
});
// Modal State (Load, Initial, Create, Export)
const {
  sessionLoadFailed,
  sessionEditFailed,
  sessionDeleteFailed,
} = storeToRefs(sessionStore);

const loadSession = ref(false);
const createSession = ref(false);
const exportSession = ref(false);

const resetLocalSessionState = () => {
  loadSession.value = false;
  createSession.value = false;
  exportSession.value = false;
};

const resetModal = () => {
  resetLocalSessionState();
  resetSessionModal();
};

const afterSessionEnter = () => {
  setPreviousUserSessions();
  resetModal();
};

const submit = () => {
  resetModal();
  showSessionModal.value = false;
};

const goFirstStep = () => {
  back.value = true;
  resetLocalSessionState();
};

const moveForward = (step: string) => {
  back.value = false;
  exportSession.value = step === 'exportSession';
  loadSession.value = step === 'loadSession';
  createSession.value = step === 'createSession';
};

// Props used for select components
const selectableOptions: ComputedRef<SelectablePreviousSession[]> =
  computed(() => previousUserSessions.value.filter(option => option.workflow === props.workflow.workflowId)
    .map(option => ({
      ...option,
      title: option.sessionTitle,
      value: option.sessionKey,
    })));

const noResultsMsg = ref('No selectable previous sessions. Please create one first.');

// Snackbar
const snackbarMsg = ref('');
const showSnackbar = ref(false);
const snackbarBtnColor = ref('blue');
const snackbarTimeout = ref(2000);

onMounted(() => {
  useOn('session-modal-feedback-snackbar', ({
    snackbarMsg: incomingMsg, snackbarTimeout: incomingTimeout, snackbarBtnColor: incomingColor,
  }) => {
    snackbarMsg.value = incomingMsg;
    snackbarTimeout.value = incomingTimeout || snackbarTimeout.value;
    snackbarBtnColor.value = incomingColor;
    showSnackbar.value = true;
  });
});
</script>

<style scoped>
:deep(.session-initiation-modal-header-failed)   {
  background-color: #dc3545 !important;
  text-align: center;
}
:deep(.nuxt-icon svg) {
  width: 20px !important;
  height: 20px !important;
}
</style>
