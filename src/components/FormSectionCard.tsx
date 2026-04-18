import React from 'react';
import { DOCUMENT_TYPES } from '../config/documentTypeRegistry';
import { FIELD_DEFINITIONS } from '../config/fieldDefinitions';

export default function FormSectionCard({ documentType, metadata, onUpdate }) {
  const typeConfig = DOCUMENT_TYPES.find(t => t.id === documentType);
  if (!typeConfig) return null;

  return (
    <div className="card">
      <h2>Thông tin chi tiết</h2>
      <div className="form-sections">
        {typeConfig.fields.map(fieldKey => {
          const field = FIELD_DEFINITIONS[fieldKey];
          if (!field) return null;

          return (
            <div key={fieldKey} className="form-group">
              <label className="form-label">
                {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  className="form-input"
                  rows={fieldKey === 'recipient_list' ? 4 : 3}
                  value={metadata[fieldKey] || ''}
                  onChange={(e) => onUpdate(fieldKey, e.target.value)}
                  placeholder={field.placeholder}
                />
              ) : (
                <input
                  type={field.type}
                  className="form-input"
                  value={metadata[fieldKey] || ''}
                  onChange={(e) => onUpdate(fieldKey, e.target.value)}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
