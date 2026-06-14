import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  const getClassName = () => {
    switch (type) {
      case 'success':
        return 'toast';
      case 'error':
        return 'toast error';
      case 'warning':
        return 'toast warning';
      case 'info':
        return 'toast info';
      default:
        return 'toast';
    }
  };

  return (
    <div className={getClassName()}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {getIcon()}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
