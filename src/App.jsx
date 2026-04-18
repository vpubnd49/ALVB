import { useState, useEffect } from 'react'
import AppHeader from './components/AppHeader'
import StepperWizard from './components/StepperWizard'
import ApiKeyModal from './components/ApiKeyModal'
import FormSectionCard from './components/FormSectionCard'
import StyleLibrary from './components/StyleLibrary'
import UploadDropzone from './components/UploadDropzone'
import EditablePreviewDocument from './components/EditablePreviewDocument'
import ProofreadPreviewDocument from './components/ProofreadPreviewDocument'
import A4EditorToolbar from './components/A4EditorToolbar'
import MultiPagePreviewContainer from './components/MultiPagePreviewContainer'
import { useDraftStore } from './state/useDraftStore'
import { DOCUMENT_TYPES } from './config/documentTypeRegistry'
import { buildUserPrompt, SYSTEM_PROMPT, DEVELOPER_GUARDRAILS } from './engine/buildPrompt'
import { buildProofreadPrompt, PROOFREAD_SYSTEM_PROMPT } from './engine/proofread'
import { parseDocument, buildFromFilesPrompt } from './engine/documentParser'
import { buildClassifierPrompt, CLASSIFIER_SYSTEM_PROMPT } from './engine/classifier'
import { sanitizeAiOutput } from './engine/sanitizeAiOutput'
import { exportToDocx } from './engine/docxExport'
import { Wand2, Search, FileUp, Sparkles, Loader2 } from 'lucide-react'

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('GEMINI_API_KEY') || '')
  const [showApiKeyModal, setShowApiKeyModal] = useState(!apiKey)
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isClassifying, setIsClassifying] = useState(false)
  const [userRequest, setUserRequest] = useState('')
  const [method, setMethod] = useState('new') // 'new', 'proofread', 'from_file'
  const [originalText, setOriginalText] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [proofreadResult, setProofreadResult] = useState(null)
  const [suggestion, setSuggestion] = useState(null)
  const [viewMode, setViewMode] = useState('edited') // 'edited', 'diff', 'original'
  const [learnedStyle, setLearnedStyle] = useState(localStorage.getItem('ALVB_LEARNED_STYLE') || '')
  
  const { draft, setDraft, updateMetadata, setDocumentType } = useDraftStore()

  const handleApiKeySubmit = (key) => {
    localStorage.setItem('GEMINI_API_KEY', key)
    setApiKey(key)
    setShowApiKeyModal(false)
  }

  const handleStyleLearned = (style) => {
    setLearnedStyle(style);
    localStorage.setItem('ALVB_LEARNED_STYLE', style);
  }

  const handleClassify = async () => {
    if (!apiKey || uploadedFiles.length === 0) return;
    setIsClassifying(true);
    try {
      let combinedText = '';
      for (const file of uploadedFiles) {
        const text = await parseDocument(file);
        combinedText += text + '\n';
      }
      const fullPrompt = `${CLASSIFIER_SYSTEM_PROMPT}\n\n${buildClassifierPrompt(combinedText)}`;
      const res = await callGemini(fullPrompt);
      const jsonStr = res.match(/\{[\s\S]*\}/)[0];
      const result = JSON.parse(jsonStr);
      setSuggestion(result);
      if (result.suggestedTypeId) {
        setDocumentType(result.suggestedTypeId);
        if (result.extractedMetadata) {
          Object.entries(result.extractedMetadata).forEach(([k, v]) => updateMetadata(k, v));
        }
      }
    } catch (err) {
      console.error('Classification error:', err);
    } finally {
      setIsClassifying(false);
    }
  }

  const handleAction = async () => {
    if (!apiKey) {
      setShowApiKeyModal(true)
      return
    }
    
    setIsGenerating(true)
    try {
      let finalPrompt = '';
      const styleContext = learnedStyle ? `\nPHONG CÁCH ĐÃ HỌC TỪ THƯ MỤC CỦA NGƯỜI DÙNG:\n${learnedStyle}\n` : '';

      if (method === 'new') {
        const userPrompt = buildUserPrompt({ ...draft, userRequest })
        finalPrompt = `${SYSTEM_PROMPT}\n${styleContext}\n${DEVELOPER_GUARDRAILS}\n\n${userPrompt}`
      } else if (method === 'proofread') {
        finalPrompt = `${PROOFREAD_SYSTEM_PROMPT}\n${styleContext}\n${buildProofreadPrompt(originalText)}`
      } else if (method === 'from_file') {
        let combinedText = '';
        for (const file of uploadedFiles) {
          const text = await parseDocument(file);
          combinedText += `--- FILE: ${file.name} ---\n${text}\n\n`;
        }
        const userPrompt = buildFromFilesPrompt(combinedText, userRequest)
        finalPrompt = `${SYSTEM_PROMPT}\n${styleContext}\n${DEVELOPER_GUARDRAILS}\n\n${userPrompt}`
      }

      const res = await callGemini(finalPrompt)
      
      if (method === 'proofread') {
        try {
          const jsonStr = res.match(/\{[\s\S]*\}/)[0]
          const result = JSON.parse(jsonStr)
          setProofreadResult(result)
          setDraft(prev => ({ ...prev, aiOutput: result.revisedText, editedContent: result.revisedText }))
        } catch (e) {
          const sanitized = sanitizeAiOutput(res)
          setDraft(prev => ({ ...prev, aiOutput: sanitized, editedContent: sanitized }))
        }
      } else {
        const sanitized = sanitizeAiOutput(res)
        setDraft(prev => ({ ...prev, aiOutput: sanitized, editedContent: sanitized }))
      }
      
      setCurrentStep(3)
    } catch (err) {
      alert('Lỗi: ' + err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const callGemini = async (prompt) => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json()
    if (!data.candidates) throw new Error(data.error?.message || 'Lỗi API')
    return data.candidates[0].content.parts[0].text
  }

  const handleExport = () => {
    if (viewMode === 'diff' && proofreadResult?.diffText) {
      exportToDocx(draft, true, proofreadResult.diffText);
    } else {
      exportToDocx(draft);
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="panel-left">
            <div className="card">
              <h2>Phương thức làm việc</h2>
              <div className="method-selector">
                <button className={`method-btn ${method === 'new' ? 'active' : ''}`} onClick={() => setMethod('new')}>
                  <Wand2 size={20} /> <span>Tạo mới</span>
                </button>
                <button className={`method-btn ${method === 'from_file' ? 'active' : ''}`} onClick={() => setMethod('from_file')}>
                  <FileUp size={20} /> <span>Hồ sơ</span>
                </button>
                <button className={`method-btn ${method === 'proofread' ? 'active' : ''}`} onClick={() => setMethod('proofread')}>
                  <Search size={20} /> <span>Hiệu đính</span>
                </button>
              </div>
            </div>

            <StyleLibrary onStyleLearned={handleStyleLearned} />

            {method === 'new' && (
              <>
                <div className="card">
                  <h2>Loại văn bản</h2>
                  <select className="form-input" value={draft.documentType} onChange={(e) => setDocumentType(e.target.value)}>
                    {DOCUMENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <FormSectionCard documentType={draft.documentType} metadata={draft.metadata} onUpdate={updateMetadata} />
              </>
            )}
            {method === 'from_file' && (
              <div className="card">
                <h2>Tải hồ sơ tham khảo</h2>
                <UploadDropzone 
                  files={uploadedFiles} 
                  onUpload={(newFiles) => setUploadedFiles([...uploadedFiles, ...newFiles])}
                  onRemove={(idx) => setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx))}
                />
                {uploadedFiles.length > 0 && (
                  <button 
                    className="btn btn-outline" 
                    style={{ width: '100%', marginTop: '1rem', borderStyle: 'dashed', borderColor: '#3b82f6', color: '#3b82f6' }}
                    onClick={handleClassify}
                    disabled={isClassifying}
                  >
                    {isClassifying ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />} 
                    <span style={{ marginLeft: '0.5rem' }}>Phân tích hồ sơ & Gợi ý</span>
                  </button>
                )}
              </div>
            )}
            {method === 'proofread' && (
              <div className="card">
                <h2>Nội dung cần hiệu đính</h2>
                <textarea className="form-input" rows={12} value={originalText} onChange={(e) => setOriginalText(e.target.value)} placeholder="Dán nội dung văn bản cần kiểm tra lỗi vào đây..."></textarea>
              </div>
            )}
            <div className="wizard-actions">
              <button className="btn btn-primary" onClick={() => (method === 'from_file' && !suggestion && uploadedFiles.length > 0) ? handleClassify().then(() => setCurrentStep(2)) : setCurrentStep(2)}>
                Tiếp theo
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="panel-left">
            {suggestion && method === 'from_file' && (
              <div className="card suggestion-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#1e3a8a' }}>
                   <Sparkles size={18} /> <strong>Gợi ý từ AI</strong>
                </div>
                <p style={{ fontSize: '0.875rem' }}>AI đề xuất soạn: <strong>{DOCUMENT_TYPES.find(t => t.id === suggestion.suggestedTypeId)?.label}</strong></p>
                <p style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>{suggestion.reason}</p>
              </div>
            )}
            <div className="card">
              <h2>{method === 'from_file' ? 'Yêu cầu soạn thảo' : 'Ghi chú bổ sung'}</h2>
              <textarea className="form-input" rows={5} value={userRequest} onChange={(e) => setUserRequest(e.target.value)} placeholder={method === 'from_file' ? "Bạn muốn AI soạn văn bản gì từ hồ sơ này?" : "Nhập thêm yêu cầu (VD: Viết ngắn gọn hơn...)"}></textarea>
              <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={handleAction} disabled={isGenerating}>
                {isGenerating ? 'Đang xử lý...' : 'Thực thi'}
              </button>
            </div>
            <div className="wizard-actions flex-between">
              <button className="btn btn-outline dark" onClick={() => setCurrentStep(1)}>Quay lại</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="panel-left">
             <div className="card">
              <h2>Kết quả & Tinh chỉnh</h2>
              {method === 'proofread' && (
                <div className="view-mode-selector">
                  <button className={viewMode === 'edited' ? 'active' : ''} onClick={() => setViewMode('edited')}>Bản sửa</button>
                  <button className={viewMode === 'diff' ? 'active' : ''} onClick={() => setViewMode('diff')}>Bôi đỏ</button>
                  <button className={viewMode === 'original' ? 'active' : ''} onClick={() => setViewMode('original')}>Bản gốc</button>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button className="btn btn-outline" onClick={() => setViewMode('edited')}>Tiếp tục sửa</button>
                <button className="btn btn-primary" onClick={handleExport}>Xuất Word</button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  const renderPreview = () => {
    if (viewMode === 'diff' && proofreadResult?.diffText) {
      return <ProofreadPreviewDocument diffText={proofreadResult.diffText} />;
    }
    if (viewMode === 'original') {
      return <EditablePreviewDocument content={originalText} onChange={() => {}} />;
    }
    return (
      <EditablePreviewDocument 
        content={draft.editedContent || draft.aiOutput} 
        onChange={(val) => setDraft(prev => ({ ...prev, editedContent: val }))}
      />
    );
  }

  return (
    <div className="app-container">
      <AppHeader onConfigKey={() => setShowApiKeyModal(true)} hasKey={!!apiKey} />
      <main className="main-content">
        <StepperWizard currentStep={currentStep} onStepChange={setCurrentStep} />
        <div className="workspace">
          {renderStep()}
          <div className="panel-right">
            <div className="preview-layout">
              <A4EditorToolbar onSave={() => alert('Đã lưu!')} onExport={handleExport} />
              <div className="preview-scroll-area">
                <MultiPagePreviewContainer>
                  {renderPreview()}
                </MultiPagePreviewContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showApiKeyModal && <ApiKeyModal onSave={handleApiKeySubmit} onClose={() => setShowApiKeyModal(false)} initialKey={apiKey} />}
      <style jsx>{`
        .method-selector { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
        .method-btn { padding: 1rem 0.75rem; border-radius: var(--radius-lg); border: 2px solid var(--border-subtle); background: white; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); font-size: 0.8125rem; font-weight: 600; color: var(--text-muted); }
        .method-btn:hover { border-color: var(--secondary-color); transform: translateY(-2px); box-shadow: var(--shadow-premium); }
        .method-btn.active { border-color: var(--primary-color); background: var(--primary-glow); color: var(--primary-color); box-shadow: 0 10px 15px -3px var(--primary-glow); }
        .suggestion-card { background: #f0f9ff; border: 1px solid #bae6fd; margin-bottom: 1.5rem; padding: 1.25rem; border-radius: var(--radius-md); }
        .view-mode-selector { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; background: #f1f5f9; padding: 0.375rem; border-radius: var(--radius-md); }
        .view-mode-selector button { flex: 1; padding: 0.625rem; border: none; background: transparent; font-size: 0.875rem; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s; font-weight: 500; }
        .view-mode-selector button.active { background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); color: var(--primary-color); font-weight: 700; }
        .preview-layout { display: flex; flex-direction: column; width: 100%; height: 100%; background: #cbd5e1; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-premium); border: 1px solid var(--border-subtle); }
        .preview-scroll-area { flex: 1; overflow-y: auto; padding: 2rem 0; background: #e2e8f0; }
        .animate-spin { animation: spin 1s linear infinite; }
        .wizard-actions { margin-top: auto; padding: 2rem 0; }
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        .btn-outline.dark { border-color: var(--border-subtle); color: var(--text-main); background: white; }
        .btn-outline.dark:hover { background: #f8fafc; border-color: var(--text-muted); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default App
