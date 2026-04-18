import { Document, Packer, Paragraph, TextRun, AlignmentType, UnderlineType } from 'docx';
import { saveAs } from 'file-saver';

export async function exportToDocx(draft, isDiff = false, diffText = '') {
  const { metadata, editedContent, aiOutput } = draft;
  const rawContent = isDiff ? (diffText || '') : (editedContent || aiOutput || '');

  // Helper to parse simple <red> tags and convert to TextRuns
  const parseLine = (line) => {
    const runs = [];
    let remaining = line;
    
    // Simple regex to find <red>...</red>
    const regex = /<red>(.*?)<\/red>/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(line)) !== null) {
      // Normal text before match
      if (match.index > lastIndex) {
        runs.push(new TextRun({
          text: line.substring(lastIndex, match.index),
          size: 28,
          font: 'Times New Roman'
        }));
      }
      
      // Red text
      runs.push(new TextRun({
        text: match[1],
        size: 28,
        font: 'Times New Roman',
        color: 'FF0000',
        bold: true,
        underline: { type: UnderlineType.SINGLE, color: 'FF0000' }
      }));
      
      lastIndex = regex.lastIndex;
    }

    // Remaining text
    if (lastIndex < line.length) {
      runs.push(new TextRun({
        text: line.substring(lastIndex),
        size: 28,
        font: 'Times New Roman'
      }));
    }

    return runs.length > 0 ? runs : [new TextRun({ text: line, size: 28, font: 'Times New Roman' })];
  };

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: '20mm',
            bottom: '20mm',
            left: '30mm',
            right: '20mm',
          },
        },
      },
      children: [
        // Quoc hieu & Tiêu ngữ (Nghị định 30)
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', bold: true, size: 26, font: 'Times New Roman' }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Độc lập - Tự do - Hạnh phúc', bold: true, size: 28, font: 'Times New Roman' }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: '────────────────', bold: true, size: 10 }),
          ],
        }),
        new Paragraph({ text: '' }), // Spacer
        
        // Content
        ...rawContent.split('\n').map(line => new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: parseLine(line),
          spacing: { line: 360, before: 120 }, // 1.5 line spacing, 6pt before
        })),

        new Paragraph({ text: '' }),
        new Paragraph({ text: '' }),

        // Signature block (Simplified)
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: metadata.signer_title || 'CHỨC VỤ NGƯỜI KÝ', bold: true, size: 26, font: 'Times New Roman' }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: '(Chữ ký, dấu)', italic: true, size: 22, font: 'Times New Roman' }),
          ],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({ text: '' }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: metadata.signer_name || 'Họ và tên người ký', bold: true, size: 28, font: 'Times New Roman' }),
          ],
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Van_ban_hieu_dinh_${draft.documentType}.docx`);
}
