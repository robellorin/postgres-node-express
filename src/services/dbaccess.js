const axios = require('axios');
const { endsWith } = require('mout/string');
const httpHeader = 'http://';
const phpApiPort = '4540';

const dbaccess = async (ip, token) => {
  try {
    let formatedIP = ip;

    if (!(endsWith(formatedIP, '/') && !endsWith(formatedIP, '\\'))) {
      formatedIP = formatedIP + `:${phpApiPort}/`;
    }
    axios.defaults.headers.common.Authorization = token;
    const res = await axios.get(
      `${httpHeader}${formatedIP}get_access.php`,
    );
    if (res) {
      return res.data;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default dbaccess;
