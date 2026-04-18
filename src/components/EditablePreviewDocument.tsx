import React, { useRef, useEffect } from 'react';
import { DOCUMENT_FORMAT_RULES } from '../config/documentFormatRules';
import { useSelection } from '../state/useSelectionContext';

export default function EditablePreviewDocument({ content, onChange }) {
  const editorRef = useRef(null);
  const { saveSelection } = useSelection();

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content || '';
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleBlur = () => {
    saveSelection();
  };

  const { margin, font } = DOCUMENT_FORMAT_RULES;

  return (
    <div className="editor-page-surface">
      <div 
        ref={editorRef}
        className="a4-editor-content"
        contentEditable
        onInput={handleInput}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onBlur={handleBlur}
        spellCheck={false}
        style={{
          paddingTop: `${margin.top}mm`,
          paddingBottom: `${margin.bottom}mm`,
          paddingLeft: `${margin.left}mm`,
          paddingRight: `${margin.right}mm`,
          fontFamily: `"${font.name}", serif`,
          fontSize: `${font.noiDung}pt`,
          lineHeight: DOCUMENT_FORMAT_RULES.lineSpacing,
          direction: 'ltr'
        }}
      />
      
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
          outline: none;
          min-height: 297mm;
          width: 100%;
          text-align: justify;
          white-space: pre-wrap;
          word-wrap: break-word;
          color: #1a1a1a;
        }
      `}</style>
    </div>
  );
}
