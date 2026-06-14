const express = require('express');
const Url = require('../models/Url');
const router = express.Router();

// GET /:shortCode - Redirect to original URL
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find the URL by short code
    const url = await Url.findOne({ shortCode });
    
    if (!url) {
      return res.status(404).json({ 
        error: 'Short URL not found',
        message: 'The requested short URL does not exist or has expired.'
      });
    }

    // Check if URL has expired (if expiration is set)
    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(410).json({ 
        error: 'URL expired',
        message: 'This short URL has expired and is no longer available.'
      });
    }

    // Increment click counter
    await Url.findByIdAndUpdate(url._id, { 
      $inc: { clicks: 1 },
      $set: { lastAccessed: new Date() }
    });

    // Redirect to original URL
    res.redirect(301, url.originalUrl);

  } catch (error) {
    console.error('Error redirecting URL:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'An error occurred while processing your request.'
    });
  }
});

module.exports = router;
