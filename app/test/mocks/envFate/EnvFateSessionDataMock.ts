import type {EnvFateSessionData} from '~/stores/envFate/types';

export const SelectedEnvFateSessionDataMock: EnvFateSessionData = {
  hasVisited: true,
  totalChemicalsCount: 1,
  chemicalsReviewedCount: 1,
  envFateDataSelected: {DTXSID7020182: [183051046, 183051060]},
  envFateChemsWithNoData: ['DTXSID7020182'],
};
