import type {ChemicalParams} from '~/api/Report/types';
import type {Dtxsid, DtxsidMap} from '~~/types';

const getBer = (dtxsid: Dtxsid) => {
  // did user select BER data for this DTXSID?
  const hasSelectedBerDataForDtxsid =
    useBioactivityStore().selectedBerCalcData.find(({dtxsid: berDtxsid}) => berDtxsid === dtxsid);

  // nothing selected
  if (!hasSelectedBerDataForDtxsid) { return []; }

  // grab the actual data, including custom BER Calc data
  const actualBerRowData = useBioactivityStore().berCalcData.find(({dtxsid: berDtxsid}) => berDtxsid === dtxsid);

  // no BER data? weird that we got this far -- selected a row, but no data to select from?
  if (!actualBerRowData) { return []; }

  // iterate thru all the actual data for this dtxsid
  return actualBerRowData.rows.reduce((acc, cv) => {
    if (typeof cv.podDropDown === 'object' && !cv.addRow) {
      acc.push({
        podDropDown: cv.podDropDown.val,
        dtxsid: cv.dtxsid,
        preferredName: cv.preferredName,
        exposureValue: cv.exposureValue,
        exposureUnits: cv.exposureUnits,
        ber: cv.ber,
        type: cv.type,
      });
    } else if (cv.default && !cv.addRow) {
      acc.push(cv);
    }
    return acc;
  }, [] as BerCalcRow[]);
};

const getPhyschem = (dtxsid: Dtxsid) => {
  const physchemArr = dtxsid in usePhyschemStore().physchemDataSelected ?
    ((usePhyschemStore().physchemDataSelected as DtxsidMap)[dtxsid] || []) :
    [];
  const envFateArr = dtxsid in useEnvFateStore().envFateDataSelected ?
    ((useEnvFateStore().envFateDataSelected as DtxsidMap)[dtxsid] || []) :
    [];
  return [
    ...physchemArr,
    ...envFateArr,
  ];
};

const getAnalogue = (selectedChemical: SelectedChemical) => {
  const analogueSelectionsObj = useAnalogueStore().analogueChemicalsStepInfo.find((analogue) => {
    if (selectedChemical.dtxsid) {
      return analogue.dtxsid === selectedChemical.dtxsid;
    }
    return analogue.searchWord === selectedChemical.searchWord;
  });

  analogueSelectionsObj?.selectedAnalogues.sort((a, b) => b.similarity - a.similarity);
  return {
    dtxsidList: analogueSelectionsObj?.selectedAnalogues?.map(({dtxsid}) => dtxsid) || [] as Dtxsid[],
    similarityList: analogueSelectionsObj?.selectedAnalogues.filter(({dtxsid}) => analogueSelectionsObj?.selectedAnalogues
      .map(({dtxsid: selectedDtxsid}) => selectedDtxsid).includes(dtxsid)).map(({similarity}) => similarity) || [],
    podIdsList: analogueSelectionsObj?.selectedPODS.map(({id}) => id) || [],
    podJustifications: analogueSelectionsObj?.PODJustifications || [] as PodJustification[],
  };
};

export const mapChemicalReportRequestBody = (selectedRows: SelectedChemical[], reportDesc: string) => {
  const {user: currentUser} = useOidcAuth();
  const username = currentUser?.value?.claims?.email as string;
  const safetyLinkUrl = useRuntimeConfig().public.APPLICATION_SAFETY_LINKS_API;
  return selectedRows.reduce((acc, cv) => {
    const reportObj = {
      username,
      dtxsid: cv.dtxsid,
      safetyLink: cv.safetyLink ? `${safetyLinkUrl}${cv.safetyLink}` : '',
      workflowTitle: useWorkflowData().title,
      sessionKey: useSessionStore().sessionId,
      reportDesc,
      workflow: useWorkflowData().workflowId,
      hasHazardToxData: !!useHazardStore().hazardToxChemsWithNoData.includes(cv.dtxsid),
      hasHazardPodData: !!useHazardStore().hazardPodChemsWithNoData.includes(cv.dtxsid),
      hasPhyschemData: !!usePhyschemStore().physchemChemsWithNoData.includes(cv.dtxsid),
      isBioactivitySummarySelected: !!useBioactivityStore().selectedBioactivitySummaryChemicals.includes(cv.dtxsid),
      hasEnvData: !!useEnvFateStore().envFateChemsWithNoData.includes(cv.dtxsid),
      hasToxcastData: !useBioactivityStore().bioActivityChemsWithNoToxcast.includes(cv.dtxsid),
      hasBerData: !useBioactivityStore().bioActivityChemsWithNoBer.includes(cv.dtxsid),
      data: {
        hazard: cv.dtxsid in useHazardStore().hazardDataSelected ?
          ((useHazardStore().hazardDataSelected as DtxsidMap)[cv.dtxsid]?.filter(hazard => typeof hazard === 'number') || []) :
          [],
        physchem: getPhyschem(cv.dtxsid),
        customData: useHazardStore().hazardChartData || [],
        toxcast: cv.dtxsid in useBioactivityStore().selectedToxcastChemicals ?
          ((useBioactivityStore().selectedToxcastChemicals as DtxsidMap)[cv.dtxsid] || []) :
          [],
        ber: getBer(cv.dtxsid),
        podDataSelected: usePodStore().podDataSelected.filter(pod => 'interimRfV' in pod).map(pod => ({
          ...pod,
          podId: typeof pod.podId !== 'number' ? Number(pod.podId?.replace('custom', '')) : pod.podId,
        })),
        reportAnalogueDetails: getAnalogue(cv),
        predictedExposure: useHazardStore().chartExposure.find(({dtxsid}) => dtxsid === cv.dtxsid)?.value,
      },
    };
    acc.push(reportObj);
    return acc;
  }, [] as ChemicalParams[]);
};
