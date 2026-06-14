import React, { useState, useEffect } from 'react';
import { ExternalLink, Copy, BarChart3, Calendar, MousePointer, Trash2, Eye } from 'lucide-react';
import { urlService } from '../services/api';
import ConfirmationDialog from './ConfirmationDialog';
import Toast from './Toast';

const UrlList = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, url: null });
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const fetchUrls = async (page = 1) => {
    try {
      setLoading(true);
      const response = await urlService.getAllUrls(page, 5);
      setUrls(response.urls);
      setPagination(response.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError(err.error || 'Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleCopy = async (url, index) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePageChange = (newPage) => {
    fetchUrls(newPage);
  };

  const handleDeleteClick = (url) => {
    setDeleteDialog({ isOpen: true, url });
  };

  const handleDeleteConfirm = async () => {
    try {
      await urlService.deleteUrl(deleteDialog.url.shortCode);
      setUrls(urls.filter(url => url.shortCode !== deleteDialog.url.shortCode));
      setDeleteDialog({ isOpen: false, url: null });
      showToast('URL deleted successfully!', 'success');
    } catch (err) {
      showToast(err.error || 'Failed to delete URL', 'error');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, url: null });
  };

  const showToast = (message, type = 'success') => {
    setToast({ isOpen: true, message, type });
  };

  const closeToast = () => {
    setToast({ isOpen: false, message: '', type: 'success' });
  };

  if (loading && urls.length === 0) {
    return (
      <div className="card text-center">
        <div className="loading" style={{ margin: '20px auto' }}></div>
        <p>Loading recent URLs...</p>
      </div>
    );
  }

  if (error && urls.length === 0) {
    return (
      <div className="card text-center">
        <p style={{ color: '#dc3545' }}>Error: {error}</p>
        <button onClick={() => fetchUrls()} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="card fade-in">
      <h3 className="text-center mb-4">
        <BarChart3 size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
        Recent URLs
      </h3>

      {urls.length === 0 ? (
        <div className="text-center" style={{ padding: '40px 20px' }}>
          <p style={{ color: '#495057', fontSize: '18px', fontWeight: '500' }}>
            No URLs have been shortened yet. Be the first to create one!
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gap: '16px' }}>
            {urls.map((url, index) => (
              <div key={url.shortCode} className="url-card">
                <div className="url-card-header">
                  <div className="url-card-content">
                    <h4 style={{ 
                      color: '#667eea', 
                      marginBottom: '12px',
                      wordBreak: 'break-all',
                      fontSize: '16px',
                      fontWeight: '600',
                      lineHeight: '1.4'
                    }}>
                      {url.originalUrl}
                    </h4>
                    
                    <div style={{ 
                      fontFamily: 'Courier New, monospace',
                      background: 'white',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '2px solid #e9ecef',
                      marginBottom: '16px',
                      fontSize: '14px',
                      color: '#495057',
                      fontWeight: '500'
                    }}>
                      {url.shortUrl}
                    </div>
                  </div>
                  
                  <div className="url-card-actions">
                    <button
                      onClick={() => handleCopy(url.shortUrl, index)}
                      className={`copy-btn ${copiedIndex === index ? 'copied' : ''}`}
                      title="Copy URL"
                    >
                      <Copy size={16} />
                    </button>
                    
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ padding: '8px 12px', fontSize: '14px' }}
                      title="Open URL"
                    >
                      <ExternalLink size={16} />
                    </a>
                    
                    <button
                      onClick={() => handleDeleteClick(url)}
                      className="btn btn-danger"
                      title="Delete URL"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="url-stats">
                  <div className="stat-item">
                    <div className="stat-value">{url.clicks}</div>
                    <div className="stat-label">Clicks</div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-value">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </div>
                    <div className="stat-label">Created</div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-value">
                      {url.shortCode.length}
                    </div>
                    <div className="stat-label">Code Length</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="text-center mt-4">
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  Previous
                </button>
                
                <span style={{ 
                  padding: '8px 16px', 
                  background: '#f8f9fa', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Page {currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  Next
                </button>
              </div>
              
              <p style={{ 
                fontSize: '12px', 
                color: '#495057', 
                marginTop: '8px',
                fontWeight: '500'
              }}>
                Showing {urls.length} of {pagination.totalUrls} URLs
              </p>
            </div>
          )}
        </>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete URL"
        message={`Are you sure you want to delete this URL? This action cannot be undone.

Short URL: ${deleteDialog.url?.shortUrl}
Original: ${deleteDialog.url?.originalUrl}`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

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

export default UrlList;
