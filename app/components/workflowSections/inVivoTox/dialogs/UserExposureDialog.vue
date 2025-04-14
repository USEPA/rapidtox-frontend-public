<template>
  <v-dialog
    max-width="450"
    aria-label="Insert Exposure"
    @after-enter="onDialogEnter"
  >
    <template #activator="{ props: dialogProps }">
      <WorkflowButton
        class="ml-12"
        v-bind="dialogProps"
      >
        Insert Exposure
      </WorkflowButton>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar
          color="primary"
          :class="`pl-4 bg-${getWorkflowBgColor()}`"
          dark
        >
          Insert Exposure
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
          <v-radio-group
            v-model="selection"
            inline
            class="text-center"
          >
            <v-row>
              <v-col sm="12">
                <v-radio
                  aria-label="BER Predicted Value"
                  value="ber"
                  :disabled="isBerDisabled"
                >
                  <template #label>
                    SEEM3 Consensus Exposure Model Predictions : {{ exposureMedianDisplay }}
                  </template>
                </v-radio>
              </v-col>
              <v-col
                sm="12"
                class="d-flex"
              >
                <v-radio
                  value="user"
                  aria-label="User Supplied Value"
                />
                <v-text-field
                  v-model="userSuppliedVal"
                  type="number"
                  aria-label="Enter Value"
                  class="ml"
                  :disabled="selection !== 'user'"
                />
              </v-col>
            </v-row>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Close"
            variant="flat"
            @click="isActive.value = false"
          />
          <WorkflowButton
            text="Set Value"
            @click="update(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import {getWorkflowBgColor} from '../../shared/helpers';
import WorkflowButton from '../../shared/components/WorkflowButton.vue';
import type {BioactivityBerRes} from '~/api/Bioactivity/types';
import type {Dtxsid} from '~~/types';

const emits = defineEmits<{
  updateExposure: [updateParams: {
    value: number; type: string;
  }];
}>();

const props = defineProps<{
  dtxsid: Dtxsid;
}>();

const selection = ref<'user' | 'ber'>('user');
const userSuppliedVal = ref(0);

const berData = ref<BioactivityBerRes[]>([]);

const isBerDisabled = computed(() => {
  // eslint-disable-next-line no-undefined
  return berData.value?.[0]?.exposureMedian === undefined;
});

const exposureMedian = computed(() => berData.value?.[0]?.exposureMedian);

const exposureMedianDisplay = computed(() => {
  return isBerDisabled.value ? 'No available predicted exposure data' : berData.value?.[0]?.exposureMedian;
});

const onDialogEnter = async() => {
  const {$repositories} = useNuxtApp();
  berData.value = await $repositories.bioactivity.getBioactivityBerData([props.dtxsid]);
};

// Action Buttons
const update = (isActive: globalThis.Ref<boolean, boolean>) => {
  const isBer = selection.value === 'ber';
  if (isBerDisabled.value && isBer) {
    return;
  }
  const value = isBer ? (exposureMedian.value || 0) : userSuppliedVal.value;
  const type = isBer ? 'Predicted' : 'User Supplied';
  emits('updateExposure', {value, type});
  isActive.value = false;
};
</script>

<style scoped>

</style>
