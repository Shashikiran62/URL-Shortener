import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel", type = "danger" }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: type === 'danger' ? '#fee' : '#fff3cd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <AlertTriangle 
              size={30} 
              color={type === 'danger' ? '#dc3545' : '#856404'} 
            />
          </div>
        </div>
        
        <h3 style={{ 
          marginBottom: '12px', 
          color: '#2c3e50',
          fontSize: '20px',
          fontWeight: '600'
        }}>
          {title}
        </h3>
        
        <p style={{ 
          color: '#495057', 
          marginBottom: '24px',
          lineHeight: '1.5',
          fontWeight: '500'
        }}>
          {message}
        </p>
        
        <div className="modal-actions">
          <button 
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '10px 20px' }}
          >
            {cancelText}
          </button>
          
          <button 
            onClick={onConfirm}
            className={`btn btn-${type}`}
            style={{ padding: '10px 20px' }}
          >
            {confirmText}
          </button>
        </div>
        
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} color="#6c757d" />
        </button>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
