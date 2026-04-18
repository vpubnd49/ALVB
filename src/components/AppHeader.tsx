import React from 'react';
import { Settings, Key, Trash2 } from 'lucide-react';

export default function AppHeader({ onConfigKey, hasKey }) {
  const handleClearKey = () => {
    if (confirm('Bạn có chắc chắn muốn xóa API Key?')) {
      localStorage.removeItem('GEMINI_API_KEY');
      window.location.reload();
    }
  };

  return (
    <header className="app-header">
      <div className="header-title">
        <h1>ALVB <span className="title-accent">AI</span></h1>
        <p>Hệ thống Trợ lý Soạn thảo Văn bản Hành chính</p>
      </div>
      
      <div className="header-actions">
        <div className={`status-badge ${hasKey ? 'status-ok' : 'status-warn'}`}>
          <div className="status-dot"></div>
          <span>{hasKey ? 'Gemini AI Ready' : 'API Key Required'}</span>
        </div>
        
        <div className="action-buttons">
          <button className="btn btn-outline" onClick={onConfigKey} title="Cấu hình API Key">
            <Key size={18} />
          </button>
          
          {hasKey && (
            <button className="btn btn-outline btn-danger" onClick={handleClearKey} title="Xóa API Key">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .app-header {
          background: linear-gradient(to right, #1e3a8a, #3b82f6);
          padding: 1.25rem 2.5rem;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          z-index: 100;
        }
        .header-title h1 {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .title-accent {
          color: #93c5fd;
          font-weight: 900;
        }
        .header-title p {
          font-size: 0.875rem;
          opacity: 0.9;
          font-weight: 500;
          margin-top: 0.25rem;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .action-buttons {
          display: flex;
          gap: 0.75rem;
        }
        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .status-dot {
          width: 0.625rem;
          height: 0.625rem;
          border-radius: 50%;
          position: relative;
        }
        .status-dot::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          border: 2px solid currentColor;
          opacity: 0.4;
          animation: pulse 2s infinite;
        }
        .status-ok { color: #ffffff; }
        .status-ok .status-dot { background: #4ade80; color: #4ade80; }
        .status-warn { color: #ffffff; }
        .status-warn .status-dot { background: #fbbf24; color: #fbbf24; }
        
        .btn-danger:hover {
          background: rgba(244, 63, 94, 0.2) !important;
          border-color: rgba(244, 63, 94, 0.4) !important;
          color: #fca5a5 !important;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1); opacity: 0.4; }
        }
      `}</style>
    </header>
  );
}
