import type {PhyschemSessionData} from '~/stores/physchem/types';

export const SelectedPhyschemSessionDataMock: PhyschemSessionData = {
  hasVisited: true,
  chemicalsReviewedCount: 1,
  totalChemicalsCount: 1,
  physchemDataSelected: {
    DTXSID7020182: [183051047, 183051048, 183051051, 183051053, 183051054, 183051055, 183051063, 183051065],
  },
  physchemChemsWithNoData: ['DTXSID7020182'],
};
