<template>
  <NuxtLayout name="epa">
    <main
      id="main"
      class="container-fluid main-content px-0"
    >
      <section class="container-fluid app-container">
        <ClientOnly>
          <v-card
            class="container-fluid"
          >
            <v-toolbar
              tag="section"
              color="white"
              title=" Workflow Reports"
            >
              <template #title>
                <h1 style="margin-top: 50px; font-size: 27.9px; width:100%; text-align: center;">
                  Workflow Reports
                </h1>
              </template>
            </v-toolbar>
            <div class="d-flex flex-row container-fluid">
              <v-tabs
                v-model="tab"
                tag="nav"
                color="primary"
                direction="vertical"
              >
                <v-tab
                  v-for="tabItem in tabs"
                  :key="tabItem.key"
                  :data-cy="`tab${tabItem.name}`"
                  class="bg-epa-blue-light text-white"
                  aria-label="workflow reports"
                  :text="tabItem.name"
                  :value="tabItem.value"
                >
                  <template #prepend>
                    <nuxt-icon
                      :name="tabItem.icon"
                      alt="logout icon"
                      aria-hidden="true"
                      class="mr-2 new-session-icon"
                    />
                  </template>
                </v-tab>
              </v-tabs>

              <v-tabs-window
                v-model="tab"
                class="continer-fluid"
                style="width: 100%"
              >
                <v-tabs-window-item
                  v-for="tabItem in tabs"
                  :key="tabItem.key"
                  :value="tabItem.value"
                >
                  <v-card flat>
                    <v-card-text>
                      <WorkflowReports
                        v-if="tab == 'wfr'"
                      />
                    </v-card-text>
                  </v-card>
                </v-tabs-window-item>
              </v-tabs-window>
            </div>
          </v-card>
        </ClientOnly>
      </section>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import WorkflowReports from '@/components/workflowSections/workflowReports/WorkflowReports.vue';

const tab = ref('wfr');

const tabs = ref([
  {
    name: 'Workflow Reports', disabled: false, key: 'WorkflowReports', icon: 'b/clipboard-list', value: 'wfr',
  },
]);
</script>
