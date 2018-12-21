export const get = (obj: object, key: string, defaultValue: {}) =>
  obj[key] == null ? defaultValue : obj[key];

export const compact = (obj: object) =>
  Object.keys(obj).reduce((acc, k) => {
    if (obj[k]) {
      acc[k] = obj[k];
    }
    return acc;
  }, {});
