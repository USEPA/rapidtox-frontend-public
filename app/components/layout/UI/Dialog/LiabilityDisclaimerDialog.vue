<template>
  <v-dialog
    v-model="showDialog"
    persistent
    aria-label="Disclaimer of Liability"
    max-width="800"
  >
    <v-card>
      <v-toolbar
        color="primary"
        :class="`pl-4`"
        dark
      >
        <span data-cy="DisclaimerModalTitle">Disclaimer of Liability</span>
        <v-spacer />
      </v-toolbar>
      <v-card-text data-cy="DisclaimerModalText">
        <p>
          With respect to documents available from the EPA website, neither the United States Government
          nor any of their employees, makes any warranty, express or implied, including the warranties of
          merchantability and fitness for a particular purpose, or assumes any legal liability or responsibility
          for the accuracy, completeness, or usefulness of any information, apparatus, product, or process disclosed,
          or represents that its use would not infringe privately owned rights.
        </p>
        <p>
          In addition, this beta edition of RapidTox 2.0 is currently undergoing review and feedback from stakeholders.
          Its data and functionality are subject to change.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text="I Acknowledge"
          variant="flat"
          color="primary"
          data-cy="AcknowledgeButton"
          @click="showDialog = false"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
}>();

const emits = defineEmits<{
  closeDialog: [];
}>();

const showDialog = computed({
  get() {
    return props.show;
  },
  set() {
    emits('closeDialog');
  },
});
</script>
