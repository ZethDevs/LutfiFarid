const axios = require('axios');

const searchThatSong = {
  detect: async function(lyric) {
    try {
      const response = await axios.post('https://searchthatsong.com/', 
        { data: lyric }, 
        {
          headers: {
            'Content-Type': 'text/plain',
            'origin': 'https://searchthatsong.com',
            'referer': 'https://searchthatsong.com/'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

module.exports = searchThatSong;