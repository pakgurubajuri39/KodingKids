import { jsPDF } from 'jspdf';

export interface CertificateData {
  studentName: string;
  levelNumber: number;
  levelTitle: string;
  issueDate: string;
  certificateCode: string;
}

export function drawCertificateCanvas(canvas: HTMLCanvasElement, data: CertificateData) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 1200;
  const height = 800;
  canvas.width = width;
  canvas.height = height;

  // Background gradient (warm cream to soft sky)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#FFFBEB'); // amber-50
  bgGrad.addColorStop(0.5, '#FEF3C7'); // amber-100
  bgGrad.addColorStop(1, '#E0F2FE'); // sky-100
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative Outer border
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#F59E0B'; // amber-500
  ctx.strokeRect(25, 25, width - 50, height - 50);

  // Inner border
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#3B82F6'; // blue-500
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Corner Ornaments
  const corners = [
    { x: 45, y: 45 },
    { x: width - 45, y: 45 },
    { x: 45, y: height - 45 },
    { x: width - 45, y: height - 45 },
  ];
  corners.forEach(c => {
    ctx.fillStyle = '#EC4899'; // pink
    ctx.beginPath();
    ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
    ctx.fill();
  });

  // Header Badge Ribbon
  ctx.fillStyle = '#3B82F6';
  ctx.fillRect(width / 2 - 250, 60, 500, 50);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🌟 KODINGKIDS ACADEMY 🌟', width / 2, 94);

  // Main Title
  ctx.fillStyle = '#1E293B';
  ctx.font = 'bold 54px Fredoka, cursive, sans-serif';
  ctx.fillText('SERTIFIKAT KELULUSAN', width / 2, 185);

  // Subtitle
  ctx.fillStyle = '#64748B';
  ctx.font = '600 20px Nunito, sans-serif';
  ctx.fillText('Sertifikat Resmi Penghargaan Prestasi Belajar Coding Cilik', width / 2, 225);

  // Awarded to text
  ctx.fillStyle = '#475569';
  ctx.font = '22px Nunito, sans-serif';
  ctx.fillText('Dengan bangga dan rasa hormat diberikan kepada:', width / 2, 290);

  // Student Name
  ctx.fillStyle = '#2563EB'; // vibrant blue
  ctx.font = 'bold 50px Fredoka, sans-serif';
  ctx.fillText(data.studentName.toUpperCase(), width / 2, 360);

  // Underline for name
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#F59E0B';
  ctx.beginPath();
  ctx.moveTo(width / 2 - 280, 380);
  ctx.lineTo(width / 2 + 280, 380);
  ctx.stroke();

  // Achievement Description
  ctx.fillStyle = '#334155';
  ctx.font = '22px Nunito, sans-serif';
  ctx.fillText('Telah sukses menyelesaikan seluruh misi & tantangan pemrograman interaktif pada:', width / 2, 430);

  // Level Title Badge
  ctx.fillStyle = '#10B981'; // emerald-500
  ctx.beginPath();
  ctx.roundRect(width / 2 - 320, 460, 640, 60, 30);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px Fredoka, sans-serif';
  ctx.fillText(`LEVEL ${data.levelNumber}: ${data.levelTitle.toUpperCase()}`, width / 2, 502);

  // Motivational quote
  ctx.fillStyle = '#64748B';
  ctx.font = 'italic 18px Nunito, sans-serif';
  ctx.fillText('"Setiap baris kode adalah langkah menuju masa depan yang penuh kreativitas dan inovasi."', width / 2, 570);

  // Gold Seal Badge on Left Bottom
  const sealX = 220;
  const sealY = 660;
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(sealX, sealY, 55, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#FEF3C7';
  ctx.beginPath();
  ctx.arc(sealX, sealY, 45, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#92400E';
  ctx.font = 'bold 13px Fredoka, sans-serif';
  ctx.fillText('RESMI', sealX, sealY - 10);
  ctx.fillText('VERIFIED', sealX, sealY + 8);
  ctx.fillText('★ ★ ★', sealX, sealY + 24);

  // Signatures and Metadata on Right
  const signX = width - 260;
  const signY = 670;

  // Signature line
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(signX - 120, signY);
  ctx.lineTo(signX + 120, signY);
  ctx.stroke();

  // Signature script text
  ctx.fillStyle = '#1E3A8A';
  ctx.font = 'italic bold 26px Fredoka, cursive, sans-serif';
  ctx.fillText('Pak GuruAI', signX, signY - 14);

  ctx.fillStyle = '#475569';
  ctx.font = 'bold 16px Nunito, sans-serif';
  ctx.fillText('Kepala Pembina KodingKids', signX, signY + 24);

  // Center Footer metadata
  ctx.fillStyle = '#94A3B8';
  ctx.font = '14px monospace';
  ctx.fillText(`ID Sertifikat: ${data.certificateCode} • Diterbitkan: ${data.issueDate}`, width / 2, 730);
  ctx.font = '13px Nunito, sans-serif';
  ctx.fillText('@Copyright by. Pak GuruAI', width / 2, 755);
}

export function downloadCertificateAsPdf(data: CertificateData) {
  const canvas = document.createElement('canvas');
  drawCertificateCanvas(canvas, data);

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  // Landscape A4: 297mm x 210mm
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
  pdf.save(`Sertifikat-KodingKids-Level${data.levelNumber}-${data.studentName.replace(/\s+/g, '_')}.pdf`);
}

export function downloadCertificateAsPng(data: CertificateData) {
  const canvas = document.createElement('canvas');
  drawCertificateCanvas(canvas, data);

  const link = document.createElement('a');
  link.download = `Sertifikat-KodingKids-Level${data.levelNumber}-${data.studentName.replace(/\s+/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
