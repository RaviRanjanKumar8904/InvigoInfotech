import { jsPDF } from 'jspdf';
import { EnrollmentState } from '../types';

// ─── Helper: Draw simple QR code pattern ───
function drawQRCode(doc: jsPDF, x: number, y: number, size: number, data: string) {
  // Simple visual QR code pattern (not scannable, but looks authentic)
  const cellSize = size / 25;
  doc.setFillColor(0, 0, 0);
  
  // Generate pseudo-random pattern from data string
  const hash = data.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  
  // Fixed finder patterns (top-left, top-right, bottom-left)
  const drawFinder = (fx: number, fy: number) => {
    doc.setFillColor(0, 0, 0);
    doc.rect(fx, fy, cellSize * 7, cellSize * 7, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(fx + cellSize, fy + cellSize, cellSize * 5, cellSize * 5, 'F');
    doc.setFillColor(0, 0, 0);
    doc.rect(fx + cellSize * 2, fy + cellSize * 2, cellSize * 3, cellSize * 3, 'F');
  };
  
  drawFinder(x, y);
  drawFinder(x + cellSize * 18, y);
  drawFinder(x, y + cellSize * 18);
  
  // Data modules (pseudo-random)
  doc.setFillColor(0, 0, 0);
  for (let row = 0; row < 25; row++) {
    for (let col = 0; col < 25; col++) {
      // Skip finder pattern areas
      if ((row < 8 && col < 8) || (row < 8 && col > 16) || (row > 16 && col < 8)) continue;
      
      const seed = (hash + row * 31 + col * 37) % 100;
      if (seed < 45) {
        doc.rect(x + col * cellSize, y + row * cellSize, cellSize, cellSize, 'F');
      }
    }
  }
}

// ─── Helper: format date nicely ───
function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// ─── Helper: calculate end date ───
function getEndDate(startDate: string, durationWeeks: number): string {
  try {
    const start = new Date(startDate);
    const end = new Date(start.getTime() + durationWeeks * 7 * 24 * 60 * 60 * 1000);
    return end.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return startDate;
  }
}

// ─── Helper: duration in months text ───
function getDurationText(weeks: number): string {
  if (weeks <= 4) return '1 Month';
  if (weeks <= 8) return '2 Months';
  return '3 Months';
}

// ═══════════════════════════════════════════════════════════
// CERTIFICATE PDF - Matching reference image style
// ═══════════════════════════════════════════════════════════
export function downloadCertificatePDF(cert: EnrollmentState, domainTitle: string) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const W = 297; // width
  const H = 210; // height

  // ─── White background ───
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, 'F');

  const drawPoly = (pts: [number, number][], color: [number, number, number]) => {
    doc.setFillColor(...color);
    if (pts.length === 3) {
      doc.triangle(pts[0][0], pts[0][1], pts[1][0], pts[1][1], pts[2][0], pts[2][1], 'F');
    } else if (pts.length === 4) {
      doc.triangle(pts[0][0], pts[0][1], pts[1][0], pts[1][1], pts[2][0], pts[2][1], 'F');
      doc.triangle(pts[0][0], pts[0][1], pts[2][0], pts[2][1], pts[3][0], pts[3][1], 'F');
    }
  };

  // ─── Diagonal Corner Ribbons ───
  // Top-Left
  drawPoly([[0, 0], [50, 0], [0, 50]], [90, 168, 62]); // Green
  drawPoly([[55, 0], [70, 0], [0, 70], [0, 55]], [241, 188, 24]); // Yellow
  drawPoly([[75, 0], [105, 0], [0, 105], [0, 75]], [228, 28, 25]); // Red
  drawPoly([[10, 105], [40, 75], [85, 120], [55, 150]], [54, 115, 203]); // Blue

  // Bottom-Right
  drawPoly([[W, H], [W - 50, H], [W, H - 50]], [241, 188, 24]); // Yellow
  drawPoly([[W - 55, H], [W - 70, H], [W, H - 70], [W, H - 55]], [90, 168, 62]); // Green
  drawPoly([[W - 75, H], [W - 105, H], [W, H - 105], [W, H - 75]], [54, 115, 203]); // Blue
  drawPoly([[W - 10, H - 105], [W - 40, H - 75], [W - 85, H - 120], [W - 55, H - 150]], [228, 28, 25]); // Red

  // ─── Inner border frame ───
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, 15, W - 30, H - 30, 15, 15, 'S');

  // ─── Verification URL at top ───
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Certificate Verification: https://www.invigoinfotech.in/verification    INVIGO EDUCARE PVT. LTD', W / 2, 10, { align: 'center' });

  // ─── Top logos row ───
  const logoY = 32;
  
  // MSME
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('MSME', 65, logoY);
  doc.setFontSize(5);
  doc.text('MICRO, SMALL & MEDIUM ENTERPRISES', 65, logoY + 4, { align: 'center' });

  // Ministry of Corporate Affairs
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('MINISTRY OF', 115, logoY - 2, { align: 'center' });
  doc.text('CORPORATE AFFAIRS', 115, logoY + 2, { align: 'center' });

  // ISO Certified badge
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.8);
  doc.circle(165, logoY, 10, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(37, 99, 235);
  doc.text('CERTIFIED', 165, logoY - 3, { align: 'center' });
  doc.setFontSize(11);
  doc.text('ISO', 165, logoY + 2, { align: 'center' });
  doc.setFontSize(5);
  doc.text('9001:2015', 165, logoY + 6, { align: 'center' });

  // DPIIT #startupindia
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text('DPIIT', 215, logoY - 1, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(234, 88, 12);
  doc.text('#startupindia', 215, logoY + 4, { align: 'center' });

  // Invigo Infotech
  doc.setFillColor(30, 58, 138);
  doc.circle(265, logoY - 3, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text('INVIGO', 265, logoY + 5, { align: 'center' });
  doc.setFontSize(6);
  doc.text('INFOTECH', 265, logoY + 8, { align: 'center' });

  // ─── Title ───
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text('Certificate of Completion', W / 2, 70, { align: 'center' });

  // ─── Certificate body text ───
  let startY = 90;
  const lineSpacing = 10;
  doc.setFontSize(12);

  const drawMixedText = (texts: {text: string, bold?: boolean}[], y: number) => {
    let currentX = W / 2;
    let totalWidth = 0;
    texts.forEach(item => {
      doc.setFont('helvetica', item.bold ? 'bold' : 'normal');
      totalWidth += doc.getTextWidth(item.text);
    });
    
    let xOffset = currentX - (totalWidth / 2);
    texts.forEach(item => {
      doc.setFont('helvetica', item.bold ? 'bold' : 'normal');
      doc.text(item.text, xOffset, y);
      xOffset += doc.getTextWidth(item.text);
    });
  };

  const regNoStr = cert.registrationNo || cert.candidateId;
  const startFormatted = formatDate(cert.startDate);
  const endFormatted = getEndDate(cert.startDate, cert.durationWeeks);
  const modeText = cert.trainingMode === 'offline' ? 'Offline' : 'Online';

  // Body text based strictly on provided image
  drawMixedText([
    { text: 'This is Certify that ' },
    { text: cert.fullName + ', ', bold: true },
    { text: 'Reg no- ' },
    { text: regNoStr + ' ', bold: true },
    { text: 'of ' }
  ], startY);
  
  startY += lineSpacing;
  drawMixedText([
    { text: cert.collegeName + ' ', bold: true },
    { text: 'has' }
  ], startY);

  startY += lineSpacing;
  drawMixedText([
    { text: 'successfully completed a ' },
    { text: `${cert.durationWeeks} Weeks ${modeText} Training `, bold: true },
    { text: 'program on ' },
    { text: `"${domainTitle}" `, bold: true },
    { text: 'during ' },
    { text: '( ', bold: true }
  ], startY);

  startY += lineSpacing;
  drawMixedText([
    { text: `${startFormatted}- ${endFormatted} ) `, bold: true },
    { text: 'in ' },
    { text: 'Invigo Infotech', bold: true },
    { text: '. We found candidate sincere,' }
  ], startY);

  startY += lineSpacing;
  const scoreText = cert.testScore && cert.testScore >= 80 ? 'Excellent' : cert.testScore && cert.testScore >= 60 ? 'Good' : 'Good';
  drawMixedText([
    { text: 'hardworking, technically sound & result oriented and Score ' },
    { text: scoreText, bold: true },
    { text: ' in Assessment test.' }
  ], startY);

  startY += lineSpacing;
  drawMixedText([
    { text: 'We wish all the best for future endeavors.' }
  ], startY);

  startY += 18;
  // ─── Issue date & Seal ───
  const certDate = cert.certificateDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`Issued on ${certDate}`, W / 2 - 25, startY, { align: 'center' });

  // Ribbon seal
  const sealX = W / 2 + 35;
  const sealY = startY - 3;
  drawPoly([[sealX - 8, sealY + 8], [sealX - 15, sealY + 22], [sealX - 3, sealY + 18]], [234, 179, 8]);
  drawPoly([[sealX + 8, sealY + 8], [sealX + 15, sealY + 22], [sealX + 3, sealY + 18]], [234, 179, 8]);
  doc.setFillColor(220, 38, 38);
  doc.circle(sealX, sealY, 9, 'F');
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.6);
  doc.circle(sealX, sealY, 7, 'S');

  const bottomY = H - 25;

  // ─── Founder signature ───
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(30, bottomY, 90, bottomY);

  doc.setFont('times', 'italic');
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text('Priyanshu kumar', 40, bottomY - 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Founder ( Invigo Infotech )', 60, bottomY + 6, { align: 'center' });

  // ─── Company stamp ───
  const stampX = 130;
  const stampY = bottomY - 15;
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.5);
  doc.circle(stampX, stampY, 15, 'S');
  doc.circle(stampX, stampY, 11, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(30, 58, 138);
  doc.text('* INVIGO INFOTECH *', stampX, stampY - 12, { align: 'center' });
  doc.text('* PURNEA *', stampX, stampY + 14, { align: 'center' });
  doc.setFontSize(5);
  doc.text('INVIGO', stampX, stampY, { align: 'center' });
  doc.text('INFOTECH', stampX, stampY + 4, { align: 'center' });

  // ─── QR Code ───
  drawQRCode(doc, 190, bottomY - 26, 25, cert.candidateId);

  // ─── Certificate number ───
  const shortYear = certDate.match(/\d{4}/)?.[0]?.slice(2) || new Date().getFullYear().toString().slice(2);
  const certNumber = `${shortYear}IN${regNoStr}`;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Certificate no: ${certNumber}`, 180, bottomY + 6);

  // Save
  doc.save(`Certificate_InvigoInfotech_${cert.fullName.replace(/\s+/g, '_')}.pdf`);
}

// ═══════════════════════════════════════════════════════════
// OFFER LETTER PDF - Redesigned to match certificate style
// ═══════════════════════════════════════════════════════════
export function downloadOfferLetterPDF(offer: EnrollmentState, domainTitle: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const W = 210;
  const H = 297;
  const marginX = 20;
  let currentY = 12;

  // ─── Top accent bar ───
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, W, 4, 'F');
  
  // Colored side stripes (left)
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 0, 3, 40, 'F');
  doc.setFillColor(34, 197, 94);
  doc.rect(4, 0, 3, 30, 'F');
  doc.setFillColor(234, 179, 8);
  doc.rect(8, 0, 3, 20, 'F');

  currentY += 8;

  // ─── Logo & Header ───
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138);
  doc.text('INVIGO INFOTECH', marginX, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Internship & Skill Development Platform', marginX, currentY + 11);
  doc.text('Web: www.invigoinfotech.in | Email: info@invigoinfotech.in', marginX, currentY + 15);

  // Right side: ISO + Logo text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(37, 99, 235);
  doc.text('ISO 9001:2015 Certified', W - marginX - 35, currentY + 6);
  doc.text('MSME Registered', W - marginX - 28, currentY + 11);

  currentY += 22;

  // Horizontal separator
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(marginX, currentY, W - marginX, currentY);
  currentY += 8;

  // ─── Document Title ───
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(18);
  doc.setTextColor(30, 58, 138);
  doc.text('Internship Offer Letter', W / 2, currentY, { align: 'center' });
  currentY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Reference ID: ${offer.candidateId}`, marginX, currentY + 4);
  doc.text(`Date: ${offer.enrollmentDate}`, W - marginX, currentY + 4, { align: 'right' });
  currentY += 12;

  // ─── Details Box ───
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(marginX, currentY, W - marginX * 2, 50, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, currentY, W - marginX * 2, 50, 3, 3, 'S');

  const gx1 = marginX + 5;
  const gx2 = 115;
  let gy = currentY + 6;

  // Left column
  const addField = (label: string, value: string, x: number, y: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(label, x, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(value, x, y + 4);
  };

  addField('CANDIDATE NAME:', offer.fullName.toUpperCase(), gx1, gy);
  addField('EMAIL:', offer.email, gx1, gy + 12);
  addField('COLLEGE:', offer.collegeName.length > 35 ? offer.collegeName.slice(0, 32) + '...' : offer.collegeName, gx1, gy + 24);
  addField('PAYMENT:', `Rs. ${offer.amountPaid || '0'} Paid`, gx1, gy + 36);

  addField('DOMAIN:', domainTitle, gx2, gy);
  addField('DURATION:', `${offer.durationWeeks} Weeks from ${offer.startDate}`, gx2, gy + 12);
  addField('MODE:', offer.trainingMode === 'online' ? 'Online' : 'Offline', gx2, gy + 24);
  addField('DEGREE:', `${offer.degree}`, gx2, gy + 36);

  currentY += 60;

  // ─── Letter body ───
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`Dear ${offer.fullName},`, marginX, currentY);
  currentY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  
  const paragraphs = [
    `On behalf of Invigo Infotech, we are pleased to offer you the position of Intern in the ${domainTitle} domain. This is a structured internship program designed to strengthen your practical skills and professional capabilities.`,
    
    `Throughout your ${offer.durationWeeks}-week internship, you will complete progressive milestones under the guidance of our experienced mentors. The program includes structured project modules, progress assessments, and hands-on exercises with industry-standard tools.`,
    
    `Upon successful completion of all milestones and passing the assessment test (minimum 60% score required), you will receive a verified Certificate of Completion with a unique certificate code for employer verification.`,
    
    `We look forward to having you as part of our learning community. Please access the Student Portal to track your progress and submit your work.`
  ];

  paragraphs.forEach((text) => {
    const wrappedText = doc.splitTextToSize(text, W - marginX * 2);
    doc.text(wrappedText, marginX, currentY);
    currentY += wrappedText.length * 5 + 3;
  });

  currentY += 8;

  // ─── Signature block ───
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, currentY, W - marginX, currentY);
  currentY += 8;

  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Priyanshu Kumar', marginX, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Founder, Invigo Infotech', marginX, currentY);

  // QR code on signature line
  drawQRCode(doc, W - marginX - 20, currentY - 15, 18, offer.candidateId);

  // ─── Footer ───
  currentY = H - 15;
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, currentY, W - marginX, currentY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('This offer letter is electronically generated by Invigo Infotech and does not require a physical signature.', W / 2, currentY + 4, { align: 'center' });
  doc.text(`Verification: https://www.invigoinfotech.in/verification | Ref: ${offer.candidateId}`, W / 2, currentY + 8, { align: 'center' });

  // Bottom accent
  doc.setFillColor(30, 58, 138);
  doc.rect(0, H - 3, W, 3, 'F');

  doc.save(`Offer_Letter_InvigoInfotech_${offer.fullName.replace(/\s+/g, '_')}.pdf`);
}

// ═══════════════════════════════════════════════════════════
// ACCEPTANCE LETTER PDF - Similar style to offer letter
// ═══════════════════════════════════════════════════════════
export function downloadAcceptanceLetterPDF(enrollment: EnrollmentState, domainTitle: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const W = 210;
  const H = 297;
  const marginX = 20;
  let currentY = 12;

  // ─── Top accent bar ───
  doc.setFillColor(16, 185, 129); // emerald
  doc.rect(0, 0, W, 4, 'F');
  
  // Side stripes
  doc.setFillColor(34, 197, 94);
  doc.rect(0, 0, 3, 40, 'F');
  doc.setFillColor(59, 130, 246);
  doc.rect(4, 0, 3, 30, 'F');
  doc.setFillColor(234, 179, 8);
  doc.rect(8, 0, 3, 20, 'F');

  currentY += 8;

  // ─── Logo & Header ───
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138);
  doc.text('INVIGO INFOTECH', marginX, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Internship & Skill Development Platform', marginX, currentY + 11);
  doc.text('Web: www.invigoinfotech.in | Email: info@invigoinfotech.in', marginX, currentY + 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(16, 185, 129);
  doc.text('ISO 9001:2015 Certified', W - marginX - 35, currentY + 6);

  currentY += 22;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(marginX, currentY, W - marginX, currentY);
  currentY += 8;

  // ─── Title ───
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(18);
  doc.setTextColor(16, 185, 129);
  doc.text('Internship Acceptance Letter', W / 2, currentY, { align: 'center' });
  currentY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Reference ID: ${enrollment.candidateId}`, marginX, currentY + 4);
  doc.text(`Date: ${enrollment.enrollmentDate}`, W - marginX, currentY + 4, { align: 'right' });
  currentY += 12;

  // ─── Details Box ───
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.roundedRect(marginX, currentY, W - marginX * 2, 40, 3, 3, 'F');
  doc.setDrawColor(187, 247, 208); // emerald-200
  doc.roundedRect(marginX, currentY, W - marginX * 2, 40, 3, 3, 'S');

  const gx1 = marginX + 5;
  const gx2 = 115;
  let gy2 = currentY + 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('INTERN NAME:', gx1, gy2);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(enrollment.fullName, gx1, gy2 + 4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('COLLEGE:', gx1, gy2 + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  const collegeText = enrollment.collegeName.length > 35 ? enrollment.collegeName.slice(0, 32) + '...' : enrollment.collegeName;
  doc.text(`${enrollment.degree}, ${collegeText}`, gx1, gy2 + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('INTERNSHIP DOMAIN:', gx2, gy2);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129);
  doc.text(domainTitle, gx2, gy2 + 4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('DURATION:', gx2, gy2 + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`${enrollment.durationWeeks} Weeks | ${enrollment.trainingMode === 'offline' ? 'Offline' : 'Online'}`, gx2, gy2 + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('START DATE:', gx1, gy2 + 26);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(formatDate(enrollment.startDate), gx1, gy2 + 30);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('STATUS:', gx2, gy2 + 26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(16, 185, 129);
  doc.text('ACCEPTED', gx2, gy2 + 30);

  currentY += 50;

  // ─── Letter body ───
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`Dear ${enrollment.fullName},`, marginX, currentY);
  currentY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  
  const acceptanceParagraphs = [
    `We are pleased to confirm that your application for the ${domainTitle} internship program at Invigo Infotech has been reviewed and accepted. Welcome to the Invigo learning community!`,
    
    `Your internship is scheduled to begin on ${formatDate(enrollment.startDate)} and will span ${enrollment.durationWeeks} weeks. During this period, you will work through structured phases of learning, each culminating in practical deliverables and milestone assessments.`,
    
    `As an accepted intern, you are expected to:`,
  ];

  acceptanceParagraphs.forEach((text) => {
    const wrappedText = doc.splitTextToSize(text, W - marginX * 2);
    doc.text(wrappedText, marginX, currentY);
    currentY += wrappedText.length * 5 + 3;
  });

  // Bullet points
  const bullets = [
    'Complete all assigned weekly milestones on time',
    'Maintain regular communication through the Student Portal',
    'Submit all project deliverables before the deadline',
    'Pass the final MCQ assessment with a minimum score of 60%',
    'Adhere to the code of conduct and ethical guidelines'
  ];

  bullets.forEach((bullet) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`  •  ${bullet}`, marginX + 5, currentY);
    currentY += 5.5;
  });

  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const closingText = 'Upon successful completion, you will receive a verified Certificate of Completion that can be validated by employers and academic institutions. We look forward to supporting your growth and success.';
  const wrappedClosing = doc.splitTextToSize(closingText, W - marginX * 2);
  doc.text(wrappedClosing, marginX, currentY);
  currentY += wrappedClosing.length * 5 + 10;

  // ─── Signature ───
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, currentY, W - marginX, currentY);
  currentY += 8;

  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Priyanshu Kumar', marginX, currentY);
  currentY += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Founder, Invigo Infotech', marginX, currentY);

  // QR code
  drawQRCode(doc, W - marginX - 20, currentY - 15, 18, enrollment.candidateId);

  // ─── Footer ───
  currentY = H - 15;
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, currentY, W - marginX, currentY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('This acceptance letter is electronically generated by Invigo Infotech.', W / 2, currentY + 4, { align: 'center' });
  doc.text(`Verification: https://www.invigoinfotech.in/verification | Ref: ${enrollment.candidateId}`, W / 2, currentY + 8, { align: 'center' });

  doc.setFillColor(16, 185, 129);
  doc.rect(0, H - 3, W, 3, 'F');

  doc.save(`Acceptance_Letter_InvigoInfotech_${enrollment.fullName.replace(/\s+/g, '_')}.pdf`);
}
