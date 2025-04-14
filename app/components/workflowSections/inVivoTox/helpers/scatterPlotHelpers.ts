import type {AgScatterSeriesOptions, AgBaseCrossLineOptions} from 'ag-charts-community';
import type {ChartPodData} from '../dialogs/ScatterPlotDialog.vue';
import type {Dtxsid, PodData} from '~~/types';

export interface ChartData {
  toxData: ChartPodData[];
  podData: ChartPodData[];
  userPodData: ChartPodData[];
  userToxData: ChartPodData[];
}

const getMinAxes = (exposureData: ExposureChartData[], selectedDtxsid: Dtxsid) => {
  const exposureDataObj = exposureData.find(exp => exp?.dtxsid === selectedDtxsid);
  if (exposureData && exposureDataObj) {
    return exposureDataObj.value ? parseFloat(String(exposureDataObj.value)) : 0;
  }
  return 0;
};

export const getSeriesData = (mappedData: ChartData) => {
  return [
    {
      type: 'scatter',
      xKey: 'study',
      data: mappedData.toxData,
      yKey: 'toxVal',
      yName: 'Toxicity Values',
      tooltip: {
        renderer(params: {
          datum: ScatterPlotToolTipParams;
        }) {
          return `${gridUtil.renderers.toolTipRenderer(params.datum)}`;
        },
      },
      shape: 'square',
      fill: 'orange',
      stroke: 'orange',
      size: 15,
    },
    {
      type: 'scatter',
      xKey: 'study',
      data: mappedData.podData,
      yKey: 'toxVal',
      yName: 'Point of Departure',
      tooltip: {
        renderer(params: {
          datum: ScatterPlotToolTipParams;
        }) {
          return `${gridUtil.renderers.toolTipRenderer(params.datum)}`;
        },
      },
      shape: 'triangle',
      fill: 'purple',
      stroke: 'purple',
      size: 15,
    },
    {
      type: 'scatter',
      xKey: 'study',
      data: mappedData.userToxData,
      yKey: 'toxVal',
      yName: 'User Toxicity Values',
      tooltip: {
        renderer(params: {
          datum: ScatterPlotToolTipParams;
        }) {
          return `${gridUtil.renderers.toolTipRenderer(params.datum)}`;
        },
      },
      shape: 'square',
      fill: 'rgba(0,0,0,0)',
      stroke: 'orange',
      size: 15,
    },
    {
      type: 'scatter',
      xKey: 'study',
      data: mappedData.userPodData,
      yKey: 'toxVal',
      yName: 'User Point of Departure',
      labelKey: 'toxVal',
      tooltip: {
        renderer(params: {
          datum: ScatterPlotToolTipParams;
        }) {
          return `${gridUtil.renderers.toolTipRenderer(params.datum)}`;
        },
      },
      shape: 'triangle',
      fill: 'rgba(0,0,0,0)',
      stroke: 'purple',
      size: 15,

    },
  ];
};

export const getExposureData = (expVal: ExposureChartData) => {
  return [
    {
      type: 'line',
      value: expVal.value ? parseFloat(String(expVal.value)) : 0,
      fillOpacity: 0.4,
      stroke: 'rgb(20,20,200)',
      fill: 'rgb(20,20, 200)',
      label: {
        text: `${expVal.type} Exposure`,
        fontSize: 16,
      },
    },
  ];
};

export const getChartOptions = (seriesData: AgScatterSeriesOptions[], exposureData: AgBaseCrossLineOptions, exposureItems: ExposureChartData[], selectedDtxsid: Dtxsid, exposureRoute: 'oral' | 'inhalation') => {
  return {
    title: {
      text: 'Scatter Chart',
      fontSize: 20,
    },
    series: seriesData,
    legend: {
      item: {
        label: {
          fontSize: 16,
        },
      },
    },
    padding: {
      left: 20,
      right: 20,
    },
    height: 700,
    width: 1000,

    axes: [
      {
        type: 'category',
        position: 'bottom',
        paddingOuter: 0.5,
        paddingInner: 0.5,
        title: {text: 'Exposure Duration Class', fontSize: 20},
        label: {
          fontSize: 16,
        },
      },
      {
        type: 'log',

        min: getMinAxes(exposureItems, selectedDtxsid),

        title: {text: ` ${exposureRoute === 'oral' ? ' Oral mg/kg per day' : 'Inhalation mg/m3'}`, fontSize: 20},
        tick: {
          minSpacing: 0.05,
        },
        crossLines: exposureData,
        position: 'left',
        label: {
          fontSize: 16,
        },
      },
    ],
  };
};

/** Map Hazard Data to Consumable AG Chart Object */
export const mapChartData = (data: PodData[]) => {
  const types = ['acute', 'short-term', 'subchronic', 'chronic', 'reproduction', 'developmental', 'carcinogenicity'];
  // gather user custom data and selected hazard data, filtering by exposure route
  const chartData = data;
  // initizalize arrays of chart data
  const podData: ChartPodData[] = types.map(type => ({study: type}));
  const toxData: ChartPodData[] = types.map(type => ({study: type}));
  const userToxData: ChartPodData[] = types.map(type => ({study: type}));
  const userPodData: ChartPodData[] = types.map(type => ({study: type}));
  // populate all categories

  const constantMap = {
    [SUPER_HAZARD_TYPES.POD_NAME]: 'podData',
    [SUPER_HAZARD_TYPES.TOX_NAME]: 'toxData',
    [SUPER_HAZARD_TYPES.CUSTOM_POD_NAME]: 'userPodData',
    [SUPER_HAZARD_TYPES.CUSTOM_TOX_NAME]: 'userToxData',
  };

  return chartData.reduce((acc, cv) => {
    if (
      cv.studyType !== '-' &&
      !Number.isNaN(parseFloat(String(cv.toxvalNumeric))) &&
      parseFloat(String(cv.toxvalNumeric))) {
      if (Object.keys(constantMap).includes(cv.superCategory)) {
        const accKey = constantMap[cv.superCategory] as keyof ChartData;
        acc[accKey].push({
          study: cv.studyType,
          toxVal: parseFloat(String(cv.toxvalNumeric)),
          type: cv.superCategory,
          species: cv.speciesCommon,
          source: cv.superSource,
        });
      }
    }

    return acc;
  }, {
    toxData,
    podData,
    userPodData,
    userToxData,
  });
};

/** Filters */
export const filterByRoute = (arg: PodData, exposureRoute: 'oral' | 'inhalation') => {
  if (exposureRoute === 'oral') {
    return arg.exposureRoute === 'oral';
  }
  if (exposureRoute === 'inhalation') {
    return arg.exposureRoute === 'inhalation';
  }
  return false;
};

export const filterUnits = (toxvalUnits: string) => {
  const allowedUnits = ['mg/kg-day', 'mg/m3', '(mg/kg-day)-1', 'mg/kg', 'mg/cm2'];
  return allowedUnits.includes(toxvalUnits);
};
