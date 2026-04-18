import React, { useCallback } from 'react';
import { Upload, File, X } from 'lucide-react';

export default function UploadDropzone({ files, onUpload, onRemove }) {
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    onUpload(newFiles);
  };

  return (
    <div className="upload-container">
      <label className="dropzone">
        <Upload size={32} />
        <p>Kéo thả hoặc click để tải lên hồ sơ (.docx, .pdf)</p>
        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Hỗ trợ nhiều file cùng lúc</span>
        <input type="file" multiple accept=".docx,.pdf" onChange={handleFileChange} hidden />
      </label>

      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <File size={16} />
              <span className="file-name">{file.name}</span>
              <button className="remove-btn" onClick={() => onRemove(index)}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .upload-container { display: flex; flex-direction: column; gap: 1rem; }
        .dropzone {
          border: 2px dashed #e2e8f0;
          border-radius: 0.75rem;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.2s;
          color: #64748b;
        }
        .dropzone:hover { border-color: #3b82f6; background: #eff6ff; color: #3b82f6; }
        .file-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .file-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          background: #f1f5f9;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }
        .file-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .remove-btn { border: none; background: transparent; cursor: pointer; color: #94a3b8; }
        .remove-btn:hover { color: #ef4444; }
      `}</style>
    </div>
  );
}
