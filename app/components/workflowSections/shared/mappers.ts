import type {IRowNode} from 'ag-grid-community';
import type {PodSectionName} from '../pod/types';
import type {
  DtxsidMap, PodData, Dtxsid,
} from '~~/types';
import type {PodChartParams} from '~/api/PODRepository/types';

export const getToxNodeData = (leafChildren: IRowNode<globalThis.HazardPodDataSelection | PodData>[] | null) => {
  if (leafChildren?.length) {
    const regExp = /[a-dA-D]|[f-zF-Z]/g;
    return leafChildren.reduce((acc, cv) => {
      if (!regExp.test(cv.data?.toxvalNumeric as string)) {
        acc.push({
          ...cv.data,
          toxvalNumeric: parseFloat(cv.data?.toxvalNumeric as string),
        } as HazardPodDataSelection);
      }
      return acc;
    }, [] as HazardPodDataSelection[]);
  }
  return [];
};

export const mapChartData = ({
  physchemDataSelected,
  customChartData,
  hazardDataSelected,
  analogueSteps,
  nodeDataDtxsid,
  section,
  username,
  predictedExposure,
}: {
  physchemDataSelected: DtxsidMap | Record<string, never>;
  customChartData: PodData[];
  hazardDataSelected: DtxsidMap | Record<string, never>;
  analogueSteps: AnalogueStepInfo[];
  nodeDataDtxsid: Dtxsid | undefined;
  section: PodSectionName;
  username: string;
  predictedExposure?: number;
}): Omit<PodChartParams, 'chartType'> => {
  const analogueSelectionsObj = analogueSteps.find((analogue) => {
    if (nodeDataDtxsid) {
      return analogue.dtxsid === nodeDataDtxsid;
    }
    return [];
  });
  analogueSelectionsObj?.selectedAnalogues.sort((a, b) => b.similarity - a.similarity);
  return {
    username,
    dtxsid: (nodeDataDtxsid || '') as Dtxsid,
    hasHazardToxData: true,
    hasHazardPodData: true,
    hasPhyschemData: true,
    width: 550,
    height: 550,
    section,
    data: {
      predictedExposure,
      customData: customChartData,
      hazard:
        (hazardDataSelected as DtxsidMap)?.[nodeDataDtxsid as Dtxsid]?.filter(haz => typeof haz === 'number') ||
        [],
      physchem: (physchemDataSelected as DtxsidMap)?.[nodeDataDtxsid as Dtxsid] || [],
      reportAnalogueDetails: {
        dtxsidList: analogueSelectionsObj?.selectedAnalogues.map(({dtxsid}) => dtxsid) as Dtxsid[],
        similarityList: analogueSelectionsObj?.selectedAnalogues
          .filter(({dtxsid}) => JSON.stringify(analogueSelectionsObj.selectedPODS)
            .includes(dtxsid)).map(({similarity}) => similarity.toString()) || [],
        podIdsList: analogueSelectionsObj?.selectedPODS.map(({id}) => id) || [],
        podJustifications: analogueSelectionsObj?.PODJustifications || [],
      },
    },
  };
};
