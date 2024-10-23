// features/muslimai.js
const axios = require('axios');

const headers = {
  'authority': 'www.muslimai.io',
  'content-type': 'application/json',
  'user-agent': 'Postify/1.0.0'
};

const muslimai = {
  search: async function(query) {
    try {
      const cari = await axios.post('https://www.muslimai.io/api/search', { query }, { headers });
      const passages = cari.data.map(result => result.content).join("\n\n");

      const jawaban = await axios.post('https://www.muslimai.io/api/answer', {
        prompt: `Use the following passages to answer the query to the best of your ability as a world class expert in the Quran. Do not mention that you were provided any passages in your answer in Indonesian: ${query} \n\n${passages}`
      }, { headers });

      return {
        creator: 'ZethDevs',
        status: 'success',
        code: 200,
        data: {
          search: cari.data,
          answer: jawaban.data
        }
      };
    } catch (error) {
      return {
        creator: 'ZethDevs',
        status: 'error',
        code: error.response ? error.response.status : 500,
        data: {},
        message: error.message || ''
      };
    }
  }
};

module.exports = muslimai;