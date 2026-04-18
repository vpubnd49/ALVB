export function validateLegalBases(text: string) {
  const warnings: string[] = [];
  
  // Kiểm tra Luật Tổ chức chính quyền địa phương 2019
  // Sau 16/6/2025 phải ưu tiên Luật số 72/2025/QH15
  const now = new Date();
  const deadline = new Date('2025-06-16');
  
  if (now > deadline) {
    if (text.includes('Luật Tổ chức chính quyền địa phương 2019') || text.includes('47/2019/QH14')) {
      warnings.push('Cảnh báo: Luật Tổ chức chính quyền địa phương 2019 có thể đã hết hiệu lực hoặc bị thay thế bởi Luật số 72/2025/QH15.');
    }
  }

  // Kiểm tra mô hình 3 cấp cũ
  if (text.includes('Hội đồng nhân dân huyện') && text.includes('Đà Lạt')) {
     warnings.push('Lưu ý: Theo mô hình chính quyền 2 cấp hiện hành, cần kiểm tra lại thẩm quyền của HĐND tại địa phương này.');
  }

  return warnings;
}
