export const FIELD_DEFINITIONS = {
  parent_agency: { key: 'parent_agency', label: 'Cơ quan chủ quản', type: 'text', placeholder: 'VD: UBND TỈNH LÂM ĐỒNG' },
  issuing_agency: { key: 'issuing_agency', label: 'Cơ quan ban hành', type: 'text', required: true, placeholder: 'VD: SỞ TƯ PHÁP' },
  doc_number: { key: 'doc_number', label: 'Số văn bản', type: 'text', placeholder: 'VD: 123' },
  doc_symbol: { key: 'doc_symbol', label: 'Ký hiệu', type: 'text', placeholder: 'VD: STP-XDCT' },
  place: { key: 'place', label: 'Địa danh', type: 'text', required: true, placeholder: 'VD: Đà Lạt' },
  issue_date: { key: 'issue_date', label: 'Ngày ban hành', type: 'date', required: true },
  signer_name: { key: 'signer_name', label: 'Người ký', type: 'text', required: true, placeholder: 'VD: Nguyễn Văn A' },
  signer_title: { key: 'signer_title', label: 'Chức vụ người ký', type: 'text', required: true, placeholder: 'VD: Giám đốc' },
  recipient_list: { key: 'recipient_list', label: 'Nơi nhận', type: 'textarea', placeholder: 'VD: - Như Điều 3;\n- Lưu: VT, XDCT.' },
  
  // Specific fields
  legal_bases: { key: 'legal_bases', label: 'Căn cứ pháp lý', type: 'textarea', placeholder: 'Mỗi căn cứ một dòng...' },
  proposal_from: { key: 'proposal_from', label: 'Theo đề nghị của', type: 'text', placeholder: 'VD: Trưởng phòng Hành chính' },
  summary: { key: 'summary', label: 'Trích yếu nội dung', type: 'textarea', required: true, placeholder: 'VD: Về việc ban hành quy chế...' },
  
  // Content blocks
  context: { key: 'context', label: 'Bối cảnh / Lý do', type: 'textarea' },
  objectives: { key: 'objectives', label: 'Mục đích, yêu cầu', type: 'textarea' },
  tasks: { key: 'tasks', label: 'Nhiệm vụ, giải pháp', type: 'textarea' },
  implementation: { key: 'implementation', label: 'Tổ chức thực hiện', type: 'textarea' },
  conclusion: { key: 'conclusion', label: 'Nội dung kết luận', type: 'textarea' },
};
