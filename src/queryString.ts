export interface QueryString {
  [key: string]: string | number | boolean;
}

const queryString = {
  fromString(str: string): QueryString {
    if (!str) {
      return {};
    }

    if (str[0] === '?') {
      str = str.substring(1);
    }

    return str
      .split('&')
      .map(kv => kv.split('='))
      .reduce((acc, [k, v]) => {
        acc[k] = v;
        return acc;
      }, {});
  },

  toString(obj: QueryString) {
    return Object.keys(obj)
      .map(key => `${key}=${obj[key]}`)
      .join('&');
  }
};

export default queryString;
