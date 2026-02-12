// api/generate-pdf.js
import PDFDocument from 'pdfkit';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { invoiceData } = req.body;

    // Create PDF in memory
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=invoice_${invoiceData.invoiceNumber}.pdf`
      );
      res.send(pdfBuffer);
    });

    // Load Japanese font from Google Fonts
    const fontUrl = 'https://fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Regular.ttf';
    const fontResponse = await fetch(fontUrl);
    const fontBuffer = await fontResponse.buffer();
    doc.registerFont('NotoSansJP', fontBuffer);

    // Use Japanese font
    doc.font('NotoSansJP');

    // Title
    doc.fontSize(24).text('請求書', { align: 'center' });
    doc.moveDown();

    // Invoice info (right side)
    doc.fontSize(10);
    const rightX = 450;
    doc.text(`No. ${invoiceData.invoiceNumber}`, rightX, 80, { align: 'right' });
    doc.text(`請求日: ${invoiceData.invoiceDate}`, rightX, 95, { align: 'right' });

    // Customer name
    doc.fontSize(14).text(`${invoiceData.customerName} 様`, 50, 120);

    // Company info (right side)
    doc.fontSize(10);
    let yPos = 120;
    doc.text('福岡キッズカートアカデミー', rightX, yPos, { align: 'right' });
    yPos += 15;
    doc.text('原野正明', rightX, yPos, { align: 'right' });
    yPos += 15;
    doc.text('818-0024', rightX, yPos, { align: 'right' });
    yPos += 15;
    doc.text('福岡県筑紫野市大字原田1338', rightX, yPos, { align: 'right' });
    yPos += 15;
    doc.text('TEL:092-927-1177', rightX, yPos, { align: 'right' });

    // Request text
    doc.fontSize(10).text('下記の通りご請求申し上げます。', 50, 200);

    // Total amount box
    doc.rect(50, 220, 200, 50).stroke();
    doc.fontSize(10).text('請求金額', 60, 230);
    doc.fontSize(18).text(`¥${invoiceData.total.toLocaleString()}`, 60, 250);

    // Table
    const tableTop = 300;
    const colPositions = [50, 280, 350, 420, 500];
    
    // Table header
    doc.fontSize(9);
    doc.rect(colPositions[0], tableTop, colPositions[4] - colPositions[0], 25).stroke();
    doc.text('摘要', colPositions[0] + 5, tableTop + 8);
    doc.text('数量', colPositions[1] + 5, tableTop + 8, { width: 60, align: 'right' });
    doc.text('単価', colPositions[2] + 5, tableTop + 8, { width: 60, align: 'right' });
    doc.text('明細金額', colPositions[3] + 5, tableTop + 8, { width: 70, align: 'right' });

    // Table items
    let itemY = tableTop + 25;
    invoiceData.items.forEach((item) => {
      doc.rect(colPositions[0], itemY, colPositions[4] - colPositions[0], 25).stroke();
      doc.text(item.name.substring(0, 30), colPositions[0] + 5, itemY + 8, { width: 220 });
      doc.text(item.quantity.toString(), colPositions[1] + 5, itemY + 8, { width: 60, align: 'right' });
      doc.text(item.unitPrice.toLocaleString(), colPositions[2] + 5, itemY + 8, { width: 60, align: 'right' });
      doc.text(item.total.toLocaleString(), colPositions[3] + 5, itemY + 8, { width: 70, align: 'right' });
      itemY += 25;
    });

    // Empty rows
    for (let i = invoiceData.items.length; i < 5; i++) {
      doc.rect(colPositions[0], itemY, colPositions[4] - colPositions[0], 25).stroke();
      itemY += 25;
    }

    // Summary
    itemY += 20;
    doc.fontSize(10);
    doc.text('小計', colPositions[2] - 30, itemY);
    doc.text(`¥${invoiceData.subtotal.toLocaleString()}`, colPositions[3] + 5, itemY, { width: 70, align: 'right' });
    itemY += 20;
    doc.text('消費税(10%)', colPositions[2] - 30, itemY);
    doc.text(`¥${invoiceData.tax.toLocaleString()}`, colPositions[3] + 5, itemY, { width: 70, align: 'right' });
    itemY += 20;
    doc.fontSize(11);
    doc.text('合計', colPositions[2] - 30, itemY);
    doc.text(`¥${invoiceData.total.toLocaleString()}`, colPositions[3] + 5, itemY, { width: 70, align: 'right' });

    // Bank info
    doc.fontSize(8);
    let bankY = 650;
    doc.text('振込先:', 50, bankY);
    bankY += 12;
    doc.text('福岡銀行 筑紫支店', 50, bankY);
    bankY += 12;
    doc.text('普通 0103993 ハラノマサアキ', 50, bankY);
    bankY += 18;
    doc.text('西日本シティ銀行 美しが丘出張所', 50, bankY);
    bankY += 12;
    doc.text('普通 3015580 ハラノマサアキ', 50, bankY);
    bankY += 18;
    doc.text('PayPay銀行 ススメ支店 (002)', 50, bankY);
    bankY += 12;
    doc.text('普通 3215096', 50, bankY);
    bankY += 12;
    doc.text('トリプルエーモータースポーツ ハラノマサアキ', 50, bankY);

    doc.end();
  } catch (error) {
    console.error('PDF生成エラー:', error);
    return res.status(500).json({ error: error.message });
  }
}
