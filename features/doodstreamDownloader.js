// features/doodstreamDownloader.js
const axios = require('axios');
const cheerio = require('cheerio');

async function doodstreamDownloader(url) {
    if (!url.startsWith('https://dood.li/')) {
        throw new Error('Invalid link. example https://dood.li/');
    }

    const id = url.split('/').pop();
    const base = 'https://dood.li/d/';
    const fullUrl = `${base}${id}`;

    try {
        const response = await axios.get(fullUrl);
        const $ = cheerio.load(response.data);

        if (!$('#os_player iframe').length) {
            throw new Error('Video not found');
        }

        const result = {
            title: $('.title-wrap h4').text().trim(),
            duration: $('.length').text().trim(),
            size: $('.size').text().trim(),
            uploadDate: $('.uploadate').text().trim(),
            downloadLink: 'https://dood.li' + $('.download-content a').attr('href')
        };

        const headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Pragma': 'no-cache',
            'Referer': 'https://dood.li/',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Postify/1.0.0',
            'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"'
        };

        const downloadResponse = await axios.get(result.downloadLink, { headers });
        const $download = cheerio.load(downloadResponse.data);
        result.directLink = $download('a').attr('href');

        return result;
    } catch (error) {
        throw new Error(`Doodstream download error: ${error.message}`);
    }
}

module.exports = doodstreamDownloader;