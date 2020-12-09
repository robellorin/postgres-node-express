const axios = require("axios");
const { endsWith } = require("mout/string");

const token = async (ip) => {
  try {
    let formatedIP = ip;

    if (!(endsWith(formatedIP, "/") && endsWith(formatedIP, "\\"))) {
      formatedIP = formatedIP + "/";
    }

    const res = await axios.get(`${formatedIP}readini `);

    if (res) {
      return res.data;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

module.exports = token;
