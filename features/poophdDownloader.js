const axios = require('axios');

const headers = {
    'authority': 'poopdown.com',
    'accept': '*/*',
    'referer': 'https://poopdown.com/',
    'user-agent': 'Postify/1.0.0',
    'x-requested-with': 'XMLHttpRequest'
};

const PoopDown = async (url) => {
    const id = url.match(/\/[de]\/([a-zA-Z0-9]+)/)?.[1];
    if (!id) throw new Error('Link PoopHD nya gak bisa diproses bree, ganti link yang lain aja.');

    try {
        const { data: { file: fileName }} = await axios.get(`https://poopdown.com/getKey.php?id=${id}`, { headers });
        const { data: { direct_link: directLink }} = await axios.get(`https://mba.dog/download.php?key=${encodeURIComponent(fileName)}`, {
            headers: { ...headers, 'authorization': 's' }
        });

        return directLink;
    } catch (error) {
        throw new Error('An error occurred while processing the PoopHD link.');
    }
};

module.exports = PoopDown;