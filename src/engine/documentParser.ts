import mammoth from 'mammoth';
// Note: pdfjs-dist usually requires a worker setup, which can be complex in Vite.
// For now, we will implement a robust DOCX parser and a basic PDF placeholder.

export async function parseDocument(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  
  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } else if (extension === 'pdf') {
    // Basic PDF parsing logic would go here
    return `[Nội dung từ file PDF: ${file.name}] - (Tính năng đang được hoàn thiện)`;
  }
  
  return '';
}

export function buildFromFilesPrompt(filesContent, userRequest) {
  return `Dưới đây là nội dung từ các hồ sơ tài liệu tham khảo:\n\n${filesContent}\n\nYêu cầu: Dựa trên hồ sơ này, hãy soạn thảo văn bản hành chính phù hợp. ${userRequest || ''}`;
}
