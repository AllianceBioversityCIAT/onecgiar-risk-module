import { Component } from '@angular/core';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { PhasesService } from 'src/app/services/phases.service';
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

  constructor(
    private initiativeService: InitiativesService,
    private phasesService: PhasesService,
  ) {}

  async exportAllLandscapePDFs(): Promise<void> {
    this.exporting = true;
    this.exportProgress = 'Loading programs...';

    try {
      const programs = await this.initiativeService.getInitiatives();
      const logoBase64 = await this.getBase64FromUrl('assets/shared-image/cgiar-logo.png');
      const activePhase = await this.phasesService.getActivePhase();
      const activePhaseYear = activePhase?.reporting_year || new Date().getFullYear();
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

        const pdfBuffer = this.generateLandscapePDF(fullProgram, logoBase64, activePhaseYear);
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

  private generateLandscapePDF(program: any, logoBase64: string, activePhaseYear: string | number): ArrayBuffer {
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

    const truncateWords = (text: string, maxWords: number): string => {
      const words = text.split(/\s+/).filter(w => w);
      return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
    };

    const cellPad    = 2;
    const hdrH       = 8;
    const tableX     = margin;
    const tableHdrY  = 16;
    const rowsStartY = tableHdrY + hdrH;
    const rowsEndY   = pageH - 8;
    const availableH = rowsEndY - rowsStartY;
    const totalW     = pageW - margin * 2;
    const minColW    = 60;

    const calcColWidths = (mitMaxWords?: number): { descW: number; actW: number } => {
      let descChars = 0;
      let actChars  = 0;
      for (const risk of top5) {
        descChars += String(risk.title || '').length;
        descChars += stripHtml(String(risk.description || '')).length;
        const mits = (risk.mitigations?.length > 0 ? risk.mitigations : []).slice(0, 3);
        for (const m of mits) {
          const mitDesc = stripHtml(m?.description || '-');
          actChars += (mitMaxWords ? truncateWords(mitDesc, mitMaxWords) : mitDesc).length;
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

    let mitMaxWords: number | undefined;
    const buildCols = (year: string | number = '') => {
      const { descW, actW } = calcColWidths(mitMaxWords);
      return [
        { header: `Top 5 Submitted Risks for ${year}`, w: descW },
        { header: 'Actions and Controls to Manage Risk', w: actW },
      ];
    };
    let cols = buildCols();

    let fontSize = 10;
    let lineH    = 4.5;

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
        const descText = stripHtml(String(risk.description || ''));
        const descLines = doc.splitTextToSize(descText, colW) as string[];

        const combinedLines: { text: string; bold?: boolean; color?: 'theme' | 'dark' }[] = [];
        for (const line of titleLines) combinedLines.push({ text: line, bold: true, color: 'dark' });
        for (const line of descLines) combinedLines.push({ text: line, color: 'dark' });

        const mits = (risk.mitigations?.length > 0 ? risk.mitigations.slice(0, 3) : [null]);
        const mitigations: MitLayout[] = mits.map((m: any) => {
          const rawDesc = stripHtml(m?.description || '-');
          const desc = mitMaxWords ? truncateWords(rawDesc, mitMaxWords) : rawDesc;
          return {
            descLines: doc.splitTextToSize(desc, cols[1].w - cellPad * 2) as string[],
            statusLines: [] as string[],
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

    // First pass: try without truncation
    let layout = calcLayout(fontSize, lineH);
    while (layout.totalH > availableH && fontSize > 6.5) {
      fontSize -= 0.25;
      lineH    -= 0.1;
      layout    = calcLayout(fontSize, lineH);
    }

    // If still overflowing at min font, enable truncation and retry
    if (layout.totalH > availableH) {
      mitMaxWords = 30;
      fontSize = 10;
      lineH = 4.5;
      cols = buildCols();
      layout = calcLayout(fontSize, lineH);
      while (layout.totalH > availableH && fontSize > 6.5) {
        fontSize -= 0.25;
        lineH    -= 0.1;
        layout    = calcLayout(fontSize, lineH);
      }
    }

    const programName  = program?.name || '';
    cols = buildCols(activePhaseYear);

    const narrative = program?.narrative || '';
    const programLink = `${window.location.origin}/home/${program?.id}/${program?.official_code || ''}`;

    // Row 1: Logo + "Top 5 submitted risks for {Year}" (left)  |  "Click here for more details" (right)
    const titleY = 7;
    const logoY = titleY - 2; // align logo top with text top
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', margin, logoY, logoW, logoH);
    }
    const textX = margin + logoW + 3;
    doc.setTextColor(themeR, themeG, themeB);
    doc.setFontSize(fontSize + 1);
    doc.setFont('helvetica', 'bold');
    const titleLabel = programName
      ? `Risk Management - ${programName}`
      : `Risk Management`;
    doc.text(titleLabel, textX, titleY);

    // Link on the right (same vertical position as title)
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(themeR, themeG, themeB);
    const linkLabel = 'Click ';
    const linkHere = 'here';
    const linkAfter = ' for additional details including a full list of actions and controls, deadlines and status';
    const linkLabelW = doc.getTextWidth(linkLabel);
    doc.setFont('helvetica', 'bold');
    const linkHereW = doc.getTextWidth(linkHere);
    doc.setFont('helvetica', 'normal');
    const linkAfterW = doc.getTextWidth(linkAfter);
    const totalLinkW = linkLabelW + linkHereW + linkAfterW;
    const linkStartX = pageW - margin - totalLinkW;
    doc.setFont('helvetica', 'normal');
    doc.text(linkLabel, linkStartX, titleY);
    doc.setFont('helvetica', 'bold');
    doc.textWithLink(linkHere, linkStartX + linkLabelW, titleY, { url: programLink });
    doc.setDrawColor(themeR, themeG, themeB);
    doc.setLineWidth(0.3);
    doc.line(linkStartX + linkLabelW, titleY + 0.5, linkStartX + linkLabelW + linkHereW, titleY + 0.5);
    doc.setFont('helvetica', 'normal');
    doc.text(linkAfter, linkStartX + linkLabelW + linkHereW, titleY);

    // Row 2: Narrative — manually word-wrap to full page width
    let headerBottomY = titleY + 5;
    if (narrative) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);

      const narrativeStartY = titleY + 4;
      const fullW = pageW - margin - textX;
      const words = String(narrative).split(/\s+/);
      const lines: string[] = [];
      let cur = '';
      for (const word of words) {
        const test = cur ? cur + ' ' + word : word;
        if (doc.getTextWidth(test) > fullW && cur) {
          lines.push(cur);
          cur = word;
        } else {
          cur = test;
        }
      }
      if (cur) lines.push(cur);

      const nlh = 2.8;
      let ny = narrativeStartY;
      for (const line of lines) {
        doc.text(line, textX, ny);
        ny += nlh;
      }
      headerBottomY = ny + 0.5;
    }

    const actualTableHdrY = Math.max(tableHdrY, headerBottomY);
    const actualRowsStartY = actualTableHdrY + hdrH;
    const actualAvailableH = rowsEndY - actualRowsStartY;

    // Recalculate layout if narrative pushed the table down
    if (narrative && actualAvailableH < availableH) {
      layout = calcLayout(fontSize, lineH);
      while (layout.totalH > actualAvailableH && fontSize > 5.5) {
        fontSize -= 0.25;
        lineH    -= 0.1;
        layout    = calcLayout(fontSize, lineH);
      }
      if (layout.totalH > actualAvailableH && !mitMaxWords) {
        mitMaxWords = 30;
        fontSize = 8;
        lineH = 3.8;
        cols = buildCols();
        layout = calcLayout(fontSize, lineH);
        while (layout.totalH > actualAvailableH && fontSize > 5.5) {
          fontSize -= 0.25;
          lineH    -= 0.1;
          layout    = calcLayout(fontSize, lineH);
        }
      }
    }

    // Draw table header row
    const headerFontSize = Math.max(fontSize + 1.5, 8.5);
    let x = tableX;
    doc.setFontSize(headerFontSize);
    doc.setFont('helvetica', 'bold');
    for (const col of cols) {
      doc.setFillColor(themeR, themeG, themeB);
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.3);
      doc.rect(x, actualTableHdrY, col.w, hdrH, 'FD');
      doc.setTextColor(255, 255, 255);
      doc.text(col.header, x + cellPad, actualTableHdrY + hdrH / 2 + 1.5);
      x += col.w;
    }

    // Draw data rows with merged cells
    let y = actualRowsStartY;
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
