import {AgCharts} from 'ag-charts-vue3';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('ag-charts', AgCharts);
  return {
    provide: {
      AgCharts: AgCharts,
    },
  };
});
