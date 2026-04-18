import React, { useState } from 'react';
import { ShieldCheck, Loader2, ExternalLink } from 'lucide-react';

export default function ApiKeyModal({ onSave, onClose, initialKey }) {
  const [key, setKey] = useState(initialKey || '');
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState(null); // 'valid', 'invalid', 'error'

  const handleTest = async () => {
    if (!key) return;
    setTesting(true);
    setStatus(null);
    
    try {
      // Simple test call to Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'hi' }] }] })
      });
      
      if (response.ok) {
        setStatus('valid');
      } else {
        setStatus('invalid');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Cấu hình Gemini API Key</h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
          Key được lưu cục bộ trên trình duyệt của bạn và không bao giờ được gửi đi nơi khác.
        </p>
        
        <div className="form-group">
          <label className="form-label">API Key</label>
          <input 
            type="password" 
            className="form-input" 
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Dán Gemini API Key vào đây..."
          />
        </div>
        
        <div className="modal-info">
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="link-text">
            Lấy API Key miễn phí tại đây <ExternalLink size={14} />
          </a>
        </div>

        {status === 'valid' && (
          <div className="alert alert-success">
            <ShieldCheck size={18} /> API Key hợp lệ!
          </div>
        )}
        
        {status === 'invalid' && (
          <div className="alert alert-danger">
            API Key không hợp lệ hoặc hết hạn.
          </div>
        )}

        {status === 'error' && (
          <div className="alert alert-danger">
            Lỗi kết nối. Vui lòng kiểm tra mạng.
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button 
            className="btn btn-outline" 
            style={{ flex: 1 }}
            onClick={handleTest}
            disabled={testing || !key}
          >
            {testing ? <Loader2 className="animate-spin" /> : 'Kiểm tra'}
          </button>
          
          <button 
            className="btn btn-primary" 
            style={{ flex: 2 }}
            onClick={() => onSave(key)}
            disabled={!key}
          >
            Lưu và Tiếp tục
          </button>
        </div>
        
        <button 
          className="btn" 
          style={{ width: '100%', marginTop: '0.5rem', background: 'transparent', color: '#64748b' }}
          onClick={onClose}
        >
          Đóng
        </button>
      </div>

      <style jsx>{`
        .link-text {
          font-size: 0.75rem;
          color: #3b82f6;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .alert {
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .alert-success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
        .alert-danger { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
