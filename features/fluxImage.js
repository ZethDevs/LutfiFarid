// features/fluxImage.js
const axios = require('axios');
const FormData = require('form-data');
const cheerio = require('cheerio');

const meki = ['Hyper-Surreal Escape', 'Neon Fauvism', 'Post-Analog Glitchscape', 'AI Dystopia', 'Vivid Pop Explosion'];

const FluxImage = async (prompt, style) => {
    if (!meki.includes(style)) {
        throw new Error('Buta huruf kah? Style nya udah dicantumin, masih aja salah input... wohhh lawak lu ang ang ang ang ang 🤣');
    }

    const url = 'https://devrel.app.n8n.cloud/form/flux';

    const formData = new FormData();
    formData.append('field-0', prompt);
    formData.append('field-1', style);

    const headers = {
        'Accept': '*/*',
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
        'User-Agent': 'Postify/1.0.0',
        ...formData.getHeaders()
    };

    try {
        const { data } = await axios.post(url, formData, { headers });
        
        const $ = cheerio.load(data);
        return {
            image: $('.image-container img').attr('src'),
            style: $('.style-text').text().replace('Style: ', ''),
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = FluxImage;