<template>
  <div class="release-note">
    <h1><span class="release-version"> {{ note.version }}</span> ({{ note.date }})</h1>
    <div v-if="note.features.length > 0">
      <br>
      <h2>Features</h2>
      <ul>
        <li
          v-for="feature in note.features"
          :key="feature"
        >
          {{ feature }}
        </li>
      </ul>
    </div>
    <div v-if="note.fixes.length > 0">
      <h4>Fixes</h4>
      <ul>
        <li
          v-for="fix in note.fixes"
          :key="fix"
        >
          {{ fix }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  note: {
    version: string;
    date: string;
    features: string[];
    fixes: string[];
  };
}>();
</script>

<style>
.release-version{
  color: #007bff;
}
.release-note{
  padding: 5px;
}
</style>
