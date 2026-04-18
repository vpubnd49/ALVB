// Quy định thể thức văn bản theo Nghị định 30/2020/NĐ-CP
export const DOCUMENT_FORMAT_RULES = {
  // Font chữ
  font: {
    name: 'Times New Roman',
    size: {
      quocHieu: 13,
      tieuNgu: 13,
      tenCoQuan: 13,
      soKyHieu: 13,
      diaDanhNgayThang: 13,
      tenVanBan: 14,
      trichYeu: 14,
      noiDung: 14,
      chucVuNguoiKy: 13,
      hoTenNguoiKy: 14,
      noiNhan: 11,
    },
  },
  // Lề trang (mm)
  margin: {
    top: 20,
    bottom: 20,
    left: 30,
    right: 20,
  },
  // Khổ giấy
  pageSize: 'A4',
  // Khoảng cách dòng
  lineSpacing: 1.5,
  // Quốc hiệu và Tiêu ngữ
  quocHieu: {
    line1: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
    line2: 'Độc lập - Tự do - Hạnh phúc',
    format: {
      line1: { bold: true, uppercase: true },
      line2: { bold: true, underline: true },
    },
  },
};
