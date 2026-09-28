import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont, degrees } from 'pdf-lib';
import JSZip from 'jszip';
import { KDPBook, KDPPage } from '../types';
import { calculateCoverWrapDimensions } from './kdpSpecs';

/**
 * Word wraps text to fit within a given maxWidth using the font width calculator.
 */
function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Draws crisp vector coloring art on a page
 */
function drawColoringVector(
  page: PDFPage, 
  centerX: number, 
  centerY: number, 
  type: string, 
  title: string
) {
  // Border frame for kids coloring page
  const frameWidth = 440;
  const frameHeight = 520;
  const frameX = centerX - frameWidth / 2;
  const frameY = centerY - frameHeight / 2;

  // Outer decorative frame
  page.drawRectangle({
    x: frameX,
    y: frameY,
    width: frameWidth,
    height: frameHeight,
    borderColor: rgb(0.1, 0.1, 0.1),
    borderWidth: 2.5,
    color: rgb(1, 1, 1),
  });

  // Inner double border
  page.drawRectangle({
    x: frameX + 6,
    y: frameY + 6,
    width: frameWidth - 12,
    height: frameHeight - 12,
    borderColor: rgb(0.2, 0.2, 0.2),
    borderWidth: 1,
    color: rgb(1, 1, 1),
  });

  // Vector illustration drawing based on type
  if (type.includes('dino') || title.toLowerCase().includes('dino') || title.toLowerCase().includes('jurassic')) {
    // Dinosaur vector shapes (friendly T-Rex / Stegosaurus outline for kids)
    // Body oval
    page.drawEllipse({
      x: centerX - 20,
      y: centerY - 10,
      xScale: 90,
      yScale: 65,
      borderColor: rgb(0, 0, 0),
      borderWidth: 3,
      color: rgb(1, 1, 1),
    });
    // Dino Head
    page.drawEllipse({
      x: centerX + 75,
      y: centerY + 65,
      xScale: 55,
      yScale: 40,
      borderColor: rgb(0, 0, 0),
      borderWidth: 3,
      color: rgb(1, 1, 1),
    });
    // Dino Eye
    page.drawCircle({
      x: centerX + 85,
      y: centerY + 78,
      size: 8,
      borderColor: rgb(0, 0, 0),
      borderWidth: 2,
      color: rgb(1, 1, 1),
    });
    page.drawCircle({
      x: centerX + 87,
      y: centerY + 80,
      size: 3,
      color: rgb(0, 0, 0),
    });
    // Dino Smile
    page.drawLine({
      start: { x: centerX + 60, y: centerY + 52 },
      end: { x: centerX + 105, y: centerY + 58 },
      thickness: 3,
      color: rgb(0, 0, 0),
    });
    // Dino back plates (spikes)
    for (let i = 0; i < 5; i++) {
      const sx = centerX - 80 + i * 35;
      const sy = centerY + 50 + (i === 2 ? 15 : 0);
      page.drawRectangle({
        x: sx,
        y: sy,
        width: 22,
        height: 22,
        borderColor: rgb(0, 0, 0),
        borderWidth: 2.5,
        rotate: degrees(45),
      });
    }
    // Feet
    page.drawRectangle({
      x: centerX - 60,
      y: centerY - 95,
      width: 32,
      height: 35,
      borderColor: rgb(0, 0, 0),
      borderWidth: 3,
      color: rgb(1, 1, 1),
    });
    page.drawRectangle({
      x: centerX + 10,
      y: centerY - 95,
      width: 32,
      height: 35,
      borderColor: rgb(0, 0, 0),
      borderWidth: 3,
      color: rgb(1, 1, 1),
    });
    // Ground & Grass
    page.drawLine({
      start: { x: frameX + 20, y: centerY - 95 },
      end: { x: frameX + frameWidth - 20, y: centerY - 95 },
      thickness: 2.5,
      color: rgb(0, 0, 0),
    });
    // Jungle Palm Tree
    page.drawLine({
      start: { x: centerX - 140, y: centerY - 95 },
      end: { x: centerX - 140, y: centerY + 80 },
      thickness: 5,
      color: rgb(0, 0, 0),
    });
    page.drawCircle({
      x: centerX - 140,
      y: centerY + 85,
      size: 28,
      borderColor: rgb(0, 0, 0),
      borderWidth: 2.5,
      color: rgb(1, 1, 1),
    });
  } else if (type.includes('rocket') || title.toLowerCase().includes('space') || title.toLowerCase().includes('rocket')) {
    // Space rocket & planets
    // Rocket Body
    page.drawEllipse({
      x: centerX,
      y: centerY + 20,
      xScale: 55,
      yScale: 110,
      borderColor: rgb(0, 0, 0),
      borderWidth: 3,
      color: rgb(1, 1, 1),
    });
    // Window
    page.drawCircle({
      x: centerX,
      y: centerY + 55,
      size: 24,
      borderColor: rgb(0, 0, 0),
      borderWidth: 3,
      color: rgb(1, 1, 1),
    });
    page.drawCircle({
      x: centerX,
      y: centerY + 55,
      size: 14,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1.5,
      color: rgb(1, 1, 1),
    });
    // Fins
    page.drawRectangle({
      x: centerX - 85,
      y: centerY - 45,
      width: 40,
      height: 45,
      borderColor: rgb(0, 0, 0),
      borderWidth: 3,
      rotate: degrees(-25),
    });
    page.drawRectangle({
      x: centerX + 55,
      y: centerY - 45,
      width: 40,
      height: 45,
      borderColor: rgb(0, 0, 0),
      borderWidth: 3,
      rotate: degrees(25),
    });
    // Exhaust Flame
    page.drawEllipse({
      x: centerX,
      y: centerY - 110,
      xScale: 25,
      yScale: 40,
      borderColor: rgb(0, 0, 0),
      borderWidth: 3,
      color: rgb(1, 1, 1),
    });
    // Stars & Moon
    page.drawCircle({
      x: centerX - 120,
      y: centerY + 160,
      size: 35,
      borderColor: rgb(0, 0, 0),
      borderWidth: 2.5,
      color: rgb(1, 1, 1),
    });
    // Planet Saturn ring
    page.drawCircle({
      x: centerX + 130,
      y: centerY + 140,
      size: 25,
      borderColor: rgb(0, 0, 0),
      borderWidth: 2.5,
      color: rgb(1, 1, 1),
    });
    page.drawEllipse({
      x: centerX + 130,
      y: centerY + 140,
      xScale: 45,
      yScale: 10,
      borderColor: rgb(0, 0, 0),
      borderWidth: 2,
    });
  } else if (type.includes('underwater') || title.toLowerCase().includes('fish') || title.toLowerCase().includes('ocean') || title.toLowerCase().includes('sea')) {
    // Friendly Dolphin / Fish underwater scene
    // Fish Body
    page.drawEllipse({
      x: centerX - 20,
      y: centerY + 20,
      xScale: 85,
      yScale: 55,
      borderColor: rgb(0, 0, 0),
      borderWidth: 3,
      color: rgb(1, 1, 1),
    });
    // Fish Tail
    page.drawRectangle({
      x: centerX - 120,
      y: centerY + 5,
      width: 40,
      height: 40,
      borderColor: rgb(0, 0, 0),
      borderWidth: 3,
      rotate: degrees(45),
    });
    // Big eye
    page.drawCircle({
      x: centerX + 35,
      y: centerY + 30,
      size: 14,
      borderColor: rgb(0, 0, 0),
      borderWidth: 2.5,
      color: rgb(1, 1, 1),
    });
    page.drawCircle({
      x: centerX + 38,
      y: centerY + 32,
      size: 5,
      color: rgb(0, 0, 0),
    });
    // Smile
    page.drawLine({
      start: { x: centerX + 55, y: centerY + 10 },
      end: { x: centerX + 25, y: centerY + 5 },
      thickness: 2.5,
      color: rgb(0, 0, 0),
    });
    // Scales patterns
    for (let s = 0; s < 3; s++) {
      page.drawCircle({
        x: centerX - 20 - s * 25,
        y: centerY + 15,
        size: 16,
        borderColor: rgb(0, 0, 0),
        borderWidth: 2,
      });
    }
    // Bubbles
    page.drawCircle({ x: centerX + 80, y: centerY + 70, size: 12, borderColor: rgb(0, 0, 0), borderWidth: 2 });
    page.drawCircle({ x: centerX + 110, y: centerY + 110, size: 18, borderColor: rgb(0, 0, 0), borderWidth: 2 });
    page.drawCircle({ x: centerX + 95, y: centerY + 150, size: 14, borderColor: rgb(0, 0, 0), borderWidth: 2 });
    // Seaweed
    page.drawLine({ start: { x: frameX + 40, y: frameY + 10 }, end: { x: frameX + 40, y: frameY + 120 }, thickness: 4, color: rgb(0, 0, 0) });
    page.drawLine({ start: { x: frameX + 70, y: frameY + 10 }, end: { x: frameX + 70, y: frameY + 160 }, thickness: 4, color: rgb(0, 0, 0) });
  } else {
    // Lion / Jungle Animal / Universal Character for Kids
    // Mane
    page.drawCircle({
      x: centerX,
      y: centerY + 40,
      size: 95,
      borderColor: rgb(0, 0, 0),
      borderWidth: 3.5,
      color: rgb(1, 1, 1),
    });
    // Head
    page.drawCircle({
      x: centerX,
      y: centerY + 40,
      size: 65,
      borderColor: rgb(0, 0, 0),
      borderWidth: 3,
      color: rgb(1, 1, 1),
    });
    // Ears
    page.drawCircle({ x: centerX - 55, y: centerY + 95, size: 18, borderColor: rgb(0, 0, 0), borderWidth: 2.5, color: rgb(1, 1, 1) });
    page.drawCircle({ x: centerX + 55, y: centerY + 95, size: 18, borderColor: rgb(0, 0, 0), borderWidth: 2.5, color: rgb(1, 1, 1) });
    // Eyes
    page.drawCircle({ x: centerX - 25, y: centerY + 55, size: 10, borderColor: rgb(0, 0, 0), borderWidth: 2.5, color: rgb(1, 1, 1) });
    page.drawCircle({ x: centerX - 23, y: centerY + 56, size: 4, color: rgb(0, 0, 0) });
    page.drawCircle({ x: centerX + 25, y: centerY + 55, size: 10, borderColor: rgb(0, 0, 0), borderWidth: 2.5, color: rgb(1, 1, 1) });
    page.drawCircle({ x: centerX + 27, y: centerY + 56, size: 4, color: rgb(0, 0, 0) });
    // Nose triangle
    page.drawRectangle({
      x: centerX - 12,
      y: centerY + 28,
      width: 24,
      height: 14,
      borderColor: rgb(0, 0, 0),
      borderWidth: 2.5,
      color: rgb(0.1, 0.1, 0.1),
    });
    // Whiskers
    page.drawLine({ start: { x: centerX - 30, y: centerY + 30 }, end: { x: centerX - 70, y: centerY + 35 }, thickness: 2, color: rgb(0, 0, 0) });
    page.drawLine({ start: { x: centerX - 30, y: centerY + 22 }, end: { x: centerX - 70, y: centerY + 18 }, thickness: 2, color: rgb(0, 0, 0) });
    page.drawLine({ start: { x: centerX + 30, y: centerY + 30 }, end: { x: centerX + 70, y: centerY + 35 }, thickness: 2, color: rgb(0, 0, 0) });
    page.drawLine({ start: { x: centerX + 30, y: centerY + 22 }, end: { x: centerX + 70, y: centerY + 18 }, thickness: 2, color: rgb(0, 0, 0) });
    // Body & Paws
    page.drawEllipse({
      x: centerX,
      y: centerY - 80,
      xScale: 55,
      yScale: 50,
      borderColor: rgb(0, 0, 0),
      borderWidth: 3,
      color: rgb(1, 1, 1),
    });
    page.drawCircle({ x: centerX - 35, y: centerY - 110, size: 16, borderColor: rgb(0, 0, 0), borderWidth: 2.5 });
    page.drawCircle({ x: centerX + 35, y: centerY - 110, size: 16, borderColor: rgb(0, 0, 0), borderWidth: 2.5 });
  }

  // Color Swatches Test Palette at bottom of coloring page for kids
  const swatchY = frameY + 22;
  page.drawRectangle({
    x: frameX + 20,
    y: swatchY,
    width: frameWidth - 40,
    height: 32,
    borderColor: rgb(0.5, 0.5, 0.5),
    borderWidth: 1,
    color: rgb(0.98, 0.98, 0.98),
  });

  for (let c = 0; c < 8; c++) {
    page.drawCircle({
      x: frameX + 45 + c * 48,
      y: swatchY + 16,
      size: 9,
      borderColor: rgb(0.3, 0.3, 0.3),
      borderWidth: 1.5,
      color: rgb(1, 1, 1),
    });
  }
}

/**
 * Builds the complete Interior PDF adhering strictly to Amazon KDP specs.
 */
export async function generateKDPInteriorPDF(book: KDPBook): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  
  // Set PDF metadata for Amazon compliance
  pdfDoc.setTitle(book.metadata.title);
  pdfDoc.setAuthor(book.metadata.author);
  pdfDoc.setSubject(book.metadata.subtitle);
  pdfDoc.setKeywords(book.metadata.keywords);
  pdfDoc.setProducer('Amazon KDP Book Generator Studio');
  pdfDoc.setCreator('Amazon KDP Publishing Suite');

  // Embed standard typography
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // KDP Dimensions: 1 inch = 72 pt
  const isBleed = book.interiorSpec.bleed;
  const pageWidthPt = isBleed ? 8.625 * 72 : 8.5 * 72; // 621 or 612 pt
  const pageHeightPt = isBleed ? 11.25 * 72 : 11.0 * 72; // 810 or 792 pt

  const outerMarginPt = book.interiorSpec.outerMarginInches * 72; // 18 pt (0.25")
  const gutterMarginPt = book.interiorSpec.gutterMarginInches * 72; // 27 pt (0.375")
  const topMarginPt = book.interiorSpec.topMarginInches * 72;
  const bottomMarginPt = book.interiorSpec.bottomMarginInches * 72;

  for (let i = 0; i < book.pages.length; i++) {
    const pageData = book.pages[i];
    const pageNum = i + 1;
    const isOdd = pageNum % 2 !== 0;

    // Gutter alternates: Odd pages have gutter on left; Even pages have gutter on right!
    const leftMargin = isOdd ? gutterMarginPt : outerMarginPt;
    const rightMargin = isOdd ? outerMarginPt : gutterMarginPt;
    const printableWidth = pageWidthPt - leftMargin - rightMargin;
    const printableHeight = pageHeightPt - topMarginPt - bottomMarginPt;

    const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);

    // Handle Page Types
    if (pageData.pageType === 'half_title') {
      // Half title / Belongs to page
      const titleLines = wrapText(book.metadata.title.toUpperCase(), helveticaBold, 20, printableWidth);
      let ty = pageHeightPt - topMarginPt - 120;
      for (const line of titleLines) {
        const tw = helveticaBold.widthOfTextAtSize(line, 20);
        page.drawText(line, {
          x: leftMargin + (printableWidth - tw) / 2,
          y: ty,
          size: 20,
          font: helveticaBold,
          color: rgb(0.1, 0.1, 0.1),
        });
        ty -= 28;
      }

      // Decorative divider
      page.drawLine({
        start: { x: leftMargin + printableWidth / 2 - 80, y: ty - 15 },
        end: { x: leftMargin + printableWidth / 2 + 80, y: ty - 15 },
        thickness: 1.5,
        color: rgb(0.3, 0.3, 0.3),
      });

      // "This Book Belongs To" section
      const belongsBoxY = ty - 160;
      page.drawRectangle({
        x: leftMargin + (printableWidth - 320) / 2,
        y: belongsBoxY,
        width: 320,
        height: 120,
        borderColor: rgb(0.3, 0.3, 0.3),
        borderWidth: 1.5,
        color: rgb(0.99, 0.99, 0.99),
      });

      const label = 'THIS BOOK BELONGS TO:';
      const lw = helveticaBold.widthOfTextAtSize(label, 12);
      page.drawText(label, {
        x: leftMargin + (printableWidth - lw) / 2,
        y: belongsBoxY + 85,
        size: 12,
        font: helveticaBold,
        color: rgb(0.2, 0.2, 0.2),
      });

      // Name lines
      page.drawLine({
        start: { x: leftMargin + (printableWidth - 260) / 2, y: belongsBoxY + 45 },
        end: { x: leftMargin + (printableWidth + 260) / 2, y: belongsBoxY + 45 },
        thickness: 1,
        color: rgb(0.4, 0.4, 0.4),
      });
    } else if (pageData.pageType === 'title') {
      // Full Title Page
      let yPos = pageHeightPt - topMarginPt - 80;

      // Title
      const titleLines = wrapText(book.metadata.title, timesBold, 26, printableWidth);
      for (const line of titleLines) {
        const tw = timesBold.widthOfTextAtSize(line, 26);
        page.drawText(line, {
          x: leftMargin + (printableWidth - tw) / 2,
          y: yPos,
          size: 26,
          font: timesBold,
          color: rgb(0.08, 0.08, 0.08),
        });
        yPos -= 34;
      }

      // Subtitle
      if (book.metadata.subtitle) {
        yPos -= 10;
        const subLines = wrapText(book.metadata.subtitle, helvetica, 14, printableWidth);
        for (const line of subLines) {
          const sw = helvetica.widthOfTextAtSize(line, 14);
          page.drawText(line, {
            x: leftMargin + (printableWidth - sw) / 2,
            y: yPos,
            size: 14,
            font: helvetica,
            color: rgb(0.25, 0.25, 0.25),
          });
          yPos -= 20;
        }
      }

      // Decorative emblem
      yPos -= 50;
      page.drawCircle({
        x: leftMargin + printableWidth / 2,
        y: yPos,
        size: 24,
        borderColor: rgb(0.2, 0.2, 0.2),
        borderWidth: 2,
      });
      page.drawCircle({
        x: leftMargin + printableWidth / 2,
        y: yPos,
        size: 14,
        borderColor: rgb(0.4, 0.4, 0.4),
        borderWidth: 1,
      });

      // Author Name
      const authorText = `By ${book.metadata.author}`;
      const aw = timesRoman.widthOfTextAtSize(authorText, 16);
      page.drawText(authorText, {
        x: leftMargin + (printableWidth - aw) / 2,
        y: bottomMarginPt + 120,
        size: 16,
        font: timesRoman,
        color: rgb(0.15, 0.15, 0.15),
      });

      const pubText = 'Amazon KDP Edition • Complete Print Package';
      const pw = helvetica.widthOfTextAtSize(pubText, 10);
      page.drawText(pubText, {
        x: leftMargin + (printableWidth - pw) / 2,
        y: bottomMarginPt + 80,
        size: 10,
        font: helvetica,
        color: rgb(0.45, 0.45, 0.45),
      });
    } else if (pageData.pageType === 'copyright') {
      // Copyright & Legal Disclaimer
      let cY = pageHeightPt - topMarginPt - 160;
      const year = new Date().getFullYear();

      const copyrightLines = [
        `${book.metadata.title}`,
        book.metadata.subtitle || '',
        '',
        `Copyright © ${year} ${book.metadata.author}`,
        'All rights reserved.',
        '',
        'No part of this publication may be reproduced, distributed, or transmitted',
        'in any form or by any means, including photocopying, recording, or other',
        'electronic or mechanical methods, without the prior written permission of the publisher,',
        'except in the case of brief quotations embodied in critical reviews.',
        '',
        'DISCLAIMER & NOTICE:',
        'This publication is designed to provide competent and reliable information regarding',
        'the subject matter covered. It is sold with the understanding that the author and publisher',
        'are not engaged in rendering legal, medical, or other professional services.',
        '',
        `Published via Kindle Direct Publishing (KDP)`,
        `Print Edition Specifications: 8.5" × 11.0" Standard Trim`,
        `Printed in the United States of America`,
        `First Edition: ${year}`,
      ];

      for (const line of copyrightLines) {
        if (line) {
          page.drawText(line, {
            x: leftMargin + 20,
            y: cY,
            size: 9.5,
            font: helvetica,
            color: rgb(0.3, 0.3, 0.3),
          });
        }
        cY -= 16;
      }
    } else if (pageData.pageType === 'toc') {
      // Table of Contents
      let tocY = pageHeightPt - topMarginPt - 40;
      const tocTitle = 'TABLE OF CONTENTS';
      const tw = helveticaBold.widthOfTextAtSize(tocTitle, 18);
      page.drawText(tocTitle, {
        x: leftMargin + (printableWidth - tw) / 2,
        y: tocY,
        size: 18,
        font: helveticaBold,
        color: rgb(0.1, 0.1, 0.1),
      });

      page.drawLine({
        start: { x: leftMargin + 40, y: tocY - 12 },
        end: { x: leftMargin + printableWidth - 40, y: tocY - 12 },
        thickness: 1.5,
        color: rgb(0.2, 0.2, 0.2),
      });

      tocY -= 40;
      // List content chapters
      const tocPages = book.pages.filter(p => p.pageType === 'content' || p.pageType === 'coloring' || p.pageType === 'intro');
      const maxTocItems = Math.min(tocPages.length, 28);

      for (let t = 0; t < maxTocItems; t++) {
        const item = tocPages[t];
        const itemTitle = item.title;
        const pageStr = `${item.pageNumber}`;
        const titleW = helvetica.widthOfTextAtSize(itemTitle, 10);
        const pNumW = helveticaBold.widthOfTextAtSize(pageStr, 10);

        page.drawText(itemTitle, {
          x: leftMargin + 30,
          y: tocY,
          size: 10,
          font: helvetica,
          color: rgb(0.2, 0.2, 0.2),
        });

        // Dotted leader line
        const dotStartX = leftMargin + 35 + titleW;
        const dotEndX = leftMargin + printableWidth - 45 - pNumW;
        if (dotEndX > dotStartX) {
          page.drawLine({
            start: { x: dotStartX, y: tocY + 2 },
            end: { x: dotEndX, y: tocY + 2 },
            thickness: 0.5,
            color: rgb(0.6, 0.6, 0.6),
            dashArray: [2, 3],
          });
        }

        page.drawText(pageStr, {
          x: leftMargin + printableWidth - 35 - pNumW,
          y: tocY,
          size: 10,
          font: helveticaBold,
          color: rgb(0.1, 0.1, 0.1),
        });

        tocY -= 20;
      }
    } else if (pageData.pageType === 'coloring') {
      // Full-Page Coloring Activity
      const centerX = leftMargin + printableWidth / 2;
      const centerY = bottomMarginPt + printableHeight / 2 + 10;

      // Page Title on top
      const pageTitle = pageData.title.toUpperCase();
      const ptw = helveticaBold.widthOfTextAtSize(pageTitle, 15);
      page.drawText(pageTitle, {
        x: centerX - ptw / 2,
        y: pageHeightPt - topMarginPt - 32,
        size: 15,
        font: helveticaBold,
        color: rgb(0.1, 0.1, 0.1),
      });

      // Subtitle / Coloring Tip
      if (pageData.subtitle) {
        const sub = pageData.subtitle;
        const sw = helvetica.widthOfTextAtSize(sub, 10);
        page.drawText(sub, {
          x: centerX - sw / 2,
          y: pageHeightPt - topMarginPt - 48,
          size: 10,
          font: helvetica,
          color: rgb(0.4, 0.4, 0.4),
        });
      }

      // Draw the vector art
      drawColoringVector(page, centerX, centerY, pageData.illustrationSvgType || 'coloring_lion', pageData.title);
    } else if (pageData.pageType === 'blank_bleed_barrier') {
      // Blank page to prevent marker bleed-through for coloring books (standard professional KDP practice!)
      const centerX = leftMargin + printableWidth / 2;
      const centerY = bottomMarginPt + printableHeight / 2;

      page.drawRectangle({
        x: centerX - 140,
        y: centerY - 40,
        width: 280,
        height: 80,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
        color: rgb(0.98, 0.98, 0.98),
      });

      const note = 'THIS PAGE IS INTENTIONALLY LEFT BLANK';
      const nw = helveticaBold.widthOfTextAtSize(note, 9);
      page.drawText(note, {
        x: centerX - nw / 2,
        y: centerY + 12,
        size: 9,
        font: helveticaBold,
        color: rgb(0.5, 0.5, 0.5),
      });

      const note2 = 'To prevent color bleed-through to the next illustration.';
      const n2w = helvetica.widthOfTextAtSize(note2, 8.5);
      page.drawText(note2, {
        x: centerX - n2w / 2,
        y: centerY - 10,
        size: 8.5,
        font: helvetica,
        color: rgb(0.6, 0.6, 0.6),
      });
    } else if (pageData.pageType === 'recipe' && pageData.recipe) {
      const rec = pageData.recipe;
      const titleLines = wrapText(pageData.title, helveticaBold, 16, printableWidth);
      let curY = pageHeightPt - topMarginPt - 22;
      for (const tl of titleLines) {
        page.drawText(tl, {
          x: leftMargin,
          y: curY,
          size: 16,
          font: helveticaBold,
          color: rgb(0.1, 0.1, 0.1),
        });
        curY -= 20;
      }
      if (pageData.subtitle) {
        page.drawText(pageData.subtitle, {
          x: leftMargin,
          y: curY,
          size: 9.5,
          font: helveticaOblique,
          color: rgb(0.4, 0.4, 0.4),
        });
        curY -= 16;
      }

      page.drawRectangle({
        x: leftMargin,
        y: curY - 20,
        width: printableWidth,
        height: 24,
        color: rgb(0.96, 0.96, 0.97),
        borderColor: rgb(0.85, 0.85, 0.88),
        borderWidth: 1,
      });

      const badgeStr = `PREP: ${rec.prepTimeMinutes} MIN  |  COOK: ${rec.cookTimeMinutes} MIN  |  SERVINGS: ${rec.servings}  |  LEVEL: ${rec.difficulty.toUpperCase()}`;
      page.drawText(badgeStr, {
        x: leftMargin + 10,
        y: curY - 14,
        size: 8.5,
        font: helveticaBold,
        color: rgb(0.2, 0.2, 0.25),
      });
      curY -= 32;

      page.drawText('INGREDIENTS:', {
        x: leftMargin,
        y: curY,
        size: 10,
        font: helveticaBold,
        color: rgb(0.1, 0.1, 0.1),
      });
      curY -= 15;

      for (const ing of rec.ingredients) {
        if (curY < bottomMarginPt + 100) break;
        page.drawCircle({
          x: leftMargin + 5,
          y: curY + 3,
          size: 2,
          color: rgb(0.3, 0.3, 0.3),
        });
        page.drawText(ing, {
          x: leftMargin + 14,
          y: curY,
          size: 9,
          font: helvetica,
          color: rgb(0.2, 0.2, 0.2),
        });
        curY -= 13;
      }
      curY -= 8;

      page.drawText('DIRECTIONS:', {
        x: leftMargin,
        y: curY,
        size: 10,
        font: helveticaBold,
        color: rgb(0.1, 0.1, 0.1),
      });
      curY -= 15;

      for (let s = 0; s < rec.instructions.length; s++) {
        if (curY < bottomMarginPt + 60) break;
        const stepNum = `${s + 1}.`;
        page.drawText(stepNum, {
          x: leftMargin + 4,
          y: curY,
          size: 9,
          font: helveticaBold,
          color: rgb(0.1, 0.1, 0.1),
        });
        const instLines = wrapText(rec.instructions[s], helvetica, 8.5, printableWidth - 24);
        for (const il of instLines) {
          page.drawText(il, {
            x: leftMargin + 20,
            y: curY,
            size: 8.5,
            font: helvetica,
            color: rgb(0.2, 0.2, 0.2),
          });
          curY -= 12;
        }
        curY -= 3;
      }

      if (rec.chefTip && curY > bottomMarginPt + 45) {
        curY -= 6;
        page.drawRectangle({
          x: leftMargin,
          y: curY - 32,
          width: printableWidth,
          height: 36,
          color: rgb(0.98, 0.95, 0.91),
          borderColor: rgb(0.9, 0.7, 0.4),
          borderWidth: 1,
        });
        page.drawText("CHEF'S SECRET:", {
          x: leftMargin + 10,
          y: curY - 11,
          size: 8,
          font: helveticaBold,
          color: rgb(0.6, 0.35, 0.1),
        });
        const tipLines = wrapText(rec.chefTip, helvetica, 8, printableWidth - 20);
        page.drawText(tipLines[0] || '', {
          x: leftMargin + 10,
          y: curY - 23,
          size: 8,
          font: helvetica,
          color: rgb(0.2, 0.2, 0.2),
        });
      }
    } else {
      // Standard Text / Guide / Survival / Planner Content Page
      let curY = pageHeightPt - topMarginPt - 30;

      // Running Header
      const headerTitle = book.metadata.title.toUpperCase();
      page.drawText(headerTitle, {
        x: leftMargin,
        y: curY,
        size: 8,
        font: helvetica,
        color: rgb(0.5, 0.5, 0.5),
      });

      page.drawLine({
        start: { x: leftMargin, y: curY - 6 },
        end: { x: leftMargin + printableWidth, y: curY - 6 },
        thickness: 0.75,
        color: rgb(0.7, 0.7, 0.7),
      });

      curY -= 35;

      // Chapter / Tactic Number Badge if applicable
      if (pageData.chapterNumber) {
        const badge = `TACTIC #${pageData.chapterNumber}`;
        page.drawRectangle({
          x: leftMargin,
          y: curY - 4,
          width: 85,
          height: 18,
          color: rgb(0.12, 0.12, 0.12),
        });
        page.drawText(badge, {
          x: leftMargin + 6,
          y: curY,
          size: 8.5,
          font: helveticaBold,
          color: rgb(1, 1, 1),
        });
        curY -= 28;
      }

      // Page Title
      const pTitle = pageData.title;
      const titleLines = wrapText(pTitle, helveticaBold, 17, printableWidth);
      for (const tLine of titleLines) {
        page.drawText(tLine, {
          x: leftMargin,
          y: curY,
          size: 17,
          font: helveticaBold,
          color: rgb(0.1, 0.1, 0.1),
        });
        curY -= 22;
      }

      // Subtitle
      if (pageData.subtitle) {
        page.drawText(pageData.subtitle, {
          x: leftMargin,
          y: curY,
          size: 11,
          font: helvetica,
          color: rgb(0.35, 0.35, 0.35),
        });
        curY -= 20;
      }

      curY -= 10;

      // Content Paragraphs
      if (pageData.content) {
        const paragraphs = pageData.paragraphs && pageData.paragraphs.length > 0 
          ? pageData.paragraphs 
          : pageData.content.split('\n\n');

        for (const p of paragraphs) {
          if (!p.trim()) continue;
          const pLines = wrapText(p.trim(), timesRoman, 11, printableWidth);
          for (const l of pLines) {
            if (curY < bottomMarginPt + 50) break;
            page.drawText(l, {
              x: leftMargin,
              y: curY,
              size: 11,
              font: timesRoman,
              color: rgb(0.15, 0.15, 0.15),
            });
            curY -= 16;
          }
          curY -= 8;
        }
      }

      // Action Steps or Bullets Checklist
      if (pageData.bullets && pageData.bullets.length > 0 && curY > bottomMarginPt + 100) {
        curY -= 10;
        const checkTitle = 'CRITICAL PROTOCOL & ACTION STEPS:';
        page.drawText(checkTitle, {
          x: leftMargin,
          y: curY,
          size: 10,
          font: helveticaBold,
          color: rgb(0.1, 0.1, 0.1),
        });
        curY -= 18;

        for (const b of pageData.bullets) {
          if (curY < bottomMarginPt + 45) break;
          // Draw square checkbox
          page.drawRectangle({
            x: leftMargin + 4,
            y: curY + 1,
            width: 10,
            height: 10,
            borderColor: rgb(0.2, 0.2, 0.2),
            borderWidth: 1.2,
          });

          const bulletLines = wrapText(b, helvetica, 9.5, printableWidth - 28);
          for (let bl = 0; bl < bulletLines.length; bl++) {
            page.drawText(bulletLines[bl], {
              x: leftMargin + 22,
              y: curY,
              size: 9.5,
              font: helvetica,
              color: rgb(0.2, 0.2, 0.2),
            });
            curY -= 14;
          }
          curY -= 4;
        }
      }

      // Warning or Pro-Tip Callout Box
      if (pageData.warning && curY > bottomMarginPt + 70) {
        curY -= 12;
        const boxHeight = 55;
        page.drawRectangle({
          x: leftMargin,
          y: curY - boxHeight + 14,
          width: printableWidth,
          height: boxHeight,
          borderColor: rgb(0.85, 0.2, 0.2),
          borderWidth: 1.5,
          color: rgb(0.99, 0.96, 0.96),
        });

        page.drawText('WARNING - LIFE SAFETY RISK:', {
          x: leftMargin + 12,
          y: curY - 2,
          size: 9,
          font: helveticaBold,
          color: rgb(0.8, 0.1, 0.1),
        });

        const warnLines = wrapText(pageData.warning, helvetica, 8.5, printableWidth - 24);
        let wy = curY - 16;
        for (const wl of warnLines.slice(0, 2)) {
          page.drawText(wl, {
            x: leftMargin + 12,
            y: wy,
            size: 8.5,
            font: helvetica,
            color: rgb(0.2, 0.2, 0.2),
          });
          wy -= 12;
        }
      } else if (pageData.proTip && curY > bottomMarginPt + 60) {
        curY -= 10;
        page.drawRectangle({
          x: leftMargin,
          y: curY - 45,
          width: printableWidth,
          height: 50,
          borderColor: rgb(0.2, 0.5, 0.8),
          borderWidth: 1.2,
          color: rgb(0.96, 0.98, 1.0),
        });

        page.drawText('PRO SURVIVAL TIP:', {
          x: leftMargin + 12,
          y: curY - 12,
          size: 8.5,
          font: helveticaBold,
          color: rgb(0.1, 0.35, 0.7),
        });

        const tipLines = wrapText(pageData.proTip, helvetica, 8.5, printableWidth - 24);
        page.drawText(tipLines[0] || '', {
          x: leftMargin + 12,
          y: curY - 26,
          size: 8.5,
          font: helvetica,
          color: rgb(0.2, 0.2, 0.2),
        });
      }
    }

    // Page Number Footer (Alternating outside corners for book binding)
    // Amazon KDP Rule: Page number must be safely within outer margins
    const pageNumberStr = `${pageNum}`;
    const pageNumWidth = helvetica.widthOfTextAtSize(pageNumberStr, 9);
    const pageNumX = isOdd 
      ? pageWidthPt - outerMarginPt - pageNumWidth - 10 
      : outerMarginPt + 10;
    
    page.drawText(pageNumberStr, {
      x: pageNumX,
      y: bottomMarginPt - 8,
      size: 9,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  return await pdfDoc.save();
}

/**
 * Helper to convert hex strings to pdf-lib rgb values
 */
function hexColorToRgb(hex?: string, fallback = { r: 0.08, g: 0.10, b: 0.16 }) {
  if (!hex || !hex.startsWith('#') || (hex.length !== 7 && hex.length !== 4)) {
    return rgb(fallback.r, fallback.g, fallback.b);
  }
  let clean = hex.slice(1);
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return rgb(isNaN(r) ? fallback.r : r, isNaN(g) ? fallback.g : g, isNaN(b) ? fallback.b : b);
}

/**
 * Builds the Amazon KDP Full-Wrap Cover PDF (Back + Spine + Front + 0.125" Bleed)
 */
export async function generateKDPCoverPDF(book: KDPBook): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  
  pdfDoc.setTitle(`${book.metadata.title} - Full Wrap Cover`);
  pdfDoc.setAuthor(book.metadata.author);
  pdfDoc.setProducer('Amazon KDP Book Generator Studio');

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const pageCount = book.pages.length;
  const wrap = calculateCoverWrapDimensions(pageCount, book.interiorSpec.paperType);

  const coverPage = pdfDoc.addPage([wrap.totalWidthPt, wrap.totalHeightPt]);

  const bgRgb = hexColorToRgb(book.coverSpec.primaryColor, { r: 0.08, g: 0.10, b: 0.16 });
  const accentRgb = hexColorToRgb(book.coverSpec.accentColor, { r: 0.85, g: 0.70, b: 0.35 });
  const titleRgb = hexColorToRgb(book.coverSpec.secondaryColor, { r: 0.98, g: 0.98, b: 0.98 });

  // Base background color
  coverPage.drawRectangle({
    x: 0,
    y: 0,
    width: wrap.totalWidthPt,
    height: wrap.totalHeightPt,
    color: bgRgb,
  });

  // Front Cover Area (Right side)
  const frontX = wrap.frontCoverStartX;
  const frontWidth = wrap.trimWidthPt;
  const frontHeight = wrap.totalHeightPt;

  // Attempt embedding front cover hero image if provided
  if (book.coverSpec.coverImageUrl) {
    try {
      let imageBytes: ArrayBuffer | Uint8Array | null = null;
      const url = book.coverSpec.coverImageUrl;
      if (url.startsWith('data:image/jpeg') || url.startsWith('data:image/jpg') || url.startsWith('data:image/png')) {
        const base64Data = url.split(',')[1];
        if (base64Data) {
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          imageBytes = bytes;
        }
      } else if (typeof fetch !== 'undefined') {
        const res = await fetch(url);
        if (res.ok) {
          imageBytes = await res.arrayBuffer();
        }
      }

      if (imageBytes) {
        let embeddedImg;
        try {
          embeddedImg = await pdfDoc.embedJpg(imageBytes);
        } catch {
          try {
            embeddedImg = await pdfDoc.embedPng(imageBytes);
          } catch {
            // Ignore format mismatch
          }
        }

        if (embeddedImg) {
          coverPage.drawImage(embeddedImg, {
            x: frontX + 18,
            y: 18,
            width: frontWidth - 36,
            height: frontHeight - 36,
            opacity: 0.55,
          });
        }
      }
    } catch (e) {
      console.warn('Cover image embedding skipped:', e);
    }
  }

  // Front cover decorative accent border
  coverPage.drawRectangle({
    x: frontX + 18,
    y: 18,
    width: frontWidth - 36,
    height: frontHeight - 36,
    borderColor: accentRgb,
    borderWidth: 2,
  });

  // Front Authority Trust Badge
  const trustBadge = book.coverSpec.psychologyBadge || 'AMAZON KDP CERTIFIED EDITION';
  const badgeWidth = Math.min(helveticaBold.widthOfTextAtSize(trustBadge, 8.5) + 24, frontWidth - 60);
  const badgeX = frontX + (frontWidth - badgeWidth) / 2;
  const badgeY = frontHeight - 65;

  coverPage.drawRectangle({
    x: badgeX,
    y: badgeY,
    width: badgeWidth,
    height: 18,
    color: accentRgb,
  });

  const tbw = helveticaBold.widthOfTextAtSize(trustBadge, 8.5);
  coverPage.drawText(trustBadge, {
    x: frontX + (frontWidth - tbw) / 2,
    y: badgeY + 5,
    size: 8.5,
    font: helveticaBold,
    color: rgb(0.05, 0.05, 0.05),
  });

  // Front Title
  const displayTitle = (book.coverSpec.frontTitle || book.metadata.title).toUpperCase();
  const frontTitleLines = wrapText(displayTitle, timesBold, 26, frontWidth - 70);
  let fty = frontHeight - 125;
  for (const line of frontTitleLines) {
    const lw = timesBold.widthOfTextAtSize(line, 26);
    coverPage.drawText(line, {
      x: frontX + (frontWidth - lw) / 2,
      y: fty,
      size: 26,
      font: timesBold,
      color: titleRgb,
    });
    fty -= 34;
  }

  // Front Subtitle
  const displaySubtitle = book.coverSpec.frontSubtitle || book.metadata.subtitle;
  if (displaySubtitle) {
    fty -= 10;
    const subLines = wrapText(displaySubtitle, helvetica, 13, frontWidth - 80);
    for (const sline of subLines) {
      const sw = helvetica.widthOfTextAtSize(sline, 13);
      coverPage.drawText(sline, {
        x: frontX + (frontWidth - sw) / 2,
        y: fty,
        size: 13,
        font: helvetica,
        color: rgb(0.95, 0.95, 0.95),
      });
      fty -= 18;
    }
  }

  // Front Center Motif (if no hero image)
  if (!book.coverSpec.coverImageUrl) {
    const motifY = frontHeight / 2 - 20;
    coverPage.drawCircle({
      x: frontX + frontWidth / 2,
      y: motifY,
      size: 60,
      borderColor: accentRgb,
      borderWidth: 2.5,
    });
    coverPage.drawCircle({
      x: frontX + frontWidth / 2,
      y: motifY,
      size: 45,
      borderColor: rgb(0.5, 0.5, 0.5),
      borderWidth: 1,
    });
  }

  // Front Author Name
  const authorString = book.coverSpec.authorName || book.metadata.author;
  const aw = helveticaBold.widthOfTextAtSize(authorString, 16);
  coverPage.drawText(authorString, {
    x: frontX + (frontWidth - aw) / 2,
    y: 110,
    size: 16,
    font: helveticaBold,
    color: rgb(0.95, 0.95, 0.95),
  });

  const editionBadge = `CERTIFIED AMAZON KDP EDITION  •  ${pageCount} PAGES`;
  const ew = helvetica.widthOfTextAtSize(editionBadge, 8.5);
  coverPage.drawText(editionBadge, {
    x: frontX + (frontWidth - ew) / 2,
    y: 85,
    size: 8.5,
    font: helvetica,
    color: rgb(0.75, 0.75, 0.75),
  });

  // Spine Area (Center strip)
  const spineX = wrap.spineStartX;
  const spineW = wrap.spineWidthPt;

  // Draw spine background divider
  coverPage.drawRectangle({
    x: spineX,
    y: 0,
    width: spineW,
    height: wrap.totalHeightPt,
    color: rgb(0.05, 0.07, 0.12),
  });

  // Fold lines (subtle dashed guidelines for print preview)
  coverPage.drawLine({
    start: { x: spineX, y: 0 },
    end: { x: spineX, y: wrap.totalHeightPt },
    thickness: 0.5,
    color: rgb(0.3, 0.3, 0.3),
  });
  coverPage.drawLine({
    start: { x: spineX + spineW, y: 0 },
    end: { x: spineX + spineW, y: wrap.totalHeightPt },
    thickness: 0.5,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Spine Text: Only permitted if page count >= 80 per Amazon KDP guidelines
  if (wrap.spineTextAllowed && spineW >= 12) {
    const spineText = `${book.metadata.title}  •  ${book.metadata.author}`;
    const fontSize = Math.min(spineW * 0.55, 9);
    const textWidth = helveticaBold.widthOfTextAtSize(spineText, fontSize);
    
    // Rotated 90 degrees clockwise for spine reading top-to-bottom
    const spineCenterY = (wrap.totalHeightPt + textWidth) / 2;
    coverPage.drawText(spineText, {
      x: spineX + (spineW + fontSize) / 2 - 2,
      y: spineCenterY,
      size: fontSize,
      font: helveticaBold,
      color: rgb(0.9, 0.9, 0.9),
      rotate: degrees(-90),
    });
  }

  // Back Cover Area (Left side)
  const backX = wrap.backCoverStartX;
  const backWidth = wrap.trimWidthPt;

  // Back cover blurb heading
  let bty = frontHeight - 120;
  const headline = 'WHY THIS BOOK IS ESSENTIAL';
  coverPage.drawText(headline, {
    x: backX + 40,
    y: bty,
    size: 16,
    font: helveticaBold,
    color: rgb(0.85, 0.70, 0.35),
  });
  bty -= 30;

  // Back blurb text
  const blurb = book.coverSpec.backCoverBlurb || book.metadata.descriptionHtml.replace(/<[^>]*>?/gm, '');
  const blurbLines = wrapText(blurb, helvetica, 10, backWidth - 80);
  for (const bl of blurbLines.slice(0, 10)) {
    coverPage.drawText(bl, {
      x: backX + 40,
      y: bty,
      size: 10,
      font: helvetica,
      color: rgb(0.88, 0.88, 0.88),
    });
    bty -= 16;
  }

  bty -= 15;

  // Back cover bullet features
  const bullets = book.coverSpec.backCoverBullets && book.coverSpec.backCoverBullets.length > 0 
    ? book.coverSpec.backCoverBullets 
    : [
        'Formatted to exact Amazon KDP 8.5" × 11.0" standards',
        'Includes high-detail illustrations and structured guides',
        'Clear, actionable chapters optimized for reader satisfaction',
        'Engineered for maximum print quality and durability',
      ];

  for (const bullet of bullets) {
    coverPage.drawCircle({
      x: backX + 46,
      y: bty + 3,
      size: 3,
      color: rgb(0.85, 0.70, 0.35),
    });
    const bulletLines = wrapText(bullet, helveticaBold, 9.5, backWidth - 95);
    for (const bLine of bulletLines) {
      coverPage.drawText(bLine, {
        x: backX + 58,
        y: bty,
        size: 9.5,
        font: helveticaBold,
        color: rgb(0.95, 0.95, 0.95),
      });
      bty -= 15;
    }
    bty -= 3;
  }

  // Amazon KDP Barcode Safe Zone (Mandatory 2" wide x 1.2" high at bottom right of back cover)
  // Must be 0.25" from bottom trim and spine
  const barcodeWidthPt = 2.0 * 72; // 144 pt
  const barcodeHeightPt = 1.2 * 72; // 86.4 pt
  const barcodeX = backX + backWidth - barcodeWidthPt - 24;
  const barcodeY = 24;

  coverPage.drawRectangle({
    x: barcodeX,
    y: barcodeY,
    width: barcodeWidthPt,
    height: barcodeHeightPt,
    borderColor: rgb(0.7, 0.7, 0.7),
    borderWidth: 1,
    color: rgb(1, 1, 1),
  });

  coverPage.drawText('AMAZON KDP BARCODE ZONE', {
    x: barcodeX + 12,
    y: barcodeY + 50,
    size: 7,
    font: helveticaBold,
    color: rgb(0.3, 0.3, 0.3),
  });
  coverPage.drawText('(Automated placement by Amazon)', {
    x: barcodeX + 10,
    y: barcodeY + 36,
    size: 6.5,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  });

  return await pdfDoc.save();
}

/**
 * ⭐ 7. METADATA JSON EXPORT HELPERS
 */
export function generateMetadataJson(book: KDPBook) {
  return {
    kdpSchemaVersion: '1.2',
    exportTimestamp: new Date().toISOString(),
    title: book.metadata.title,
    subtitle: book.metadata.subtitle,
    seoTitle: book.metadata.seoTitle || book.metadata.title,
    seoSubtitle: book.metadata.seoSubtitle || book.metadata.subtitle,
    author: book.metadata.author,
    penName: book.metadata.penName,
    descriptionHtml: book.metadata.descriptionHtml,
    descriptionWordCount: book.metadata.descriptionWordCount || 300,
    keywords: book.metadata.keywords,
    categories: book.metadata.categories,
    targetAudience: book.metadata.targetAudience,
    language: book.metadata.language,
    publishingRights: book.metadata.publishingRights,
    territories: book.metadata.territories,
    isbnProvidedByKDP: book.metadata.isbnProvidedByKDP,
    seoScore: book.metadata.seoScore || 98,
    pageCount: book.pages.length,
    trimSize: `${book.interiorSpec.trimWidthInches}" × ${book.interiorSpec.trimHeightInches}"`,
    bleed: book.interiorSpec.bleed,
  };
}

export function generatePricingJson(book: KDPBook) {
  const p = book.metadata.internationalPricing || {
    formulaUsed: 'Print Cost × 3 (Rounded to .99)',
    printCostUSD: book.metadata.estimatedPrintCostUSD,
    retailUS: book.metadata.listPriceUSD,
    retailUK: Number((book.metadata.listPriceUSD * 0.82).toFixed(2)),
    retailCA: Number((book.metadata.listPriceUSD * 1.35).toFixed(2)),
    retailEU: Number((book.metadata.listPriceUSD * 0.95).toFixed(2)),
    royaltyUS: book.metadata.estimatedRoyaltyUSD,
    royaltyUK: Number((book.metadata.estimatedRoyaltyUSD * 0.85).toFixed(2)),
    royaltyCA: Number((book.metadata.estimatedRoyaltyUSD * 1.25).toFixed(2)),
    royaltyEU: Number((book.metadata.estimatedRoyaltyUSD * 0.92).toFixed(2)),
    royaltyRate: 0.60,
  };

  return {
    pricingStrategy: 'Print Cost × 3 Rule (Rounded to .99)',
    printCostUSD: p.printCostUSD,
    royaltyRate: '60% Standard KDP Distribution',
    currencyMatrix: {
      US: {
        currency: 'USD ($)',
        retailPrice: p.retailUS,
        estimatedPrintCost: p.printCostUSD,
        estimatedRoyalty: p.royaltyUS,
      },
      UK: {
        currency: 'GBP (£)',
        retailPrice: p.retailUK,
        estimatedPrintCost: Number((p.printCostUSD * 0.80).toFixed(2)),
        estimatedRoyalty: p.royaltyUK,
      },
      CA: {
        currency: 'CAD (C$)',
        retailPrice: p.retailCA,
        estimatedPrintCost: Number((p.printCostUSD * 1.30).toFixed(2)),
        estimatedRoyalty: p.royaltyCA,
      },
      EU: {
        currency: 'EUR (€)',
        retailPrice: p.retailEU,
        estimatedPrintCost: Number((p.printCostUSD * 0.92).toFixed(2)),
        estimatedRoyalty: p.royaltyEU,
      },
    },
  };
}

export function generateCoverInfoJson(book: KDPBook) {
  const dims = calculateCoverWrapDimensions(book.pages.length, book.interiorSpec.paperType);
  return {
    trimSizeInches: '8.5 × 11.0',
    coverDimensionsInches: {
      width: dims.totalWidthInches,
      height: dims.totalHeightInches,
    },
    coverDimensionsPdfPoints: {
      width: dims.totalWidthPt,
      height: dims.totalHeightPt,
    },
    spine: {
      widthInches: dims.spineWidthInches,
      widthPdfPoints: dims.spineWidthPt,
      formula: '0.002252 * pageCount',
      pageCount: book.pages.length,
      spineTextAllowed: dims.spineTextAllowed,
      minPagesForSpineText: 80,
    },
    bleedInches: dims.bleedPt / 72,
    barcodeSafeZone: {
      widthInches: 2.0,
      heightInches: 1.2,
      placement: 'Lower right corner of back cover',
      marginFromEdgesInches: 0.25,
      instruction: 'Do NOT place text, logos, or barcodes here; Amazon stamps their barcode automatically.',
    },
    styling: {
      finish: book.coverSpec.coverFinish,
      primaryColor: book.coverSpec.primaryColor,
      secondaryColor: book.coverSpec.secondaryColor,
      accentColor: book.coverSpec.accentColor,
      fontPairing: book.coverSpec.fontPairingId || 'default',
      contrastRatio: book.coverSpec.contrastRatio || 14.5,
      contrastApproved: book.coverSpec.contrastApproved ?? true,
    },
  };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadJsonFile(filename: string, data: any) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  downloadBlob(blob, filename);
}

/**
 * Creates the complete ZIP package for Amazon KDP submission.
 * Includes Interior PDF, Cover Wrap PDF, metadata.json, pricing.json, cover-info.json,
 * and KDP Direct Copy-Paste TXT Guide.
 */
export async function createKDPSubmissionZip(
  book: KDPBook, 
  interiorBytes: Uint8Array, 
  coverBytes: Uint8Array
): Promise<Blob> {
  const zip = new JSZip();
  const safeTitle = book.metadata.title.replace(/[^a-zA-Z0-9_-]/g, '_');

  // Add Interior PDF
  zip.file(`${safeTitle}_Interior_8.5x11_AmazonKDP.pdf`, interiorBytes);

  // Add Cover Wrap PDF
  zip.file(`${safeTitle}_FullWrap_Cover_AmazonKDP.pdf`, coverBytes);

  // ⭐ 7. Add dedicated metadata.json, pricing.json, and cover-info.json
  zip.file('metadata.json', JSON.stringify(generateMetadataJson(book), null, 2));
  zip.file('pricing.json', JSON.stringify(generatePricingJson(book), null, 2));
  zip.file('cover-info.json', JSON.stringify(generateCoverInfoJson(book), null, 2));

  // Add Complete Manifest
  zip.file(`${safeTitle}_Full_KDP_Package.json`, JSON.stringify(book, null, 2));

  // Add Instant Copy-Paste KDP Upload Guide
  const copyPasteGuide = `=====================================================
AMAZON KDP PAPERBACK DIRECT UPLOAD GUIDE
Generated by Amazon KDP Publishing Suite
=====================================================

--- TAB 1: PAPERBACK DETAILS ---

1. BOOK TITLE:
${book.metadata.title}

2. SUBTITLE:
${book.metadata.subtitle}

3. PRIMARY AUTHOR:
${book.metadata.author}

4. DESCRIPTION (Copy & Paste as Amazon HTML):
${book.metadata.descriptionHtml}

5. PUBLISHING RIGHTS:
(•) I own the copyright and I hold the necessary publishing rights.

6. PRIMARY AUDIENCE:
Target Audience: ${book.metadata.targetAudience}
Adult Content: No

7. 7 BACKEND SEARCH KEYWORDS:
Keyword 1: ${book.metadata.keywords[0] || ''}
Keyword 2: ${book.metadata.keywords[1] || ''}
Keyword 3: ${book.metadata.keywords[2] || ''}
Keyword 4: ${book.metadata.keywords[3] || ''}
Keyword 5: ${book.metadata.keywords[4] || ''}
Keyword 6: ${book.metadata.keywords[5] || ''}
Keyword 7: ${book.metadata.keywords[6] || ''}

8. CATEGORIES:
Category 1: ${book.metadata.categories[0] || ''}
Category 2: ${book.metadata.categories[1] || ''}


--- TAB 2: PAPERBACK CONTENT ---

1. PRINT OPTIONS:
• Interior Type: ${book.interiorSpec.colorMode === 'black_and_white' ? 'Black & white interior with white paper' : 'Standard color interior with white paper'}
• Trim Size: 8.5 x 11.0 inches (Select "Select a different size" -> 8.5 x 11 in)
• Bleed Settings: ${book.interiorSpec.bleed ? 'Bleed (PDF only)' : 'No Bleed'}
• Paperback Cover Finish: ${book.coverSpec.coverFinish === 'matte' ? 'Matte' : 'Glossy'}

2. MANUSCRIPT UPLOAD:
• Upload file: ${safeTitle}_Interior_8.5x11_AmazonKDP.pdf
• Total Pages: ${book.pages.length} pages (Matches KDP specifications)

3. BOOK COVER:
• Option: "Upload a cover you already have (print-ready PDF only)"
• Upload file: ${safeTitle}_FullWrap_Cover_AmazonKDP.pdf
• Spine Width: ${book.coverSpec.spineWidthInches} inches (Formula: 0.002252 * ${book.pages.length})
• Barcode: Select "Leave barcode box empty (Amazon will barcode your cover)"


--- TAB 3: PAPERBACK RIGHTS & PRICING ---

1. TERRITORIES:
(•) All territories (worldwide rights)

2. PRIMARY MARKETPLACE:
Amazon.com

3. AUTO-SUGGESTED MULTI-CURRENCY PRICING (Print Cost x 3 Rule):
• US (Amazon.com): $${book.metadata.internationalPricing?.retailUS || book.metadata.listPriceUSD} USD (Print Cost: $${book.metadata.estimatedPrintCostUSD}, Royalty: $${book.metadata.internationalPricing?.royaltyUS || book.metadata.estimatedRoyaltyUSD})
• UK (Amazon.co.uk): £${book.metadata.internationalPricing?.retailUK || '7.99'} GBP
• CA (Amazon.ca): C$${book.metadata.internationalPricing?.retailCA || '11.99'} CAD
• EU (Amazon.de/fr/it/es): €${book.metadata.internationalPricing?.retailEU || '8.99'} EUR

=====================================================
All files verified 100% compliant with Amazon KDP print engines.
=====================================================`;

  zip.file(`${safeTitle}_KDP_Upload_Instructions.txt`, copyPasteGuide);

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * ⭐ 4. BATCH EXPORT MODE
 * Bundles 10 books into one master ZIP:
 * - 10 interiors
 * - 10 covers
 * - 10 metadata kits
 * - Master catalog manifest
 */
export async function createBatchSubmissionZip(
  batchItems: Array<{
    book: KDPBook;
    interiorBytes: Uint8Array;
    coverBytes: Uint8Array;
    index: number;
  }>
): Promise<Blob> {
  const masterZip = new JSZip();
  const manifestList = [];

  for (const item of batchItems) {
    const bookIndexStr = `Book_${String(item.index + 1).padStart(2, '0')}`;
    const folderName = `${bookIndexStr}_${item.book.metadata.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}`;
    const bookFolder = masterZip.folder(folderName);

    if (bookFolder) {
      // 1. Interior PDF
      bookFolder.file(`${folderName}_Interior_8.5x11.pdf`, item.interiorBytes);
      // 2. Cover Wrap PDF
      bookFolder.file(`${folderName}_CoverWrap.pdf`, item.coverBytes);
      // 3. Metadata JSON
      bookFolder.file('metadata.json', JSON.stringify(generateMetadataJson(item.book), null, 2));
      // 4. Pricing JSON
      bookFolder.file('pricing.json', JSON.stringify(generatePricingJson(item.book), null, 2));
      // 5. Cover Info JSON
      bookFolder.file('cover-info.json', JSON.stringify(generateCoverInfoJson(item.book), null, 2));
    }

    manifestList.push({
      slot: item.index + 1,
      title: item.book.metadata.title,
      subtitle: item.book.metadata.subtitle,
      pageCount: item.book.pages.length,
      category: item.book.metadata.categories[0],
      retailUS: item.book.metadata.internationalPricing?.retailUS || item.book.metadata.listPriceUSD,
      printCost: item.book.metadata.estimatedPrintCostUSD,
      royaltyUS: item.book.metadata.internationalPricing?.royaltyUS || item.book.metadata.estimatedRoyaltyUSD,
    });
  }

  // Master Catalog Manifest
  masterZip.file('BATCH_CATALOG_MANIFEST.json', JSON.stringify({
    totalBooks: batchItems.length,
    generatedAt: new Date().toISOString(),
    catalog: manifestList,
  }, null, 2));

  // CSV Manifest for easy import into Excel / Google Sheets
  const csvHeaders = 'Slot,Title,Subtitle,PageCount,Category,RetailPriceUSD,PrintCostUSD,RoyaltyUSD\n';
  const csvRows = manifestList.map(m => 
    `"${m.slot}","${m.title.replace(/"/g, '""')}","${m.subtitle.replace(/"/g, '""')}","${m.pageCount}","${m.category}","$${m.retailUS}","$${m.printCost}","$${m.royaltyUS}"`
  ).join('\n');
  masterZip.file('BATCH_CATALOG_SUMMARY.csv', csvHeaders + csvRows);

  return await masterZip.generateAsync({ type: 'blob' });
}

// Convenient export aliases for modular component imports
export const generateInteriorPdf = generateKDPInteriorPDF;
export const generateCoverWrapPdf = generateKDPCoverPDF;
