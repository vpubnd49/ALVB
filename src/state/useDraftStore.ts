import { useState, useEffect } from 'react';

export function useDraftStore() {
  const [draft, setDraft] = useState(() => {
    const saved = localStorage.getItem('ALVB_CURRENT_DRAFT');
    return saved ? JSON.parse(saved) : {
      documentType: 'thong_bao',
      metadata: {},
      content: '',
      aiOutput: '',
      editedContent: '',
    };
  });

  useEffect(() => {
    localStorage.setItem('ALVB_CURRENT_DRAFT', JSON.stringify(draft));
  }, [draft]);

  const updateMetadata = (key, value) => {
    setDraft(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [key]: value }
    }));
  };

  const setDocumentType = (type) => {
    setDraft(prev => ({ ...prev, documentType: type }));
  };

  return {
    draft,
    setDraft,
    updateMetadata,
    setDocumentType
  };
}
