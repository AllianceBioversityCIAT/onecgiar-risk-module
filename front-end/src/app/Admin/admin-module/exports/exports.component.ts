import { Component } from '@angular/core';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { jsPDF } from 'jspdf';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-exports',
  templateUrl: './exports.component.html',
  styleUrls: ['./exports.component.scss'],
})
export class ExportsComponent {
  displayedColumns = ['description', 'action'];
  exports = [
    { description: 'Landscape PDF reports for all programs (ZIP)' },
  ];
  exporting = false;
  exportProgress = '';

  constructor(private initiativeService: InitiativesService) {}

  async exportAllLandscapePDFs(): Promise<void> {
    this.exporting = true;
    this.exportProgress = 'Loading programs...';

    try {
      const programs = await this.initiativeService.getInitiatives();
      const logoBase64 = await this.getBase64FromUrl('assets/shared-image/cgiar-logo.png');
      const zip = new PizZip();
      let count = 0;

      for (const program of programs) {
        this.exportProgress = `Processing ${count + 1}/${programs.length}...`;

        const fullProgram = await this.initiativeService.getInitiative(program.id);
        const risks: any[] = fullProgram?.risks || [];
        if (risks.length === 0) {
          count++;
          continue;
        }

        const pdfBuffer = this.generateLandscapePDF(fullProgram, logoBase64);
        const code = fullProgram.official_code || program.official_code || program.id;
        zip.file(`Risk-Report-Landscape-${code}.pdf`, pdfBuffer);
        count++;
      }

      this.exportProgress = 'Creating ZIP...';
      const blob = zip.generate({ type: 'blob', mimeType: 'application/zip' });
      saveAs(blob, 'All-Landscape-Reports.zip');
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      this.exporting = false;
      this.exportProgress = '';
    }
  }

  private generateLandscapePDF(program: any, logoBase64: string): ArrayBuffer {
    const risks: any[] = program?.risks || [];
    const top5 = [...risks]
      .sort(
        (a: any, b: any) =>
          b.current_likelihood * b.current_impact -
          a.current_likelihood * a.current_impact
      )
      .slice(0, 5);

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = 297;
    const pageH = 210;
    const margin = 6;
    const themeR = 67, themeG = 98, themeB = 128;
    const logoH = 10;
    const logoW = logoH * (148 / 182);

    const stripHtml = (text: string): string =>
      text ? text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() : '';

    const cellPad    = 2;
    const hdrH       = 8;
    const tableX     = margin;
    const tableHdrY  = 16;
    const rowsStartY = tableHdrY + hdrH;
    const rowsEndY   = pageH - 8;
    const availableH = rowsEndY - rowsStartY;
    const totalW     = pageW - margin * 2;
    const minColW    = 60;

    const formatDate = (risk: any): string => {
      if (!risk.due_date) return '-';
      const d = new Date(risk.due_date);
      return isNaN(d.getTime()) ? String(risk.due_date) : d.toLocaleDateString('en-GB');
    };

    const calcColWidths = (): { descW: number; actW: number } => {
      let descChars = 0;
      let actChars  = 0;
      for (const risk of top5) {
        descChars += String(risk.title || '').length;
        descChars += ('Deadline: ' + formatDate(risk)).length;
        descChars += stripHtml(String(risk.description || '')).length;
        const mits = risk.mitigations?.length > 0 ? risk.mitigations : [];
        for (const m of mits) {
          actChars += stripHtml(m?.description || '-').length;
          actChars += (m?.status?.title || '').length;
        }
      }
      const total = descChars + actChars;
      if (total === 0) return { descW: totalW / 2, actW: totalW / 2 };
      const descPct = descChars / total;
      const actPct  = actChars / total;
      let descW = Math.round(totalW * descPct);
      let actW  = Math.round(totalW * actPct);
      if (descW < minColW) { descW = minColW; actW = totalW - minColW; }
      if (actW  < minColW) { actW  = minColW; descW = totalW - minColW; }
      return { descW, actW };
    };

    const { descW, actW } = calcColWidths();
    const cols = [
      { header: 'Title / Description', w: descW },
      { header: 'Actions/Controls',    w: actW },
    ];

    let fontSize = 8;
    let lineH    = 3.8;

    interface MitLayout { descLines: string[]; statusLines: string[] }
    interface RiskLayout {
      combinedLines: { text: string; bold?: boolean; color?: 'theme' | 'dark' }[];
      mitigations: MitLayout[]; riskRowH: number; subRowHeights: number[];
    }

    const calcLayout = (fs: number, lh: number): { riskLayouts: RiskLayout[]; totalH: number } => {
      doc.setFontSize(fs);
      doc.setFont('helvetica', 'normal');
      const colW = cols[0].w - cellPad * 2;

      const riskLayouts: RiskLayout[] = top5.map(risk => {
        const titleLines = doc.splitTextToSize(String(risk.title || ''), colW) as string[];
        const deadlineLabel = 'Deadline: ' + formatDate(risk);
        const deadlineLines = doc.splitTextToSize(deadlineLabel, colW) as string[];
        const descText = stripHtml(String(risk.description || ''));
        const descLines = doc.splitTextToSize(descText, colW) as string[];

        const combinedLines: { text: string; bold?: boolean; color?: 'theme' | 'dark' }[] = [];
        for (const line of titleLines) combinedLines.push({ text: line, bold: true, color: 'dark' });
        for (const line of deadlineLines) combinedLines.push({ text: line, bold: true, color: 'theme' });
        for (const line of descLines) combinedLines.push({ text: line, color: 'dark' });

        const mits = risk.mitigations?.length > 0 ? risk.mitigations : [null];
        const mitigations: MitLayout[] = mits.map((m: any) => {
          const desc = stripHtml(m?.description || '-');
          const status = m?.status?.title || '';
          const statusLabel = status ? `Status: ${status}` : '';
          return {
            descLines: doc.splitTextToSize(desc, cols[1].w - cellPad * 2) as string[],
            statusLines: statusLabel ? doc.splitTextToSize(statusLabel, cols[1].w - cellPad * 2) as string[] : [],
          };
        });

        const subRowHeights = mitigations.map(m => {
          const totalLines = m.descLines.length + m.statusLines.length;
          return Math.max(5, totalLines * lh + cellPad * 2);
        });

        const totalMitH = subRowHeights.reduce((s, h) => s + h, 0);
        const combinedH = Math.max(5, combinedLines.length * lh + cellPad * 2);
        const riskRowH  = Math.max(combinedH, totalMitH);

        return { combinedLines, mitigations, riskRowH, subRowHeights };
      });

      return { riskLayouts, totalH: riskLayouts.reduce((s, rl) => s + rl.riskRowH, 0) };
    };

    let layout = calcLayout(fontSize, lineH);
    while (layout.totalH > availableH && fontSize > 5.5) {
      fontSize -= 0.25;
      lineH    -= 0.1;
      layout    = calcLayout(fontSize, lineH);
    }

    const officialCode = program?.official_code || '';
    const programName  = program?.name || '';
    const headerTitle  = officialCode && programName
      ? `${officialCode} - ${programName}`
      : programName || officialCode || '';

    // Header: Logo + "PRMS Risk" (left) | Program title (center)
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', margin, 3, logoW, logoH);
    }
    doc.setTextColor(themeR, themeG, themeB);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PRMS Risk', margin + logoW + 3, 10);

    if (headerTitle) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(themeR, themeG, themeB);
      doc.text(headerTitle, pageW / 2, 10, { align: 'center' });
    }

    // Draw table header row
    let x = tableX;
    doc.setFontSize(Math.min(8.5, fontSize + 0.5));
    doc.setFont('helvetica', 'bold');
    for (const col of cols) {
      doc.setFillColor(themeR, themeG, themeB);
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.3);
      doc.rect(x, tableHdrY, col.w, hdrH, 'FD');
      doc.setTextColor(255, 255, 255);
      doc.text(col.header, x + cellPad, tableHdrY + hdrH / 2 + 1.5);
      x += col.w;
    }

    // Draw data rows with merged cells
    let y = rowsStartY;
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'normal');

    layout.riskLayouts.forEach((rl, ri) => {
      const rowH = rl.riskRowH;
      const bgR = ri % 2 === 1 ? 240 : 255;
      const bgG = ri % 2 === 1 ? 244 : 255;
      const bgB = ri % 2 === 1 ? 248 : 255;

      // Title / Description (col 0)
      x = tableX;
      doc.setFillColor(bgR, bgG, bgB);
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.rect(x, y, cols[0].w, rowH, 'FD');
      let textY = y + cellPad + fontSize * 0.35;
      for (const line of rl.combinedLines) {
        if (line.color === 'theme') {
          doc.setTextColor(themeR, themeG, themeB);
        } else {
          doc.setTextColor(30, 30, 30);
        }
        doc.setFont('helvetica', line.bold ? 'bold' : 'normal');
        doc.text(line.text, x + cellPad, textY);
        textY += lineH;
      }
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 30, 30);

      // Sub-rows: Actions/Controls (col 1)
      const totalSubH = rl.subRowHeights.reduce((s, h) => s + h, 0);
      const scale = totalSubH > 0 ? rowH / totalSubH : 1;
      let subY = y;

      rl.mitigations.forEach((m, mi) => {
        const isLast = mi === rl.mitigations.length - 1;
        const subH = isLast ? (y + rowH) - subY : rl.subRowHeights[mi] * scale;

        const mitX = tableX + cols[0].w;
        doc.setFillColor(bgR, bgG, bgB);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.2);
        doc.rect(mitX, subY, cols[1].w, subH, 'FD');
        doc.setTextColor(30, 30, 30);
        doc.setFont('helvetica', 'normal');
        textY = subY + cellPad + fontSize * 0.35;
        for (const line of m.descLines) {
          doc.text(line, mitX + cellPad, textY);
          textY += lineH;
        }
        if (m.statusLines.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(themeR, themeG, themeB);
          for (const line of m.statusLines) {
            doc.text(line, mitX + cellPad, textY);
            textY += lineH;
          }
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(30, 30, 30);
        }

        subY += subH;
      });

      y += rowH;
    });

    return doc.output('arraybuffer');
  }

  private getBase64FromUrl(url: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d')?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve('');
      img.src = url;
    });
  }
}
