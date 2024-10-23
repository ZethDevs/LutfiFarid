const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const PoopDown = require('./features/poophdDownloader.js');
const videy = require('./features/videyDownloader.js');
const muslimai = require('./features/muslimai.js');
const searchThatSong = require('./features/searchThatSong.js');
const aiAnswer = require('./features/aiAnswer.js');
const BlackBox = require('./features/blackboxAI');
const FluxImage = require('./features/fluxImage.js');
const TeraBoxDL = require('./features/teraboxDownloader.js');
const TikDown = require('./features/tikdd.js');

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());

// Middleware untuk memeriksa API key
const checkApiKey = (req, res, next) => {
  const apiKey = req.query.api_key || req.headers['x-api-key'];
  if (apiKey !== 'lutfi') {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
};

app.get('/', (req, res) => {
  res.render('index', {
    title: 'ZethDevs - APIs',
    heading: 'Welcome to ZethDevs APIs',
    content: 'This is a simple template using EJS.'
  });
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ZethDevs - APIs',
      version: '1.0.0',
      description: 'Free Rest API for everyone without limit.\n\nThis project is licensed under the <a href="https://opensource.org/licenses/MIT">MIT License</a>.',
      contact: {
        name: 'ZethDevs',
        url: 'https://zethdevs.xyz',
        email: 'lutfi.faridd@gmail.com'
      },
    },
    servers: [
      {
        url: 'Belum mas',
        description: 'Production server'
      },
      {
        url: 'http://localhost:5000',
        description: 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'query',
          name: 'api_key'
        }
      }
    },
    security: [{
      ApiKeyAuth: []
    }]
  },
  apis: ['./app.js'], // path to your app.js file
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Custom Swagger UI options
const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "ZethDevs API Documentation",
  customfavIcon: "/path/to/your/favicon.ico"
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/api/videy-downloader', checkApiKey, async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const result = await videy.convert(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/poophd-downloader', checkApiKey, async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const directLink = await PoopDown(url);
    res.json({
      creator: 'ZethDevs',
      status: 'success',
      code: 200,
      data: {
        link: directLink
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * @swagger
 * /api/videy-downloader:
 *   get:
 *     tags:
 *       - Downloader
 *     summary: Download a video from Videy
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL of the video to download
 *       - in: query
 *         name: api_key
 *         required: true
 *         schema:
 *           type: string
 *         description: API key for authentication
 *     responses:
 *       200:
 *         description: The video download link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                 status:
 *                   type: string
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     mimeType:
 *                       type: string
 *                     link:
 *                       type: string
 *       400:
 *         description: Error message when URL is missing or invalid
 *       401:
 *         description: Error message when API key is invalid
 *       500:
 *         description: Server error message
 */

/**
 * @swagger
 * /api/poophd-downloader:
 *   get:
 *     tags:
 *       - Downloader
 *     summary: Download a video from PoopHD
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL of the PoopHD video to download
 *       - in: query
 *         name: api_key
 *         required: true
 *         schema:
 *           type: string
 *         description: API key for authentication
 *     responses:
 *       200:
 *         description: The video download link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                 status:
 *                   type: string
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     link:
 *                       type: string
 *       400:
 *         description: Error message when URL is missing or invalid
 *       401:
 *         description: Error message when API key is invalid
 *       500:
 *         description: Server error message
 */

/**
 * @swagger
 * /api/muslim-ai:
 *   get:
 *     tags:
 *       - AI
 *     summary: Get Quranic answers using Muslim AI
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The question about Islam/Quran
 *       - in: query
 *         name: api_key
 *         required: true
 *         schema:
 *           type: string
 *         description: API key for authentication
 *     responses:
 *       200:
 *         description: Successful response with answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                 status:
 *                   type: string
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     search:
 *                       type: array
 *                       items:
 *                         type: object
 *                     answer:
 *                       type: string
 *       400:
 *         description: Error message when query is missing
 *       401:
 *         description: Error message when API key is invalid
 *       500:
 *         description: Server error message
 */
app.get('/api/muslim-ai', checkApiKey, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      creator: 'ZethDevs',
      status: 'error',
      code: 400,
      data: {},
      message: 'Query parameter is required'
    });
  }

  try {
    const result = await muslimai.search(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      creator: 'ZethDevs',
      status: 'error',
      code: 500,
      data: {},
      message: error.message || 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/search-that-song:
 *   get:
 *     tags:
 *       - Tools
 *     summary: Search song by lyrics ( YouTube )
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: lyric
 *         required: true
 *         schema:
 *           type: string
 *         description: The lyrics to search for
 *       - in: query
 *         name: api_key
 *         required: true
 *         schema:
 *           type: string
 *         description: API key for authentication
 *     responses:
 *       200:
 *         description: Successfully found the song
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                 status:
 *                   type: string
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *       400:
 *         description: Error message when lyrics are missing
 *       401:
 *         description: Error message when API key is invalid
 *       500:
 *         description: Server error message
 */
app.get('/api/search-that-song', checkApiKey, async (req, res) => {
  const { lyric } = req.query;

  if (!lyric) {
    return res.status(400).json({
      creator: 'ZethDevs',
      status: 'error',
      code: 400,
      message: 'Lyrics parameter is required'
    });
  }

  try {
    const result = await searchThatSong.detect(lyric);
    res.json({
      creator: 'ZethDevs',
      status: 'success',
      code: 200,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      creator: 'ZethDevs',
      status: 'error',
      code: 500,
      message: error.message || 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/ai-answer:
 *   get:
 *     tags:
 *       - AI
 *     summary: Get answers from AI Answer Generator
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The question to ask the AI
 *       - in: query
 *         name: api_key
 *         required: true
 *         schema:
 *           type: string
 *         description: API key for authentication
 *     responses:
 *       200:
 *         description: Successful response with AI answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                 status:
 *                   type: string
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *       400:
 *         description: Error message when query is missing
 *       401:
 *         description: Error message when API key is invalid
 *       500:
 *         description: Server error message
 */
app.get('/api/ai-answer', checkApiKey, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      creator: 'ZethDevs',
      status: 'error',
      code: 400,
      message: 'Query parameter is required'
    });
  }

  try {
    const result = await aiAnswer.chat(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      creator: 'ZethDevs',
      status: 'error',
      code: 500,
      message: error.message || 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/blackbox-chat:
 *   get:
 *     tags:
 *       - AI
 *     summary: Get responses from BlackBox AI Chat
 *     description: Generate AI responses using BlackBox's advanced language models including GPT-4, Claude, and Gemini
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The question or prompt for the AI
 *       - in: query
 *         name: model
 *         required: false
 *         schema:
 *           type: string
 *           enum: [gpt-4o, claude-3.5-sonnet, gemini-pro, llama-3.1-405b, llama-3.1-70b, gemini-1.5-flash]
 *         description: The AI model to use (defaults to gpt-4o)
 *       - in: query
 *         name: temperature
 *         required: false
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 1
 *         description: Controls randomness in the output (0.0 to 1.0, defaults to 0.7)
 *       - in: query
 *         name: api_key
 *         required: true
 *         schema:
 *           type: string
 *         description: API key for authentication
 *     responses:
 *       200:
 *         description: Successful response with AI generated answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   example: ZethDevs
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: string
 *                   example: "This is the AI generated response..."
 *       400:
 *         description: Error message when query is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   example: ZethDevs
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Query parameter is required
 *       401:
 *         description: Error message when API key is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid API key
 *       500:
 *         description: Server error message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                   example: ZethDevs
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

app.get('/api/blackbox-chat', checkApiKey, async (req, res) => {
  const { query, model = 'gpt- 4o', temperature = 0.7 } = req.query;

  if (!query) {
    return res.status(400).json({
      creator: 'ZethDevs',
      status: 'error',
      code: 400,
      message: 'Query parameter is required'
    });
  }

  try {
    const result = await BlackBox.generate([{ content: query, role: 'user' }], { model, temperature });
    res.json({
      creator: 'ZethDevs',
      status: 'success',
      code: 200,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      creator: 'ZethDevs',
      status: 'error',
      code: 500,
      message: error.message || 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/flux-image:
 *   get:
 *     tags:
 *       - Image Generator
 *     summary: Generate images using FLUX Image Generator
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: prompt
 *         required: true
 *         schema:
 *           type: string
 *         description: The prompt for image generation
 *       - in: query
 *         name: style
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Hyper-Surreal Escape, Neon Fauvism, Post-Analog Glitchscape, AI Dystopia, Vivid Pop Explosion]
 *         description: The style to apply to the generated image
 *       - in: query
 *         name: api_key
 *         required: true
 *         schema:
 *           type: string
 *         description: API key for authentication
 *     responses:
 *       200:
 *         description: Successfully generated image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                 status:
 *                   type: string
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     image:
 *                       type: string
 *                     style:
 *                       type: string
 *       400:
 *         description: Error message when parameters are missing or invalid
 *       401:
 *         description: Error message when API key is invalid
 *       500:
 *         description: Server error message
 */
app.get('/api/flux-image', checkApiKey, async (req, res) => {
    const { prompt, style } = req.query;

    if (!prompt || !style) {
        return res.status(400 ).json({
            creator: 'ZethDevs',
            status: 'error',
            code: 400,
            message: 'Prompt and style parameters are required'
        });
    }

    try {
        const result = await FluxImage(prompt, style);
        res.json({
            creator: 'ZethDevs',
            status: 'success',
            code: 200,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            creator: 'ZethDevs',
            status: 'error',
            code: 500,
            message: error.message || 'Internal server error'
        });
    }
});

// Add this new route
/**
 * @swagger
 * /api/terabox-downloader:
 *   get:
 *     tags:
 *       - Downloader
 *     summary: Download files from TeraBox
 *     description: contoh link nya https://terabox.com/s/1LaIS5DTAdx55FmadHXNzlQ atau https://www.terabox.com/wap/share/filelist?surl=4w8KpzSQz7tFyBrADmlOmQ, ubah agar domain menjadi terabox.com
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: The TeraBox URL to download from
 *       - in: query
 *         name: api_key
 *         required: true
 *         schema:
 *           type: string
 *         description: API key for authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved download information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                 status:
 *                   type: string
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     size:
 *                       type: string
 *                     link:
 *                       type: string
 *                     direct_link:
 *                       type: string
 *       400:
 *         description: Error message when URL is missing or invalid
 *       401:
 *         description: Error message when API key is invalid
 *       500:
 *         description: Server error message
 */
app.get('/api/terabox-downloader', checkApiKey, async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      creator: 'ZethDevs',
      status: 'error',
      code: 400,
      message: 'URL parameter is required'
    });
  }

  try {
    const teraboxDL = new TeraBoxDL();
    const result = await teraboxDL.fetch(url);
    res.json({
      creator: 'ZethDevs',
      status: 'success',
      code: 200,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      creator: 'ZethDevs',
      status: 'error',
      code: 500,
      message: error.message || 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/aio-downloader:
 *   get:
 *     tags:
 *       - Downloader
 *     summary: All-in-One Downloader
 *     description: |
 *       Download videos from various social media platforms.
 *       
 *       Support Web:
 *       - Tiktok
 *       - Bilibili
 *       - Capcut
 *       - Douyin
 *       - Facebook
 *       - Instagram
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL of the video to download
 *       - in: query
 *         name: api_key
 *         required: true
 *         schema:
 *           type: string
 *         description: API key for authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved download information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creator:
 *                   type: string
 *                 status:
 *                   type: string
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *       400:
 *         description: Error message when URL is missing or invalid
 *       401:
 *         description: Error message when API key is invalid
 *       500:
 *         description: Server error message
 */
app.get('/api/aio-downloader', checkApiKey, async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({
            creator: 'ZethDevs',
            status: 'error', code: 400,
            message: 'URL parameter is required'
        });
    }

    try {
        const tikdd = new TikDown();
        const result = await tikdd.get(url);
        res.json({
            creator: 'ZethDevs',
            status: 'success',
            code: 200,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            creator: 'ZethDevs',
            status: 'error',
            code: 500,
            message: error.message || 'Internal server error'
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});