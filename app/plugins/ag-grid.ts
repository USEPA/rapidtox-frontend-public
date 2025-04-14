import {AgGridVue} from 'ag-grid-vue3';

import {LicenseManager} from 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

export default defineNuxtPlugin((nuxtApp) => {
  LicenseManager.setLicenseKey('CompanyName=United States Environmental Protection Agency,LicensedGroup=Wade Slate,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=0,AssetReference=AG-030324,SupportServicesEnd=3_December_2024_[v2]_MTczMzE4NDAwMDAwMA==fdf9944cbd70383b5fad44ca373062a0');

  AgGridVue.class = 'ag-theme-quartz';

  nuxtApp.vueApp.component('ag-grid-vue', AgGridVue);
  return {
    provide: {
      AgGridVue: AgGridVue,
    },
  };
});
