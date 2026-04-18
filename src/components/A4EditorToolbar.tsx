import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, Save, Download, Printer } from 'lucide-react';
import { useSelection } from '../state/useSelectionContext';

export default function A4EditorToolbar({ onSave, onExport }) {
  const { restoreSelection } = useSelection();

  const commands = [
    { id: 'bold', icon: Bold, label: 'Đậm' },
    { id: 'italic', icon: Italic, label: 'Nghiêng' },
    { id: 'underline', icon: Underline, label: 'Gạch chân' },
    { type: 'separator' },
    { id: 'justifyLeft', icon: AlignLeft, label: 'Căn trái' },
    { id: 'justifyCenter', icon: AlignCenter, label: 'Căn giữa' },
    { id: 'justifyRight', icon: AlignRight, label: 'Căn phải' },
    { id: 'justifyFull', icon: AlignJustify, label: 'Căn đều' },
    { type: 'separator' },
    { id: 'insertChapter', label: 'Chương', text: 'Chương ...\n[TÊN CHƯƠNG]' },
    { id: 'insertArticle', label: 'Điều', text: 'Điều ...' },
    { id: 'insertClause', label: 'Khoản', text: '1. ...' },
    { id: 'insertPoint', label: 'Điểm', text: 'a) ...' },
    { id: 'insertRecipient', label: 'Nơi nhận', text: 'Nơi nhận:\n- ...;\n- Lưu: VT, ...' },
    { id: 'insertSigner', label: 'Khối ký', text: 'CHỨC VỤ NGƯỜI KÝ\n(Ký, ghi rõ họ tên)' },
  ];

  const handleCommand = (e, cmdId) => {
    e.preventDefault(); // Ngăn button lấy focus
    restoreSelection(); // Khôi phục vùng chọn
    document.execCommand(cmdId, false, null);
  };

  return (
    <div className="toolbar-container">
      <div className="toolbar-group">
    {commands.map((cmd, i) => (
      cmd.type === 'separator' ? (
        <div key={i} className="toolbar-separator" />
      ) : (
        <button 
          key={cmd.id} 
          className={`toolbar-btn ${!cmd.icon ? 'text-btn' : ''}`} 
          onMouseDown={(e) => {
            e.preventDefault();
            restoreSelection();
            if (cmd.text) {
              document.execCommand('insertHTML', false, cmd.text.replace(/\n/g, '<br/>'));
            } else {
              document.execCommand(cmd.id, false, null);
            }
          }}
          title={cmd.label}
        >
          {cmd.icon ? <cmd.icon size={16} /> : <span>{cmd.label}</span>}
        </button>
      )
    ))}
      </div>
      
      <div className="toolbar-group" style={{ marginLeft: 'auto' }}>
        <button className="toolbar-btn" onClick={onSave} title="Lưu nháp">
          <Save size={16} />
        </button>
        <button className="toolbar-btn" onClick={onExport} title="Xuất Word">
          <Download size={16} />
        </button>
        <button className="toolbar-btn" title="In">
          <Printer size={16} />
        </button>
      </div>

      <style jsx>{`
        .toolbar-container {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .toolbar-group {
          display: flex;
          align-items: center;
          gap: 0.125rem;
        }
        .toolbar-btn {
          height: 2.25rem;
          padding: 0 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.375rem;
          border: 1px solid transparent;
          background: transparent;
          color: #475569;
          cursor: pointer;
          transition: all 0.1s;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .toolbar-btn.text-btn {
          width: auto;
          min-width: 3.5rem;
        }
        .toolbar-btn:hover {
          background: #f1f5f9;
          color: #1e293b;
          border-color: #e2e8f0;
        }
        .toolbar-btn:active {
          background: #e2e8f0;
        }
        .toolbar-separator {
          width: 1px;
          height: 1.25rem;
          background: #e2e8f0;
          margin: 0 0.5rem;
        }
      `}</style>
    </div>
  );
}
