const axios = require('axios');

const aiAnswer = {
  chat: async function(input) {
    try {
      const response = await axios.post('https://aianswer.pro/api', 
        { question: input }, 
        { 
          headers: {
            'content-type': 'application/json',
            'origin': 'https://aianswer.pro',
            'referer': 'https://aianswer.pro/',
            'user-agent': 'Postify/1.0.0'
          }
        }
      );
      return {
        creator: 'ZethDevs',
        status: 'success',
        code: 200,
        data: response.data
      };
    } catch (error) {
      return {
        creator: 'ZethDevs',
        status: 'error',
        code: error.response ? error.response.status : 500,
        message: error.message
      };
    }
  }
};

module.exports = aiAnswer;