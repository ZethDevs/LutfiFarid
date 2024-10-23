const videy = {
  convert: async function(url) {
    const param = this.getName('id', url);
    if (!param) return { creator: 'ZethDevs', status: 'error', code: 400, message: 'Parameter id tidak ditemukan!' };

    const fileType = param[8] === '2' ? '.mov' : '.mp4';
    const mimeType = param[8] === '2' ? 'video/quicktime' : 'video/mp4';
    const videoLink = `https://cdn.videy.co/${param}${fileType}`;

    return { creator: 'ZethDevs', status: 'success', code: 200, data: { mimeType, link: videoLink } };
  },

  getName: function(name, url) {
    const results = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)').exec(url);
    return results && results[2] ? decodeURIComponent(results[2].replace(/\+/g, ' ')) : null;
  }
};

module.exports = videy;