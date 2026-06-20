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

  // ─── Colored corner stripes (matching reference) ───
  // Top-left corner stripes
  doc.setFillColor(220, 38, 38); // red
  doc.rect(0, 0, 5, 55, 'F');
  doc.setFillColor(34, 197, 94); // green
  doc.rect(7, 0, 5, 45, 'F');
  doc.setFillColor(234, 179, 8); // yellow
  doc.rect(14, 0, 5, 35, 'F');
  doc.setFillColor(59, 130, 246); // blue
  doc.rect(21, 5, 4, 25, 'F');

  // Bottom-left corner stripes
  doc.setFillColor(220, 38, 38);
  doc.rect(0, H - 55, 5, 55, 'F');
  doc.setFillColor(34, 197, 94);
  doc.rect(7, H - 45, 5, 45, 'F');
  doc.setFillColor(234, 179, 8);
  doc.rect(14, H - 35, 5, 35, 'F');
  doc.setFillColor(59, 130, 246);
  doc.rect(21, H - 25, 4, 25, 'F');

  // Top-right corner stripes
  doc.setFillColor(220, 38, 38);
  doc.rect(W - 5, 0, 5, 55, 'F');
  doc.setFillColor(34, 197, 94);
  doc.rect(W - 12, 0, 5, 45, 'F');
  doc.setFillColor(234, 179, 8);
  doc.rect(W - 19, 0, 5, 35, 'F');
  doc.setFillColor(59, 130, 246);
  doc.rect(W - 25, 5, 4, 25, 'F');

  // Bottom-right corner stripes
  doc.setFillColor(234, 179, 8);
  doc.rect(W - 5, H - 55, 5, 55, 'F');
  doc.setFillColor(34, 197, 94);
  doc.rect(W - 12, H - 45, 5, 45, 'F');
  doc.setFillColor(220, 38, 38);
  doc.rect(W - 19, H - 35, 5, 35, 'F');
  doc.setFillColor(59, 130, 246);
  doc.rect(W - 25, H - 25, 4, 25, 'F');

  // ─── Inner border frame ───
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.roundedRect(28, 10, W - 56, H - 20, 8, 8, 'S');

  // ─── Verification URL at top ───
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(37, 99, 235);
  doc.text('Certificate Verification: https://www.invigoinfotech.in/verification', W / 2, 7, { align: 'center' });

  // ─── Top logos row ───
  // MSME Logo placeholder
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(0, 100, 0);
  doc.text('MSME', 55, 25);
  doc.setFontSize(5);
  doc.setTextColor(80, 80, 80);
  doc.text('MICRO, SMALL & MEDIUM', 48, 29);
  doc.text('ENTERPRISES', 53, 32);
  
  // National Internship Portal placeholder
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(180, 0, 0);
  doc.text('NATIONAL', 110, 23);
  doc.text('INTERNSHIP', 108, 27);
  doc.text('PORTAL', 112, 31);

  // ISO Certified badge
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.8);
  doc.circle(165, 26, 8, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(37, 99, 235);
  doc.text('CERTIFIED', 165, 23, { align: 'center' });
  doc.setFontSize(8);
  doc.text('ISO', 165, 27, { align: 'center' });
  doc.setFontSize(5);
  doc.text('9001:2015', 165, 30, { align: 'center' });

  // Invigo Infotech logo placeholder (right side)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 58, 138);
  doc.text('invigo', 228, 25);
  doc.setFontSize(5);
  doc.setTextColor(37, 99, 235);
  doc.text('INFOTECH', 228, 29);

  // ─── Title ───
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(28);
  doc.setTextColor(15, 23, 42);
  doc.text('Certificate of Completion', W / 2, 58, { align: 'center' });

  // ─── Decorative line under title ───
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.3);
  doc.line(W / 2 - 50, 62, W / 2 + 50, 62);

  // ─── Certificate body text ───
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);
  doc.text('This is to Certify that', W / 2, 76, { align: 'center' });
  
  // Student name (bold)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(cert.fullName, W / 2, 88, { align: 'center' });

  // Underline under name
  const nameWidth = doc.getTextWidth(cert.fullName);
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.3);
  doc.line(W / 2 - nameWidth / 2, 90, W / 2 + nameWidth / 2, 90);

  // College name
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);
  doc.text(`of ${cert.collegeName}`, W / 2, 99, { align: 'center' });

  // Completion details
  doc.text('has successfully completed a', W / 2, 108, { align: 'center' });

  // Duration and mode
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  const modeText = cert.trainingMode === 'offline' ? 'Offline' : 'Online';
  doc.text(`${getDurationText(cert.durationWeeks)} ${modeText} Internship`, W / 2, 117, { align: 'center' });

  // Domain
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);
  doc.text('program on', W / 2, 125, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  doc.text(`"${domainTitle}"`, W / 2, 134, { align: 'center' });

  // Duration dates
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text('during', W / 2, 142, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  const startFormatted = formatDate(cert.startDate);
  const endFormatted = getEndDate(cert.startDate, cert.durationWeeks);
  doc.text(`( ${startFormatted} - ${endFormatted} )`, W / 2, 149, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text('in  Invigo Infotech.', W / 2, 156, { align: 'center' });

  // Performance note
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text('We found candidate sincere, hardworking, technically sound & result oriented', W / 2, 164, { align: 'center' });
  
  const scoreText = cert.testScore && cert.testScore >= 80 ? 'Excellent' : cert.testScore && cert.testScore >= 60 ? 'Good' : 'Good';
  doc.text(`and Score `, W / 2 - 15, 170, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text(scoreText, W / 2 + 5, 170, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(' in Assessment test.', W / 2 + 30, 170, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text('We wish all the best for future endeavors.', W / 2, 177, { align: 'center' });

  // ─── Issue date ───
  const certDate = cert.certificateDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Issued on ${certDate}`, 75, 190);

  // ─── Company stamp area ───
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.5);
  doc.circle(148, 193, 10, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(30, 58, 138);
  doc.text('INVIGO INFOTECH', 148, 192, { align: 'center' });
  doc.text('PURNEA', 148, 196, { align: 'center' });

  // ─── QR Code ───
  drawQRCode(doc, 208, 183, 18, cert.candidateId);

  // ─── Founder signature ───
  // Signature line
  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(0.3);
  doc.line(45, 198, 105, 198);

  // Signature text
  doc.setFont('times', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Priyanshu Kumar', 50, 196);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Founder ( Invigo Infotech )', 50, 203);

  // ─── Certificate number ───
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`Certificate no: ${cert.candidateId}`, 195, 203);

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
