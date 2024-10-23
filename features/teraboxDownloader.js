// features/teraboxDownloader.js
const axios = require('axios');

class TeraBoxDL {
  constructor() {
    this.url = 'https://testterabox.vercel.app/api';
    this.headers = {
      'authority': 'testterabox.vercel.app',
      'accept': '*/*',
      'content-type': 'application/json',
      'user-agent': 'Postify/1.0.0',
      'x-forwarded-for': Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.')
    };
  }

  valid(url) {
    const regex = /^(https?:\/\/(www\.)?terabox\.com\/(s|wap\/share))/;
    return regex.test(url);
  }

  async fetch(url) {
    if (!this.valid(url)) {
      throw new Error('Link nya gak valid!".');
    }

    const body = { url };
    const response = await axios.post(this.url, body, { headers: this.headers })
      .catch(error => {
        throw new Error(`${error.response ? error.response.status : error.message}`);
      });

    const proxy = "https://teraboxdownloader.online/proxy.php?url=";
    ['link', 'direct_link'].forEach(key => {
      if (response.data[key]) {
        response.data[key] = proxy + encodeURIComponent(response.data[key]);
      }
    });

    return response.data;
  }
}

module.exports = TeraBoxDL;