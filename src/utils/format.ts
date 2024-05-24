import {isObject} from "lodash";

export const deconstructObject = (obj: any) => {
  const result: any = {};

  for (const key in obj) {
    const value = obj[key];

    if (isObject(value) && value !== null) {

      if (Array.isArray(value)) {
        result[key] = JSON.stringify(value);
      } else {
        const flattened = deconstructObject(value);
        for (const subKey in flattened) {
          result[key + '.' + subKey] = flattened[subKey];
        }
      }

    } else {
      result[key] = value;
    }
  }

  return result;
};

export const resetObject = (obj: any) => {
  const result: any = {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        result[key] = [];
      } else if (Object.prototype.toString.call(value) === '[object Object]') {
        result[key] = resetObject(value);
      }
    } else {
      if (typeof value === 'string') {
        if (['false', 'true'].includes(value.trim())) {
          result[key] = 'true';
        } else {
          result[key] = '';
        }
      } else if (typeof value === 'number') {
        result[key] = 0;
      } else if (typeof value === 'boolean') {
        result[key] = true;
      }
    }
  }
  return result;
}
