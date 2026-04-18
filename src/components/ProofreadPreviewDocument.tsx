import React from 'react';
import { DOCUMENT_FORMAT_RULES } from '../config/documentFormatRules';

export default function ProofreadPreviewDocument({ diffText }) {
  const { margin, font } = DOCUMENT_FORMAT_RULES;

  // Simple parser to convert <red> tags to spans
  const renderContent = () => {
    if (!diffText) return null;
    
    // Safety check and simple replacement
    const html = diffText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/&lt;red&gt;/g, '<span style="color: red; font-weight: bold; text-decoration: underline;">')
      .replace(/&lt;\/red&gt;/g, '</span>');

    return <div dangerouslySetInnerHTML={{ __html: html.replace(/\n/g, '<br/>') }} />;
  };

  return (
    <div className="editor-page-surface">
      <div 
        className="a4-editor-content"
        style={{
          paddingTop: `${margin.top}mm`,
          paddingBottom: `${margin.bottom}mm`,
          paddingLeft: `${margin.left}mm`,
          paddingRight: `${margin.right}mm`,
          fontFamily: `"${font.name}", serif`,
          fontSize: `${font.noiDung}pt`,
          lineHeight: DOCUMENT_FORMAT_RULES.lineSpacing,
          textAlign: 'justify'
        }}
      >
        {renderContent()}
      </div>
      
      <style jsx>{`
        .editor-page-surface {
          width: 210mm;
          min-height: 297mm;
          background-color: white;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          position: relative;
          background-image: linear-gradient(
            to bottom, 
            transparent 296.5mm, 
            #e2e8f0 296.5mm, 
            #e2e8f0 297.5mm, 
            transparent 297.5mm
          );
          background-size: 100% 297mm;
        }
        .a4-editor-content {
          min-height: 297mm;
          width: 100%;
          color: #1a1a1a;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
}
