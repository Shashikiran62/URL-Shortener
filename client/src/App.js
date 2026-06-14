import React, { useState, useEffect } from 'react';
import { Zap, Github, Twitter } from 'lucide-react';
import UrlForm from './components/UrlForm';
import UrlList from './components/UrlList';
import { urlService } from './services/api';

function App() {
  const [recentUrl, setRecentUrl] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    // Check server health on app load
    const checkServerHealth = async () => {
      try {
        await urlService.healthCheck();
        setServerStatus('online');
      } catch (error) {
        setServerStatus('offline');
        console.error('Server health check failed:', error);
      }
    };

    checkServerHealth();
  }, []);

  const handleUrlCreated = (newUrl) => {
    setRecentUrl(newUrl);
    // You could trigger a refresh of the URL list here if needed
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px 0' }}>
      <div className="container">
        {/* Header */}
        <header className="text-center mb-4">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '12px',
            marginBottom: '16px'
          }}>
            <Zap size={32} style={{ color: '#ffffff', filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' }} />
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 50%, #e6f3ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))'
            }}>
              URL Shortener
            </h1>
          </div>
          
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: '24px',
            maxWidth: '600px',
            margin: '0 auto 24px',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
          }}>
            Transform your long URLs into short, shareable links instantly. 
            Fast, secure, and completely free.
          </p>

          {/* Server Status Indicator */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '8px 16px',
            background: serverStatus === 'online' ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)',
            border: `2px solid ${serverStatus === 'online' ? '#28a745' : '#dc3545'}`,
            borderRadius: '20px',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: serverStatus === 'online' ? '#28a745' : '#dc3545',
              animation: serverStatus === 'online' ? 'pulse 2s infinite' : 'none'
            }}></div>
            <span style={{ 
              fontSize: '14px',
              fontWeight: '600',
              color: serverStatus === 'online' ? '#90f58b' : '#dc3545'
            }}>
              Server {serverStatus === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {/* URL Form */}
          <UrlForm onUrlCreated={handleUrlCreated} />

          {/* Recent URLs */}
          <UrlList />
        </main>

        {/* Footer */}
        <footer className="text-center mt-8" style={{ 
          padding: '40px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: '60px',
         
        }}>
          {/* <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '24px',
            marginBottom: '16px'
          }}>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
            >
              <Github size={20} />
              GitHub
            </a>
            
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
            >
              <Twitter size={20} />
              Twitter
            </a>
          </div> */}
          
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
          }}>
            Built with React, Express, MongoDB & ❤️
          </p>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
          }}>
             -Shashikiran
          </p>
        </footer>
      </div>

      {/* Add pulse animation for server status */}
      <style>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
