<template>
  <v-dialog
    aria-label="Remove Row"
    max-width="600"
  >
    <template #activator="{ props: dialogProps }">
      <nuxt-icon
        name="fa/minus-circle"
        class="uncertainty-minus-circle-icon cursor-pointer"
        tabindex="0"
        v-bind="dialogProps"
        alt="Delete Row"
        @keyup.enter="$event => dialogProps.onClick($event)"
      />
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar
          color="primary"
          :class="`pl-4 bg-${getWorkflowBgColor()}`"
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
            text="Cancel"
            variant="flat"
            @click="isActive.value = false"
          />
          <v-btn
            text="Remove"
            variant="flat"
            color="secondary"
            @click="remove(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import {getWorkflowBgColor} from '../../shared/helpers';

const emits = defineEmits<{
  removeRowHandler: [];
}>();

const remove = (isActive: globalThis.Ref<boolean, boolean>) => {
  emits('removeRowHandler');
  isActive.value = false;
};
</script>

<style scoped>
.uncertainty-minus-circle-icon {
    color: red;
    font-size: 1.5em !important;
}
</style>
