const queryString = {
  fromString(str) {
    if (!str) {
      return {};
    }

    if (str[0] === "?") {
      str = str.substring(1);
    }

    return str
      .split("&")
      .map(kv => kv.split("="))
      .reduce((acc, [k, v]) => {
        acc[k] = v;
        return acc;
      }, {});
  },

  toString(obj) {
    return Object.keys(obj)
      .map(key => `${key}=${obj[key]}`)
      .join("&");
  }
};

export default queryString;
