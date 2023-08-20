
interface SearchParams {
    brand: string;
    model: string;
    year: number;
}

const parseString = (text: unknown): string => {
  if (!(typeof text === 'string')) {
    throw new Error('Incorrect or missing comment');
  }
  return text;

};
const parseYear = (year: unknown): number => {
  if (isNaN(Number(year))) {
    throw new Error('Incorrect year format');
  }
  return Number(year);

};

const toSearchParams = (object: unknown): SearchParams => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data - Expected req.query object');
  }
  const requiredParamsPresent = 'brand' in object && 'model' in object && 'year' in object;
  if (requiredParamsPresent) {
    const params: SearchParams = {
      brand: parseString(object.brand),
      model: parseString(object.model),
      year: parseYear(object.year),
    };

    return params;

  } else {
    throw new Error('Incorrect data: req.query expected fields are brand, model and year');
  }
};

export default { toSearchParams };