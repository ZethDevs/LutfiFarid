// features/tikdd.js
const axios = require('axios');
const { JSDOM } = require('jsdom');

class TikDown {
    constructor() {
        this.url = 'https://www.tikdd.cc/wp-json/aio-dl/video-data/';
        this.headers = {
            'accept': '*/*',
            'content-type': 'application/x-www-form-urlencoded',
            'origin': 'https://www.tikdd.cc',
            'referer': 'https://www.tikdd.cc/',
            'user-agent': 'Postify/1.0.0',
            'cookie': 'pll_language=en',
            'x-forwarded-for': Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.')
        };
    }

    async toket() {
        const { data } = await axios.get('https://www.tikdd.cc');
        const token = new JSDOM(data).window.document.getElementById('token').value;
        if (!token) throw new Error('Token not found 😆');
        return token;
    }

    bypassHash(url) {
        return Buffer.from(url).toString('base64') + (url.length + 1000) + Buffer.from('aio-dl').toString('base64');
    }

    async get(videoUrl) {
        const token = await this.toket();
        const hash = this.bypassHash(videoUrl);
        const response = await axios.post(this.url, new URLSearchParams({ url: videoUrl, token, hash }), { headers: this.headers });
        return response.data;
    }
}

module.exports = TikDown;