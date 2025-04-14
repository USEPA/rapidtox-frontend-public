<template>
  <Suspense>
    <div>
      <v-dialog
        v-model="showDialog"
        max-width="600"
      >
        <v-card>
          <v-toolbar
            color="primary"
            :class="`pl-4 bg-${getWorkflowBgColor()}`"
            dark
          >
            {{ props.params.text }}
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
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="props.params.tooltip" />
          </v-card-text>
          <v-card-actions>
            <v-btn
              text="Close"
              variant="flat"
              @click="showDialog = false"
            />
          </v-card-actions>
        </v-card>
      </v-dialog>
      <span
        v-if="props.params.tooltip"
        :id="`hazard-source-${props.params.id}`"
        :ref="`hazard-source-${props.params.id}`"
        :class="`cursor-help ${props.params.dottedUnderline ? 'dotted-underline' : ''}`"
        tabindex="0"
        @click="showDialog = true"
        @keyup.enter="showDialog = true"
      >
        {{ props.params.text }}
      </span>
      <span v-else>
        {{ props.params.text }}
      </span>
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import {getWorkflowBgColor} from '../helpers';

export interface BasicFocusableDialogRendererParams {
  tooltip: string;
  text: string;
  id: string;
  dottedUnderline?: boolean;
}

const props = defineProps<{
  params: ICellRendererParams & BasicFocusableDialogRendererParams;
}>();

const showDialog = ref(false);
watch(showDialog, (newVal, oldVal) => {
  if (!newVal && oldVal) {
    gridUtil.gridEvents.refocusElementOnDialogClose(props.params);
  }
});
</script>

<style scoped>

</style>
