import React from 'react';
import { DOCUMENT_FORMAT_RULES } from '../config/documentFormatRules';

export default function MultiPagePreviewContainer({ children }) {
  return (
    <div className="multi-page-container">
      <div className="pages-wrapper">
        {/* We wrap the content in a way that it can flow across visual page representations if possible, 
            or we just use the children which is the EditablePreviewDocument */}
        {children}
      </div>

      <style jsx>{`
        .multi-page-container {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 2rem 0;
          background: #cbd5e1; /* Darker gray to highlight white pages */
          min-height: 100%;
        }
        .pages-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
