<template>
  <NuxtLayout name="epa">
    <main
      id="main"
      class="container-fluid main-content px-0"
    >
      <div class="container">
        <div class="row">
          <h1 class="page-title">
            Release Notes
          </h1>
        </div>
        <div class="row">
          <v-sheet
            color="white"
            elevation="0"
          >
            <v-tabs
              v-model="tab"
              bg-color="gray-1"
            >
              <v-tab
                selected-class="border bg-white"
                value="one"
                :disabled="erNotes.length === 0"
              >
                Emergency Response
              </v-tab>
              <v-tab
                selected-class="border bg-white"
                value="two"
                :disabled="hhNotes.length === 0"
              >
                Human Health Assessment
              </v-tab>
            </v-tabs>

            <v-card-text>
              <v-tabs-window v-model="tab">
                <v-tabs-window-item value="one">
                  <ReleaseNote
                    v-for="(item, idx) in erNotes"
                    :key="idx"
                    :note="item"
                  />
                </v-tabs-window-item>

                <v-tabs-window-item value="two">
                  <ReleaseNote
                    v-for="(item, idx) in hhNotes"
                    :key="idx"
                    :note="item"
                  />
                </v-tabs-window-item>
              </v-tabs-window>
            </v-card-text>
          </v-sheet>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import ReleaseNote from '~/components/helpers/ReleaseNote.vue';

const tab = ref(null);
const erNotes = ref([
  {
    version: '2.0.0',
    date: 'January 2025',
    features: ['Public Release of the Emergency Response workflow.'],
    fixes: ['DCAP updates', 'Upgraded Nuxt (v3.14.159)', 'Upgraded AG-Grid (v32.1.0)', 'OAuth2 login via login.gov'],
  },
]);
const hhNotes = ref([
  {
    version: '2.0.0',
    date: 'January 2025',
    features: ['Public Release of the Human Health Assessment workflow.'],
    fixes: ['DCAP updates', 'Upgraded Nuxt (v3.14.159)', 'Upgraded AG-Grid (v32.1.0)', 'OAuth2 login via login.gov'],
  },
]);
</script>
