import { DOCUMENT_TYPES } from '../config/documentTypeRegistry';

export const CLASSIFIER_SYSTEM_PROMPT = `Bạn là chuyên gia phân loại văn bản hành chính Việt Nam.
Nhiệm vụ của bạn là đọc nội dung hồ sơ/tài liệu được cung cấp và xác định loại văn bản đầu ra phù hợp nhất trong 7 loại sau:
1. Thông báo
2. Kế hoạch
3. Quyết định
4. Công văn
5. Tờ trình
6. Báo cáo
7. Biên bản

Hãy trả về kết quả dưới dạng JSON:
{
  "suggestedTypeId": "id_cua_loai_van_ban",
  "reason": "Lý do vì sao chọn loại này dựa trên nội dung hồ sơ",
  "extractedMetadata": {
    "issuing_agency": "...",
    "place": "...",
    "summary": "..."
  }
}
`;

export function buildClassifierPrompt(content) {
  return `Dựa trên nội dung hồ sơ sau đây, hãy gợi ý loại văn bản đầu ra phù hợp:\n\n${content.substring(0, 5000)}`; // Limit content for classification
}
