<template>
  <div class="load-container">
    <div class="title-container">
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
        label="Select a session to export"
        class="select-previous-sessions mt-4"
        :items="props.selectableOptions"
        @update:model-value="onSelectionChanged"
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
      <div class="users-container mt-2">
        <img
          v-if="isExporting"
          class="loading-image-export"
          src="~/assets/images/spinner.gif"
        >
        <UsersGrid
          :is-loading="isGridLoading"
          grid-reference="UsersGrid"
          :grid-size="gridSize"
          :grid-data="gridData"
          :config-obj="gridConfigurationObj"
          @grid-ref="onGridRef"
          @selection-changed="onSelectionChanged"
        />
      </div>
      <div class="button-container mt-4">
        <v-btn
          data-cy="BackButton"
          size="default"
          :class="`session-button bg-${props.workflowId} text-white`"
          variant="flat"
          @click="emits('previous')"
        >
          Back
        </v-btn>
        <v-btn
          data-cy="ExportButton"
          size="default"
          :disabled="!isSessionExportValid"
          :loading="isSessionBeingExported"
          :class="`session-button bg-${props.workflowId} text-white float-right`"
          @click="exportSession"
        >
          <template #prepend>
            <nuxt-icon name="fa/folder-open" />
          </template>
          Export
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  GridApi,
} from 'ag-grid-community';
import type {UsersGridConfigObj, SelectablePreviousSession} from './types';
import type {UserGridItem} from '~/api/Session/types';
import type {Workflow} from '~~/types';
import UsersGrid from '~/components/workflowSections/session/UsersGrid.vue';

const emits = defineEmits<{
  previous: [];
}>();

const props = defineProps<{
  redirectUrl: string;
  workflowId: Workflow;
  selectableOptions: SelectablePreviousSession[];
  noResultsMsg: string;
}>();

// Session Select
const selected = ref<SelectablePreviousSession | undefined | null>(null);
const sessionStore = useSessionStore();

const dateFormat = (date: string) => !date || typeof date !== 'string' ?
  '' :
  new Date(date).toISOString().substring(0, 10);

const isExporting = ref(false);

// Grid
const gridData = ref<UserGridItem[]>([]);
const isGridLoading = ref(true);
const getExportUsersList = async() => {
  const allUsers = await useNuxtApp().$repositories.session.getUsers();
  const {user: currentUser} = useOidcAuth();
  const currentUserName = currentUser?.value?.claims?.email as string;
  const filteredUsers = allUsers.filter(user => user.username !== currentUserName);
  return filteredUsers;
};

onMounted(async() => {
  try {
    isGridLoading.value = true;
    gridData.value = await getExportUsersList();
  } catch {
    useEvent('session-modal-feedback-snackbar', {
      snackbarMsg: 'Error Loading Users.',
      snackbarBtnColor: 'red',
    });
  } finally {
    isGridLoading.value = false;
  }
});

const gridApi = shallowRef<GridApi<UserGridItem> | null>(null);
const gridConfigurationObj = ref<UsersGridConfigObj>({
  gridOptions: usersGridOptions,
  gridColumnDefs: usersColumnDefs,
});

const onGridRef = (params: {
  gridApi: GridApi<UserGridItem>;
}) => {
  gridApi.value = params.gridApi;
};

const disableUsersThatAlreadyHaveSession = (users: string[]) => {
  gridApi?.value?.forEachNodeAfterFilterAndSort((node) => {
    const currentUserName = node?.data?.username || '';
    const badTitle = !!currentUserName && !!currentUserName.length && users.includes(currentUserName);
    node.setData({username: currentUserName, badTitle});
    if (badTitle) {
      node.setSelected(false);
    }
  });
};

const onSelectionChanged = async() => {
  selectedUserCount.value = gridApi?.value!.getSelectedRows().map(row => row.username).length || 0;
  if (selected.value) {
    const allUsers = gridData.value.map(row => row.username) || [];
    const usersHavingSameTitle = await useNuxtApp().$repositories.session
      .testSessionTitleForUsers(selected.value.sessionTitle, allUsers);
    disableUsersThatAlreadyHaveSession(usersHavingSameTitle);
  }
};

// Session Export Actions
const {isCreatingSession} = storeToRefs(sessionStore);
const selectedUserCount = ref(0);
const isSessionBeingExported = ref(false);
const isSessionExportValid = computed(() => {
  return selected.value &&
    props.selectableOptions.map(session => session.sessionTitle).includes(selected.value.sessionTitle) &&
    !isCreatingSession.value && selectedUserCount.value > 0;
});

const gridSize = 'height: 400px; width:100%; overflow:auto;overflow-x: hidden;';

const exportSession = async() => {
  try {
    isSessionBeingExported.value = true;
    const selectedUsers = gridApi?.value?.getSelectedRows().map(row => row.username) || [];
    await useNuxtApp().$repositories.session
      .exportSessionToUsers(selected?.value?.sessionKey || '', selectedUsers);

    await onSelectionChanged();

    useEvent('session-modal-feedback-snackbar', {
      snackbarMsg: 'Session sucessfully exported.',
      snackbarBtnColor: 'green',
    });
  } catch {
    useEvent('session-modal-feedback-snackbar', {
      snackbarMsg: 'Error exporting session.',
      snackbarBtnColor: 'red',
    });
  } finally {
    isSessionBeingExported.value = false;
  }
};
</script>

<style scoped>
</style>
