<template>
  <div>
    <v-text-field
      v-model="reportDesc"
      data-cy="formfieldReportName"
      hint="Please enter report name"
      label="Report name"
      :rules="[rules.required, rules.minLength]"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  reportName: string;
}>();

const emits = defineEmits<{
  updateReportName: [name: string];
}>();

const reportDesc = computed({
  get() {
    return props.reportName;
  },
  set(val) {
    emits('updateReportName', val);
  },
});

const rules = ref({
  required: (val: string) => !!val || 'Report name is required',
  minLength: (val: string) => !!(val.length > 4) || 'Report name must be at least 5 characters',
});

defineExpose({
  rules,
});
</script>

<style scoped>

</style>
