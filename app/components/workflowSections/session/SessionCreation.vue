<template>
  <div>
    <h5 :class="`session-header-text text-${props.workflowId}`">
      Create New Session
    </h5>
    <v-text-field
      id="session-creation-input"
      v-model="sessionName"
      label="Enter new session name"
      data-cy="SessionNameInput"
      :rules="[rules.required, rules.maxLength, rules.isUnique]"
    />
    <footer class="button-container mt-4">
      <v-btn
        data-cy="BackButton"
        size="default"
        class="back-button"
        variant="flat"
        :class="`create-button session-button bg-${props.workflowId} text-white mr-4`"
        @click="goBack"
      >
        Back
      </v-btn>
      <v-btn
        data-cy="CreateButton"
        :disabled="isCreateDisabled"
        class="create-button"
        :loading="isCreating"
        :class="`create-button session-button bg-${props.workflowId} text-white mr-4`"
        size="default"
        variant="flat"
        @click="createSession"
      >
        <template #prepend>
          <nuxt-icon
            name="fa/file"
          />
        </template>
        Create
      </v-btn>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type {Workflow} from '~~/types';

const props = defineProps<{
  redirectUrl: string;
  workflowId: Workflow;
}>();

const emits = defineEmits<{
  previous: [];
  submit: [];
}>();

// Text Field
const sessionStore = useSessionStore();
const {previousUserSessions, isCreatingSession: isCreating} = storeToRefs(sessionStore);

const sessionName = ref('');
const rules = ref({
  required: (val: string) => !!val || 'Session name is required',
  maxLength: (val: string) => !!(val.length < 40) || 'Session name must be 40 characters or less',
  isUnique: (val: string) => {
    if (previousUserSessions.value.map(session => (session.sessionTitle ?
      session
        .sessionTitle.toLowerCase() :
      session.sessionTitle))
      .includes(val.toLowerCase())) {
      return 'Session name must be unqiue.';
    }
    return true;
  },
});
// Back & Create Buttons
const {createUserSession} = sessionStore;

const goBack = () => {
  emits('previous');
};

const createSession = async() => {
  try {
    if (isCreateDisabled.value) {
      return;
    }
    await createUserSession({
      sessionTitle: sessionName.value,
      redirectUrl: props.redirectUrl,
      workflow: props.workflowId,
    });
    emits('submit');
  } catch {
    useEvent('session-modal-feedback-snackbar', {
      snackbarMsg: 'Error creating session.',
      snackbarBtnColor: 'red',
    });
  }
};

const isCreateDisabled = computed(() => {
  const currentSessionName = sessionName.value;
  const {
    required, maxLength, isUnique,
  } = rules.value;

  // If all rules pass and session is not currently being created.
  if (isBoolean(required(currentSessionName)) &&
    isBoolean(maxLength(currentSessionName)) &&
    isBoolean(isUnique(currentSessionName)) &&
    !isCreating.value) {
    return false;
  }
  return true;
});
</script>

<style scoped lang="scss">
.create-button {
  float: right;
}
.back-button {
  float: left;
}
:deep(.nuxt-icon svg) {
  width: 20px !important;
  height: 20px !important;
}
</style>
