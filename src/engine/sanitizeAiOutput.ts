export function sanitizeAiOutput(text: string): string {
  if (!text) return '';

  return text
    // 1. Loại bỏ markdown code blocks
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    
    // 2. Loại bỏ markdown headings (VD: #, ##, ###)
    .replace(/^#+\s+/gm, '')
    
    // 3. Loại bỏ ký tự in đậm markdown (VD: **, __)
    .replace(/\*\*|\_\_/g, '')
    
    // 4. Chuẩn hóa dòng trắng (không quá 2 dòng liên tiếp)
    .replace(/\n{3,}/g, '\n\n')
    
    // 5. Loại bỏ khoảng trắng đầu/cuối mỗi dòng
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    
    // 6. Loại bỏ các lời dẫn phổ biến của AI (nếu còn sót)
    .replace(/^(Dưới đây là|Đây là|Bản dự thảo|Chào bạn).*:/gi, '')
    
    .trim();
}
