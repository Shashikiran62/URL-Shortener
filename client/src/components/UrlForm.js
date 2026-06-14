import React, { useState } from 'react';
import { Link, Copy } from 'lucide-react';
import { urlService } from '../services/api';
import Toast from './Toast';

const UrlForm = ({ onUrlCreated }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await urlService.createShortUrl(url);
      setResult(response);
      onUrlCreated?.(response);
    } catch (err) {
      setError(err.error || 'Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      showToast('URL copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      showToast('Failed to copy URL', 'error');
    }
  };

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setError('');
    setCopied(false);
  };

  const showToast = (message, type = 'success') => {
    setToast({ isOpen: true, message, type });
  };

  const closeToast = () => {
    setToast({ isOpen: false, message: '', type: 'success' });
  };

  return (
    <div className="card fade-in">
      <h2 className="text-center mb-4">🔗 URL Shortener</h2>
      <p className="text-center mb-4" style={{ color: '#495057', fontWeight: '500' }}>
        Transform your long URLs into short, shareable links
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="url"
            className="input"
            placeholder="Enter your long URL here (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            style={{ fontSize: '16px', padding: '16px' }}
          />
        </div>

        {error && (
          <div style={{ 
            color: '#721c24', 
            marginBottom: '16px', 
            padding: '12px',
            background: '#f8d7da',
            border: '2px solid #f5c6cb',
            borderRadius: '8px',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        <div className="text-center">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !url.trim()}
            style={{ padding: '16px 32px', fontSize: '18px' }}
          >
            {loading ? (
              <>
                <span className="loading"></span>
                Shortening...
              </>
            ) : (
              <>
                <Link size={20} />
                Shorten URL
              </>
            )}
          </button>
        </div>
      </form>

      {result && (
        <div className="url-result fade-in">
          <h3>✅ Your Short URL is Ready!</h3>
          <p>Original URL: <strong>{result.originalUrl}</strong></p>
          
          <div className="short-url">
            {result.shortUrl}
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              onClick={handleCopy}
              className={`copy-btn ${copied ? 'copied' : ''}`}
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            
            <a 
              href={result.shortUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              Test Link
            </a>
          </div>

          <div className="stats" style={{ marginTop: '20px' }}>
            <div className="stat-card">
              <h3>0</h3>
              <p>Clicks</p>
            </div>
            <div className="stat-card">
              <h3>{new Date(result.createdAt).toLocaleDateString()}</h3>
              <p>Created</p>
            </div>
          </div>

          <div className="text-center mt-4">
            <button onClick={handleReset} className="btn btn-secondary">
              Shorten Another URL
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.isOpen && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default UrlForm;
