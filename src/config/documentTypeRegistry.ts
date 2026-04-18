export const DOCUMENT_TYPES = [
  { 
    id: 'thong_bao', 
    label: 'Thông báo',
    fields: ['parent_agency', 'issuing_agency', 'place', 'issue_date', 'summary', 'context', 'conclusion', 'signer_name', 'signer_title', 'recipient_list']
  },
  { 
    id: 'ke_hoach', 
    label: 'Kế hoạch',
    fields: ['parent_agency', 'issuing_agency', 'place', 'issue_date', 'summary', 'objectives', 'tasks', 'implementation', 'signer_name', 'signer_title', 'recipient_list']
  },
  { 
    id: 'quyet_dinh', 
    label: 'Quyết định',
    fields: ['parent_agency', 'issuing_agency', 'doc_number', 'doc_symbol', 'place', 'issue_date', 'summary', 'legal_bases', 'proposal_from', 'signer_name', 'signer_title', 'recipient_list']
  },
  { 
    id: 'cong_van', 
    label: 'Công văn',
    fields: ['parent_agency', 'issuing_agency', 'doc_number', 'doc_symbol', 'place', 'issue_date', 'summary', 'context', 'signer_name', 'signer_title', 'recipient_list']
  },
  { 
    id: 'to_trinh', 
    label: 'Tờ trình',
    fields: ['parent_agency', 'issuing_agency', 'place', 'issue_date', 'summary', 'context', 'signer_name', 'signer_title', 'recipient_list']
  },
  { 
    id: 'bao_cao', 
    label: 'Báo cáo',
    fields: ['parent_agency', 'issuing_agency', 'place', 'issue_date', 'summary', 'context', 'signer_name', 'signer_title', 'recipient_list']
  },
  { 
    id: 'bien_ban', 
    label: 'Biên bản',
    fields: ['issuing_agency', 'place', 'issue_date', 'summary', 'context', 'conclusion', 'signer_name', 'signer_title']
  },
];
