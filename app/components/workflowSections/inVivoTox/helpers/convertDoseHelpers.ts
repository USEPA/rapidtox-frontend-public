export const allowedUnits = ['ppm', 'ppb', 'mg/m3', 'ug/m3'];

export const conversionFormulas = [
  {
    to: 'mg/m3',
    from: 'ppm',
    formula: (molWeight: number, val: number) => {
      return 0.0409 * val * molWeight;
    },
  },
  {
    to: 'ug/m3',
    from: 'ppb',
    formula: (molWeight: number, val: number) => {
      return 0.0409 * val * molWeight;
    },
  },
  {
    to: 'ppm',
    from: 'mg/m3',
    formula: (molWeight: number, val: number) => {
      return 24.45 * val / molWeight;
    },
  },
  {
    to: 'ppb',
    from: 'ug/m3',
    formula: (molWeight: number, val: number) => {
      return 24.45 * val / molWeight;
    },
  },
];

export const convertDose = ({
  molWeight, to, from, val,
}: {
  molWeight: number;
  to: string;
  from: string;
  val: number;
}) => {
  const conversionFormula = conversionFormulas
    .find(({to: formulaTo, from: formulaFrom}) => formulaTo === to && formulaFrom === from);
  if (conversionFormula) {
    return conversionFormula.formula(molWeight, val);
  }
  return 0;
};

export const convertSuperCategoryName = (superCategory: string | undefined) => {
  if (!superCategory) {
    throw new Error('Must be valid superCategory');
  }
  return `Converted ${superCategory.trim()}`;
};
