import React, { useState } from 'react';
import { FolderOpen, BookOpen, CheckCircle2, Loader2 } from 'lucide-react';
import { parseDocument } from '../engine/documentParser';

export default function StyleLibrary({ onStyleLearned }) {
  const [isScanning, setIsScanning] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);
  const [directoryName, setDirectoryName] = useState(localStorage.getItem('ALVB_STYLE_DIR') || '');

  const handleConnectDirectory = async () => {
    try {
      // @ts-ignore - File System Access API
      const dirHandle = await window.showDirectoryPicker();
      setDirectoryName(dirHandle.name);
      localStorage.setItem('ALVB_STYLE_DIR', dirHandle.name);
      
      setIsScanning(true);
      let docxFiles = [];
      
      // Recursive scan
      async function scan(handle) {
        for await (const entry of handle.values()) {
          if (entry.kind === 'file' && entry.name.endsWith('.docx')) {
            docxFiles.push(await entry.getFile());
          } else if (entry.kind === 'directory') {
            await scan(entry);
          }
        }
      }
      
      await scan(dirHandle);
      
      // Learn from top 3 files (to avoid token limit)
      let combinedPatterns = "";
      for (const file of docxFiles.slice(0, 3)) {
        const text = await parseDocument(file);
        combinedPatterns += text.substring(0, 2000) + "\n\n";
      }
      
      setLearnedCount(docxFiles.length);
      onStyleLearned(combinedPatterns);
      setIsScanning(false);
      
    } catch (err) {
      if (err.name !== 'AbortError') {
        alert('Lỗi truy cập thư mục: ' + err.message);
      }
      setIsScanning(false);
    }
  };

  return (
    <div className="card style-library-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <BookOpen size={20} color="#1e3a8a" />
        <h2 style={{ margin: 0, border: 'none', padding: 0 }}>Thư viện phong cách</h2>
      </div>
      
      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
        Kết nối với thư mục làm việc của bạn để AI học hỏi cấu trúc và văn phong thực tế bạn thường dùng.
      </p>

      {directoryName ? (
        <div className="status-box">
          <CheckCircle2 size={16} color="#10b981" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Đã kết nối: {directoryName}</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Tìm thấy {learnedCount} tệp mẫu cấu trúc.</p>
          </div>
          <button className="btn-text" onClick={handleConnectDirectory}>Đổi</button>
        </div>
      ) : (
        <button className="btn btn-outline" style={{ width: '100%' }} onClick={handleConnectDirectory} disabled={isScanning}>
          {isScanning ? <Loader2 className="animate-spin" size={16} /> : <FolderOpen size={16} />}
          <span style={{ marginLeft: '0.5rem' }}>Chọn thư mục làm việc</span>
        </button>
      )}

      <style jsx>{`
        .style-library-card { background: #f8fafc; border: 1px solid #e2e8f0; }
        .status-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 0.5rem;
        }
        .btn-text {
          background: transparent;
          border: none;
          color: #3b82f6;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
