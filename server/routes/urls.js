const express = require('express');
const shortid = require('shortid');
const Url = require('../models/Url');
const router = express.Router();

// Validate URL format
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

// POST /api/urls - Create a new short URL
router.post('/', async (req, res) => {
  try {
    const { originalUrl } = req.body;

    // Validate input
    if (!originalUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Check if URL already exists
    const existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) {
      const baseUrl = process.env.DOMAIN || 'http://localhost:5000';
      return res.json({
        originalUrl: existingUrl.originalUrl,
        shortUrl: `${baseUrl}/${existingUrl.shortCode}`,
        shortCode: existingUrl.shortCode,
        clicks: existingUrl.clicks,
        createdAt: existingUrl.createdAt
      });
    }

    // Generate unique short code
    let shortCode = shortid.generate();
    
    // Ensure uniqueness (very unlikely but good practice)
    while (await Url.findOne({ shortCode })) {
      shortCode = shortid.generate();
    }

    // Create new URL document with short domain
    const baseUrl = process.env.DOMAIN || 'http://localhost:5000';
    const url = new Url({
      originalUrl,
      shortCode,
      shortUrl: `${baseUrl}/${shortCode}`
    });

    await url.save();

    res.status(201).json({
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt
    });

  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/urls - Get all URLs (for analytics)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const urls = await Url.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Url.countDocuments();

    res.json({
      urls,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUrls: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/urls/:shortCode - Get URL details
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    const baseUrl = process.env.DOMAIN || 'http://localhost:5000';
    res.json({
      originalUrl: url.originalUrl,
      shortUrl: `${baseUrl}/${url.shortCode}`,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt
    });

  } catch (error) {
    console.error('Error fetching URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/urls/:shortCode/stats - Get URL statistics
router.get('/:shortCode/stats', async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.json({
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
      lastAccessed: url.lastAccessed
    });

  } catch (error) {
    console.error('Error fetching URL stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/urls/:shortCode - Delete a URL
router.delete('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    await Url.findByIdAndDelete(url._id);

    res.json({ 
      message: 'URL deleted successfully',
      shortCode: shortCode 
    });

  } catch (error) {
    console.error('Error deleting URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
