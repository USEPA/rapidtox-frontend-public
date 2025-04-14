<template>
  <div>
    <span v-if="documentUrl && documentUrl != '-'">
      <a
        :href="documentUrl"
        target="_blank"
        tabindex="0"
      >{{ superSource }}</a>
    </span>
    <span v-else>{{ superSource }}</span>
    <!-- <span v-icon :tooltiptext="tooltipText">description</span> -->
  </div>
</template>

<script>
export default {
  computed: {
    documentUrl() {
      // if we have a clowder-id/url, use it
      // otherwise, use the source-url
      if (this.params.data?.clowderId) {
        return this.params.data?.clowderId;
      }
      return this.params.data?.sourceUrl;
    },
    superSource() {
      return this.params.data?.superSource;
    },
    tooltipText() {
      return this.params.data?.superSourceDescription;
    },
  },
};
</script>

<style scoped></style>
