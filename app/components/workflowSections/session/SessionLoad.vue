<template>
  <div class="load-container">
    <div class="title-container">
      <div class="form-container">
        <section v-if="!showEditForm">
          <h5 :class="`session-header-text text-${props.workflowId}`">
            Select Existing Session
          </h5>
          <v-select
            id="load-select"
            v-model="selected"
            return-object
            item-title="title"
            item-value="value"
            data-cy="SessionDropdown"
            label="Session Title"
            class="select-previous-sessions mt-4"
            :items="selectableOptions"
          >
            <template #no-data>
              <span class="fs-5 ml-2">
                {{ props.noResultsMsg }}
              </span>
            </template>
            <template #item="{ props: itemProps, item }">
              <v-list-item
                v-bind="itemProps"
                :subtitle="dateFormat(item.raw.updateTimestamp)"
              />
            </template>
          </v-select>
        </section>

        <transition
          name="slide-out"
          mode="out-in"
        >
          <section v-if="showEditForm">
            <h5 :class="`session-header-text text-${props.workflowId}`">
              Edit Session Name
            </h5>
            <v-form
              class="row align-items-center"
            >
              <v-text-field
                id="session-edit-input"
                v-model="newSessionTitle"
                label="Enter new session name"
                data-cy="SessionEditInput"
                class="col-6"
                :rules="[editTitleRules.required, editTitleRules.maxLength, editTitleRules.isUnique]"
              />
              <v-btn
                data-cy="SubmitButton"
                :class="`bg-${props.workflowId} text-white mr-4`"
                :disabled="isEditBtnDisabled"
                size="default"
                class="col-2"
                @click="editSession"
              >
                Submit
              </v-btn>
            </v-form>
          </section>
        </transition>
      </div>
      <div class="mt-4">
        <v-btn
          :class="`float-left bg-${props.workflowId} text-white mr-4`"
          variant="flat"
          size="default"
          data-cy="BackButton"
          @click="emits('previous')"
        >
          Back
        </v-btn>
        <v-btn
          :class="`float-right bg-${props.workflowId} text-white mr-4`"
          variant="flat"
          data-cy="LoadButton"
          size="default"
          :disabled="!!(!selected?.sessionKey)"
          @click="loadSession"
        >
          <template #prepend>
            <nuxt-icon name="mdi/folder-open" />
          </template>
          Load
        </v-btn>
        <v-btn
          :class="`float-right bg-${props.workflowId} text-white mr-4`"
          variant="flat"
          size="default"
          :disabled="!selected?.sessionKey"
          data-cy="DeleteButton"
          @click="toggleDeleteConfirm"
        >
          <template #prepend>
            <nuxt-icon name="mdi/folder-minus" />
          </template>
          Delete
        </v-btn>
        <v-btn
          :class="`float-right bg-${props.workflowId} text-white mr-4`"
          variant="flat"
          size="default"
          data-cy="EditButton"
          :disabled="!validateSessionLoad"
          @click="toggleEditForm"
        >
          <template #prepend>
            <nuxt-icon name="mdi/folder-edit" />
          </template>
          Edit
        </v-btn>
      </div>
    </div>
    <v-dialog
      v-model="showDeleteConfirm"
      data-cy="DeleteConfirmationModal"
      title="Delete Session"
      content-class="delete-confirm-modal"
      max-width="440"
      contained
    >
      <template #default>
        <v-card
          title="Delete Session"
        >
          <v-card-text>
            <p>
              Are you sure you want to delete this session? If you delete this session all previous work will be lost. This
              will include selections, as well as reports.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              data-cy="YesButton"
              :class="`bg-${props.workflowId} text-white`"
              @click="deleteSession"
            >
              Yes
            </v-btn>
            <v-btn
              data-cy="NoButton"
              :class="`bg-${props.workflowId} text-white`"
              @click="toggleDeleteConfirm"
            >
              No
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type {SelectablePreviousSession} from './types';
import type {PreviousSession} from '~/api/Session/types';
import type {Workflow} from '~~/types';

const props = defineProps<{
  redirectUrl: string;
  workflowId: Workflow;
  selectableOptions: SelectablePreviousSession[];
  noResultsMsg: string;
}>();

// Previous Session Load Dropdown
const sessionStore = useSessionStore();
const {isCreatingSession: isCreating} = storeToRefs(sessionStore);
const selected = ref<SelectablePreviousSession | undefined | null>(null);

const dateFormat = (date: string) => !date || typeof date !== 'string' ?
  '' :
  new Date(date).toISOString().substring(0, 10);

// Edit Form
const {
  editUserSession,
} = sessionStore;
const showEditForm = ref(false);
const newSessionTitle = ref('');

const editTitleRules = ref({
  required: (val: string) => !!val || 'Session name is required',
  maxLength: (val: string) => !!(val.length < 42) || 'Session name must be 40 characters or less',
  isUnique: (val: string) => {
    if (props.selectableOptions.map(session => (session.sessionTitle ?
      session
        .sessionTitle.toLowerCase() :
      session.sessionTitle))
      .includes(val.toLowerCase())) {
      return 'Session name must be unqiue.';
    }
    return true;
  },
});

const isEditBtnDisabled = computed(() => !newSessionTitle.value.length ||
  newSessionTitle.value.length >= 40 ||
  props.selectableOptions
    .map(session => (session.sessionTitle ? session.sessionTitle.toLowerCase() : session.sessionTitle))
    .includes(newSessionTitle.value.toLowerCase()));
const editSession = async() => {
  try {
    selected!.value!.sessionTitle = newSessionTitle.value;
    await editUserSession(selected.value as PreviousSession);
    showEditForm.value = false;
    selected.value = null;
    useEvent('session-modal-feedback-snackbar', {
      snackbarMsg: 'Session successfully modified.',
      snackbarBtnColor: 'green',
    });
  } catch {
    useEvent('session-modal-feedback-snackbar', {
      snackbarMsg: 'Error modifying session.',
      snackbarBtnColor: 'red',
    });
  }
};

const toggleEditForm = () => {
  showEditForm.value = !showEditForm.value;
};

// Delete Session
const {
  deleteUserSession,
} = sessionStore;
const showDeleteConfirm = ref(false);
const toggleDeleteConfirm = () => { showDeleteConfirm.value = !showDeleteConfirm.value; };
const deleteSession = async() => {
  try {
    showDeleteConfirm.value = false;
    await deleteUserSession(selected?.value!.sessionKey);
    selected.value = null;
    useEvent('session-modal-feedback-snackbar', {
      snackbarMsg: 'Session successfully deleted.',
      snackbarBtnColor: 'green',
    });
  } catch {
    useEvent('session-modal-feedback-snackbar', {
      snackbarMsg: 'Error deleting session.',
      snackbarBtnColor: 'red',
    });
  }
};
// Action buttons that engage the load process
const {
  loadUserSession,
} = sessionStore;
const emits = defineEmits<{
  previous: [];
  submit: [];
}>();

const validateSessionLoad = computed(() => selected?.value?.sessionTitle &&
  props.selectableOptions.map(session => session.sessionTitle).includes(selected.value!.sessionTitle) &&
  !isCreating.value);

const loadSession = async() => {
  try {
    await loadUserSession({
      sessionKey: selected?.value!.sessionKey,
      redirectUrl: props.redirectUrl,
    });
    emits('submit');
  } catch {
    useEvent('session-modal-feedback-snackbar', {
      snackbarMsg: 'Error loading session.',
      snackbarBtnColor: 'red',
    });
  }
};
</script>

<style scoped>
:deep(.delete-confirm-modal) {
  max-height: fit-content !important;
}
</style>
