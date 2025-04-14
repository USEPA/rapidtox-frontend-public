import type {
  BerCalcData, BerCalcRow, BioactivitySessionData, SelectedChemicalsParams,
} from './types';
import type {Dtxsid, DtxsidMap} from '~~/types';

export const useBioactivityStore = defineStore('bioActivity', () => {
  // Bioactivity session data
  const hasVisited = ref(false);

  const loadBioActivitySession = (sessionData: BioactivitySessionData) => {
    if (!sessionData) {
      return;
    }
    hasVisited.value = sessionData.hasVisited;
    selectedToxcastChemicals.value = sessionData.selectedToxcastChemicals;
    berCalcData.value = sessionData?.berCalcData || [];
    selectedBerCalcData.value = sessionData?.selectedBerCalcData || [];
    selectedBioactivitySummaryChemicals.value = sessionData?.selectedBioactivitySummaryChemicals || [];
    bioActivityChemsWithNoToxcast.value = sessionData?.bioActivityChemsWithNoToxcast || [];
    bioActivityChemsWithNoBer.value = sessionData?.bioActivityChemsWithNoBer || [];
    bioActivityChemsWithNoSummary.value = sessionData?.bioActivityChemsWithNoSummary || [];
  };

  const resetBioactivity = () => {
    hasVisited.value = false;
    selectedToxcastChemicals.value = [];
    berCalcData.value = [];
    selectedBerCalcData.value = [];
    selectedBioactivitySummaryChemicals.value = [];
    bioActivityChemsWithNoToxcast.value = [];
    bioActivityChemsWithNoBer.value = [];
    bioActivityChemsWithNoSummary.value = [];
  };

  // Used for report section to see what data was available but was not selected.
  const bioActivityChemsWithNoToxcast: Ref<Dtxsid[]> = ref([]);
  const bioActivityChemsWithNoBer: Ref<Dtxsid[]> = ref([]);
  const bioActivityChemsWithNoSummary: Ref<Dtxsid[]> = ref([]);

  // Bioactivity Summary
  const selectedBioactivitySummaryChemicals = ref<Dtxsid[]>([]);

  // Selected Toxcast Models (Subtab)
  const selectedToxcastChemicals: Ref<DtxsidMap | object > = ref({});

  // SEEM3 BER Summary (Subtab)
  const berCalcData: Ref<BerCalcData[]> = ref([]);
  const selectedBerCalcData: Ref<BerCalcData[]> = ref([]);

  const initializeBerCalcData = (selectedChemicalsData: SelectedChemicalsParams[]) => {
    const currentBerCalcData = berCalcData.value;
    const currentBerCalcDataDtxsids = currentBerCalcData.map(chem => chem.dtxsid);
    const updatedBerCalcData: BerCalcData[] = selectedChemicalsData.reduce((acc, cv) => {
      if (currentBerCalcDataDtxsids.includes(cv.dtxsid)) {
        const prevBerCalcEntry = currentBerCalcData.find(chem => chem.dtxsid === cv.dtxsid) as BerCalcData;
        acc.push(prevBerCalcEntry);
      } else {
        acc.push({
          rows: [
            {
              podDropDown: cv.aed95Pctile05, dtxsid: cv.dtxsid, preferredName: cv.chemicalName, exposureValue: cv.exposure95PercentMedian, exposureUnits: cv.aedUnit, ber: cv.berLowerbound, type: 'BER', default: true,
            },
            {
              podDropDown: cv.aed95Pctile05, dtxsid: cv.dtxsid, preferredName: cv.chemicalName, exposureValue: cv.exposureMedian, exposureUnits: cv.aedUnit, ber: cv.berMedian, type: 'BER Median', default: true,
            },
            {
              podDropDown: '',
              exposureValue: '',
              exposureUnits: cv.aedUnit,
              ber: '',
              type: 'Custom',
              dtxsid: cv.dtxsid,
              preferredName: cv.chemicalName,
              addRow: true,
              podDropDownOptions: [
                {
                  text: '5th %ile AED95', value: {label: 'aed95Pctile05', val: cv.aed95Pctile05}, key: 'aed95Pctile05',
                },
                {
                  text: '50 %ile AED95', value: {label: 'aed95Pctile50', val: cv.aed95Pctile50}, key: 'aed95Pctile50',
                },
                {
                  text: '95th %ile AED95', value: {label: 'aed95Pctile95', val: cv.aed95Pctile95}, key: 'aed95Pctile95',
                },
              ],
            },
          ],
          preferredName: cv.chemicalName,
          dtxsid: cv.dtxsid,
        });
      }
      return acc;
    }, [] as BerCalcData[]);

    // Remove anything from state that was removed in selections
    const selectedChemicalsDtxsids = selectedChemicalsData.map(chem => chem.dtxsid);
    const filteredBerCalcData = updatedBerCalcData.filter(ber => selectedChemicalsDtxsids.includes(ber.dtxsid));
    berCalcData.value = filteredBerCalcData;
  };

  const saveBerCalcEntry = ({dtxsid, rowData}: {
    dtxsid: Dtxsid; rowData: BerCalcRow[];
  }) => {
    const currentBerCalcData: BerCalcData[] = JSON.parse(JSON.stringify(berCalcData.value));
    const currentBerCalcDataIndex = currentBerCalcData.findIndex(ber => ber.dtxsid === dtxsid);
    // Remove old entries
    const filteredRows = currentBerCalcData[currentBerCalcDataIndex]!.rows.filter(row => row.default || row.addRow);

    // Remove last row (should always be dummy row for 'Add Row' button)
    const addRow = filteredRows.splice(filteredRows.length - 1, 1);

    // Add new entries
    filteredRows.push(...rowData);

    // Add back the add row.
    filteredRows.push(...addRow);

    currentBerCalcData[currentBerCalcDataIndex]!.rows = filteredRows;
    berCalcData.value = currentBerCalcData;
  };

  const setBerCalcSelected = (selectedSeem3BER: SelectedChemicalsParams[]) => {
    const currentBerCalcData: BerCalcData[] = JSON.parse(JSON.stringify(berCalcData.value));
    const selectedDtxsids = selectedSeem3BER.map(seem3 => seem3.dtxsid);
    const updatedBerCalcData = currentBerCalcData
      .map(berCalc => ({...berCalc, selected: selectedDtxsids.includes(berCalc.dtxsid)}));
    berCalcData.value = updatedBerCalcData;
  };
  const updateBerCalcSelected = (selectedSeem3BER: SelectedChemicalsParams[]) => {
    const currentBerCalcData: BerCalcData[] = JSON.parse(JSON.stringify(berCalcData.value));
    const selectedDtxsids = selectedSeem3BER.map(seem3 => seem3.dtxsid);
    const updatedBerCalcData = currentBerCalcData.filter(ber => selectedDtxsids.includes(ber.dtxsid));
    selectedBerCalcData.value = updatedBerCalcData;
  };

  return {
    selectedToxcastChemicals,
    hasVisited,
    initializeBerCalcData,
    loadBioActivitySession,
    saveBerCalcEntry,
    setBerCalcSelected,
    updateBerCalcSelected,
    selectedBerCalcData,
    resetBioactivity,
    bioActivityChemsWithNoToxcast,
    selectedBioactivitySummaryChemicals,
    bioActivityChemsWithNoBer,
    bioActivityChemsWithNoSummary,
    berCalcData,
  };
});
