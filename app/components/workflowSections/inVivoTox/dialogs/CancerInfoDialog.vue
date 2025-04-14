<template>
  <v-dialog
    v-model="showDialog"
    aria-label="Cancer Infomration"
  >
    <v-card>
      <v-toolbar
        color="primary"
        :class="`pl-4 bg-${getWorkflowBgColor()}`"
        dark
      >
        Cancer Information
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
        <ul>
          <li
            v-for="cancer in Object.keys(cancerInformation)"
            :key="cancer"
            tag="li"
          >
            {{ cancer }}
            <ul>
              <li
                v-for="(cancerItem, idx) in getListItems(cancer as keyof typeof cancerInformation)"
                :key="idx"
              >
                {{ cancerItem }}
              </li>
            </ul>
          </li>
        </ul>
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
</template>

<script setup lang="ts">
import {getWorkflowBgColor} from '../../shared/helpers';
import cancerInformation from '../../../../assets/fixtures/cancerInformation.json';

const props = defineProps<{
  show: boolean;
}>();

const emits = defineEmits<{
  closeCancerDialog: [];
}>();

const getListItems = (key: keyof typeof cancerInformation) => {
  return cancerInformation[key];
};

const showDialog = computed({
  get() {
    return props.show;
  },
  set() {
    emits('closeCancerDialog');
  },
});
</script>

<style scoped>

</style>
