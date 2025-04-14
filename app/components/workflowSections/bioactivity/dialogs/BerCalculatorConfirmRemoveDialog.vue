<template>
  <v-dialog
    aria-label="Confirm Remove Row"
    max-width="500"
    width="500"
  >
    <template #activator="{ props: dialogProps }">
      <v-btn
        v-bind="dialogProps"
        tabindex="0"
        variant="text"
        aria-label="Remove Row"
        class="align-self-center p0"
      >
        <template #default>
          <nuxt-icon
            name="fa/circle-minus-solid"
            class="text-red align-self-center mr-3"
            title="Click to remove this row"
            v-bind="dialogProps"
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
          Remove Row
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
          Are you sure you want to remove this row?
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Close"
            variant="flat"
            @click="isActive.value = false"
          />
          <WorkflowButton
            text="Remove"
            @click="remove(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import {getWorkflowBgColor} from '../../shared/helpers';
import WorkflowButton from '../../shared/components/WorkflowButton.vue';

const emits = defineEmits<{
  removeRow: [];
}>();

const remove = (isActive: globalThis.Ref<boolean, boolean>) => {
  emits('removeRow');
  isActive.value = false;
};
</script>

<style scoped>
:deep(.nuxt-icon svg) {
  height: 24px;
  width: 24px;
}
</style>
