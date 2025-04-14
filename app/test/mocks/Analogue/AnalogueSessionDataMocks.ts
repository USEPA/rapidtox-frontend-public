import type {AnalogueSessionData, AnalogueStepInfo} from '~/stores/analogue/types';

export const BisphenolAInitialAnalogueChemicalStepInfoMock: AnalogueStepInfo[] = [
  {
    analogueChemId: null,
    currentStep: 0,
    searchWord: 'DTXSID7020182',
    preferredName: 'Bisphenol A',
    finishedStepOne: false,
    dtxsid: 'DTXSID7020182',
    smileString: 'CC(C)(C1=CC=C(O)C=C1)C1=CC=C(O)C=C1',
    finishedStepTwo: false,
    finishedAnalogueSelection: false,
    selectedAnalogues: [],
    selectedReadAcross: [],
    selectedPODS: [],
    PODJustifications: [],
  },
];

export const SelectedAnalogueSessionDataMock: AnalogueSessionData = {
  currentAnalogueSelectedChemical: {
    id: 290147220,
    dtxsid: 'DTXSID7020182',
    selected: null,
    nioshLink: null,
    safetyLink: 'DTXSID7020182',
    odorThreshold: null,
    preferredName: 'Bisphenol A',
    searchMatch: 'DSSTox_Substance_Id',
    searchGroup: 'DTXSID',
    searchWord: 'DTXSID7020182',
    modifiedValue: 'DTXSID7020182',
    rank: 1,
    dtxcid: 'DTXCID30182',
    hasStructureImage: true,
    casrn: '80-05-7',
    smiles: 'CC(C)(C1=CC=C(O)C=C1)C1=CC=C(O)C=C1',
    isMarkush: false,
    hasTox: true,
    rowIndex: 0,
    colId: 'analogueSelCol',
  },
  ketcher: null,
  showAnalogueModal: true,
  currentAnaloguePodData: {
    title: '', dtxsid: '', podData: [],
  },
  analogueChemicalsStepInfo: BisphenolAInitialAnalogueChemicalStepInfoMock,
  errorMolFile: false,
  errorMessage: '',
  hasVisited: true,
};

export const BisphenolAUpdatedAnalogueChemicalStepInfoMock: AnalogueStepInfo = {
  analogueChemId: null,
  currentStep: 1,
  searchWord: 'DTXSID7020182',
  preferredName: 'Bisphenol A',
  finishedStepOne: true,
  dtxsid: 'DTXSID7020182',
  smileString: 'CC(C)(C1=CC=C(O)C=C1)C1=CC=C(O)C=C1',
  finishedStepTwo: false,
  finishedAnalogueSelection: false,
  selectedAnalogues: [
    {
      dtxsid: 'DTXSID3022536', name: '4-Cumylphenol', similarity: 1,
    }, {
      dtxsid: 'DTXSID2037712', name: '4,4\',4\'\'-Ethane-1,1,1-triyltriphenol', similarity: 1,
    }, {
      dtxsid: 'DTXSID1020221', name: '4-(1,1-Dimethylethyl)phenol', similarity: 0.961538,
    }, {
      dtxsid: 'DTXSID4022442', name: 'Bisphenol B', similarity: 0.896552,
    }, {
      dtxsid: 'DTXSID8047890', name: '3,3\'-Dimethylbisphenol A', similarity: 0.896552,
    }, {
      dtxsid: 'DTXSID8047973', name: '4,4\'-Propane-2,2-diylbis(2,6-dimethylphenol)', similarity: 0.896552,
    }, {
      dtxsid: 'DTXSID9022445', name: 'Bis(4-hydroxyphenyl)methane', similarity: 0.884615,
    }, {
      dtxsid: 'DTXSID7038864', name: '2,2\'-Methylenebis(ethyl-6-tert-butylphenol)', similarity: 0.866667,
    }, {
      dtxsid: 'DTXSID7022411', name: '4,4\'-Methylenebis(2,6-di-t-butylphenol)', similarity: 0.866667,
    }, {
      dtxsid: 'DTXSID4020870', name: '2,2\'-Methylenebis(4-methyl-6-tert-butylphenol)', similarity: 0.866667,
    }, {
      dtxsid: 'DTXSID8021771', name: '4-(2-Methylbutan-2-yl)phenol', similarity: 0.862069,
    }, {
      dtxsid: 'DTXSID5024687', name: '4-tert-Butylcatechol', similarity: 0.862069,
    }, {
      dtxsid: 'DTXSID4047963', name: 'Bisphenol Z', similarity: 0.83871,
    }, {
      dtxsid: 'DTXSID4047468', name: '2-tert-Butyl-6-methylphenol', similarity: 0.833333,
    }, {
      dtxsid: 'DTXSID6027052', name: '2,6-Di-tert-butylphenol', similarity: 0.833333,
    }, {
      dtxsid: 'DTXSID6041551', name: '6-tert-Butyl-2,4-xylenol', similarity: 0.833333,
    }, {
      dtxsid: 'DTXSID9022360', name: '4-(1,1,3,3-Tetramethylbutyl)phenol', similarity: 0.833333,
    }, {
      dtxsid: 'DTXSID2020216', name: 'Butylated hydroxytoluene', similarity: 0.833333,
    }, {
      dtxsid: 'DTXSID2021311', name: '2,4,6-Tris(tert-butyl)phenol', similarity: 0.833333,
    }, {
      dtxsid: 'DTXSID8041248', name: '2,5-Di-tert-butylbenzene-1,4-diol', similarity: 0.806452,
    }, {
      dtxsid: 'DTXSID6020220', name: 'tert-Butylhydroquinone', similarity: 0.806452,
    }, {
      dtxsid: 'DTXSID2022381', name: 'Hexestrol', similarity: 0.8,
    }, {
      dtxsid: 'DTXSID4022446', name: '2,2′-Methylenebis[phenol]', similarity: 0.766667,
    }, {
      dtxsid: 'DTXSID5033836', name: '4-Nonylphenol', similarity: 0.758621,
    }, {
      dtxsid: 'DTXSID1022508', name: '4-Dodecylphenol', similarity: 0.758621,
    }, {
      dtxsid: 'DTXSID9022312', name: '4-Octylphenol', similarity: 0.758621,
    }, {
      dtxsid: 'DTXSID9026974', name: '2,4-Di-tert-pentylphenol', similarity: 0.757576,
    }, {
      dtxsid: 'DTXSID8029315', name: '4-(Butan-2-yl)-2,6-di-tert-butylphenol', similarity: 0.757576,
    }, {
      dtxsid: 'DTXSID5044992', name: '2,5-Bis(2-methylbutan-2-yl)benzene-1,4-diol', similarity: 0.735294,
    }, {
      dtxsid: 'DTXSID2022331', name: '2-(Butan-2-yl)phenol', similarity: 0.727273,
    }, {
      dtxsid: 'DTXSID1026081', name: '3,3\',5,5\'-Tetrabromobisphenol A', similarity: 0.722222,
    }, {
      dtxsid: 'DTXSID7040788', name: '2-tert-Butyl-4-methoxyphenol', similarity: 0.714286,
    }, {
      dtxsid: 'DTXSID5036684', name: '4-Hydroxybenzophenone', similarity: 0.69697,
    }, {
      dtxsid: 'DTXSID3047138', name: 'tert-Butylbenzene', similarity: 0.692308,
    }, {
      dtxsid: 'DTXSID7021869', name: 'p-Cresol', similarity: 0.692308,
    }, {
      dtxsid: 'DTXSID1024704', name: '4-tert-Butyltoluene', similarity: 0.692308,
    }, {
      dtxsid: 'DTXSID8029602', name: '4,4\'-Butane-1,1-diylbis(2-tert-butyl-5-methylphenol)', similarity: 0.684211,
    }, {
      dtxsid: 'DTXSID7037717', name: 'Bisphenol AF', similarity: 0.684211,
    }, {
      dtxsid: 'DTXSID3021770', name: '2,2\',6,6\'-Tetrachlorobisphenol A', similarity: 0.684211,
    }, {
      dtxsid: 'DTXSID8022325', name: '2,2-Bis(4-hydroxyphenyl)-1,1,1-trichloroethane', similarity: 0.675676,
    }, {
      dtxsid: 'DTXSID1025148', name: '3,5-Dimethylphenol', similarity: 0.666667,
    }, {
      dtxsid: 'DTXSID6024200', name: 'm-Cresol', similarity: 0.666667,
    }, {
      dtxsid: 'DTXSID6024624', name: 'Bisphenol A diglycidyl ether', similarity: 0.666667,
    }, {
      dtxsid: 'DTXSID8037756', name: '2-Phenylpropan-1-ol', similarity: 0.655172,
    }, {
      dtxsid: 'DTXSID1021827', name: 'Cumene', similarity: 0.653846,
    }, {
      dtxsid: 'DTXSID1020699', name: '4-Hexylresorcinol', similarity: 0.647059,
    }, {
      dtxsid: 'DTXSID0020575', name: 'Estragole', similarity: 0.647059,
    }, {
      dtxsid: 'DTXSID1024702', name: 'tert-Butyl phenyl glycidyl ether', similarity: 0.641026,
    }, {
      dtxsid: 'DTXSID8021808', name: 'o-Cresol', similarity: 0.62069,
    }, {
      dtxsid: 'DTXSID2021864', name: '2,4-Dimethylphenol', similarity: 0.62069,
    }, {
      dtxsid: 'DTXSID7022049', name: '2,4,6-Trimethylphenol', similarity: 0.62069,
    }, {
      dtxsid: 'DTXSID9024063', name: '2,6-Dimethylphenol', similarity: 0.62069,
    }, {
      dtxsid: 'DTXSID4024062', name: '3,4-Dimethylphenol', similarity: 0.62069,
    }, {
      dtxsid: 'DTXSID7021152', name: '4-Phenylphenol', similarity: 0.62069,
    }, {
      dtxsid: 'DTXSID6027343', name: '4-tert-Butylbenzaldehyde', similarity: 0.612903,
    }, {
      dtxsid: 'DTXSID9020827', name: 'Methoxychlor', similarity: 0.609756,
    }, {
      dtxsid: 'DTXSID8022377', name: '17alpha-Estradiol', similarity: 0.609756,
    }, {
      dtxsid: 'DTXSID0020573', name: '17beta-Estradiol', similarity: 0.609756,
    }, {
      dtxsid: 'DTXSID7035272', name: '2,6-Diisopropylnaphthalene', similarity: 0.607143,
    }, {
      dtxsid: 'DTXSID9026342', name: '2-Phenylethanol', similarity: 0.607143,
    }, {
      dtxsid: 'DTXSID5020154', name: 'Clorophene', similarity: 0.605263,
    }, {
      dtxsid: 'DTXSID0025571', name: '2-Methyl-1,3-benzenediol', similarity: 0.6,
    }, {
      dtxsid: 'DTXSID9026710', name: '1-Methoxy-4-methylbenzene', similarity: 0.6,
    }, {
      dtxsid: 'DTXSID6025145', name: '2,5-Dimethylphenol', similarity: 0.6,
    },
  ],
  selectedReadAcross: [],
  selectedPODS: [],
  PODJustifications: [],
};
