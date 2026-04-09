import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { RiskReportComponent } from '../risk-report.component';
// import { RiskReportOverviewComponent } from '../risk-report-overview/risk-report-overview.component';
import { LoadingService } from 'src/app/services/loading.service';
import { AppSocket } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { RiskService } from 'src/app/services/risk.service';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { PhasesService } from 'src/app/services/phases.service';
import { jsPDF } from 'jspdf';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { ROLES } from '../team-members/team-members.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-risk-report-table',
  templateUrl: './risk-report-table.component.html',
  styleUrls: ['./risk-report-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', visibility: 'hidden' })
      ),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class RiskReportTableComponent {
  expandedElement: any;

  // expandedElement!: RiskReport | null;
  public url1: string = '';

  public riskUrl = {
    home: '/home/risk-management/risk-report',
  };

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    private initiativeService: InitiativesService,
    private riskService: RiskService,
    private toastr: ToastrService,
    private userService: UserService,
    private socket: AppSocket,
    private loading: LoadingService,
    private cd: ChangeDetectorRef,
    private titleService: Title,
    private phasesService: PhasesService
  ) {}

  @Input() dataSource: any;
  @Input() dataSourceForPdf: any;
  @Input() AllRisk: any;

  @Output() refresh: EventEmitter<any> = new EventEmitter<any>();

  @Input() savePdf: EventEmitter<any> = new EventEmitter<any>();
  @Input() my_risks: any;
  @Input() set programData(val: any) {
    if (val) this.sciencePrograms = val;
  }
  @Input() showingVersion: boolean = false;
  @Input() showReduntent: boolean = true;
  @Input() titlePage: any;

  @ViewChild('pdfcontent') pdfcontent: ElementRef = new ElementRef('');

  toPdf: boolean = false;

  public async SavePDF(): Promise<void> {
    const risks: any[] = this.AllRisk?.risks || this.dataSource?.data || [];

    const top5 = [...risks]
      .sort(
        (a: any, b: any) =>
          b.current_likelihood * b.current_impact -
          a.current_likelihood * a.current_impact
      )
      .slice(0, 5);

    const logoBase64 = await this.getBase64FromUrl(
      'assets/shared-image/cgiar-logo.png'
    );

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    const themeR = 67, themeG = 98, themeB = 128;

    // Logo dimensions — preserve 148×182 px portrait aspect ratio
    const logoDisplayH = 20;
    const logoDisplayW = logoDisplayH * (148 / 182); // ≈16.3 mm
    const programName = this.sciencePrograms?.name || this.scienceProgramsId || '';

    // Reusable header drawer — logo | "PRMS Risk Management" (both left-aligned)
    const drawHeader = (barH: number = 30) => {
      doc.setFillColor(themeR, themeG, themeB);
      doc.rect(0, 0, pageWidth, barH, 'F');

      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', margin, (barH - logoDisplayH) / 2, logoDisplayW, logoDisplayH);
      }

      // "PRMS Risk Management" beside the logo on the left
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      const titleX = margin + logoDisplayW + 5;
      const titleAvailWidth = pageWidth - margin - titleX;
      const titleLines = doc.splitTextToSize('PRMS Risk Management', titleAvailWidth) as string[];
      const lineH = 6;
      const totalH = titleLines.length * lineH;
      let titleY = (barH - totalH) / 2 + lineH;
      for (const line of titleLines) {
        doc.text(line, titleX, titleY);
        titleY += lineH;
      }
    };

    // ── PAGE 1 ──────────────────────────────────────────────────────────────
    drawHeader();

    let y = 42;

    // Initiative name
    doc.setTextColor(themeR, themeG, themeB);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(programName, margin, y);
    y += 9;

    // Subtitle
    const year = new Date().getFullYear();
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(
      `Top 5 Submitted Risks and Mitigating Actions for ${year}`,
      margin,
      y
    );
    y += 7;

    // Separator line
    doc.setDrawColor(themeR, themeG, themeB);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 9;

    top5.forEach((risk: any, index: number) => {
      const title = `${index + 1}. ${risk.title || ''}`;
      const description = risk.description || '';
      const ownerName =
        risk.risk_owner?.user?.full_name || risk.risk_owner?.email || 'N/A';
      const hasMitigations = risk.mitigations?.length > 0 ? 'Yes' : 'No';
      const deadline = risk.due_date
        ? new Date(risk.due_date).toLocaleDateString('en-GB')
        : null;

      if (y > 247) {
        doc.addPage();
        y = 20;
      }

      // Risk title
      doc.setTextColor(themeR, themeG, themeB);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(title, contentWidth);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 6 + 2;

      // Description
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(description, contentWidth);
      if (y + descLines.length * 5 > 267) {
        doc.addPage();
        y = 20;
      }
      doc.text(descLines, margin, y);
      y += descLines.length * 5 + 4;

      // Risk Owner
      if (y > 267) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.text('Risk Owner: ', margin, y);
      const ownerLabelW = doc.getTextWidth('Risk Owner: ');
      doc.setFont('helvetica', 'normal');
      doc.text(ownerName, margin + ownerLabelW, y);
      y += 6;

      // Mitigating Actions
      if (y > 267) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.text('Mitigating Actions in place: ', margin, y);
      const mitigLabelW = doc.getTextWidth('Mitigating Actions in place: ');
      doc.setFont('helvetica', 'normal');
      doc.text(hasMitigations, margin + mitigLabelW, y);
      y += 6;

      // Deadline
      if (deadline) {
        if (y > 267) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.text('Deadline: ', margin, y);
        const deadlineLabelW = doc.getTextWidth('Deadline: ');
        doc.setFont('helvetica', 'normal');
        doc.text(deadline, margin + deadlineLabelW, y);
        y += 6;
      }

      // Divider between risks
      y += 3;
      if (y <= 267) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageWidth - margin, y);
      }
      y += 6;
    });

    // ── Bar Chart — same page if space allows, otherwise new page ────────────
    // Needs: 5 (gap) + 8 (subtitle) + 70 (plot) + 5 (x-labels) + 18 (legend) ≈ 106 mm
    const chartSpaceNeeded = 106;
    let chartY: number;

    if (y + chartSpaceNeeded > 275) {
      doc.addPage();
      drawHeader();
      chartY = 38;
    } else {
      // Divider before chart section
      y += 5;
      doc.setDrawColor(themeR, themeG, themeB);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 7;
      chartY = y;
    }

    // Chart subtitle
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Risk Level Comparison: Current vs Target', margin, chartY);
    chartY += 8;

    this.drawBarChart(doc, top5, chartY, margin, themeR, themeG, themeB);

    doc.save(`Risk-Report-${this.scienceProgramsId}.pdf`);
  }

  public async SaveFullDetailsPDF(): Promise<void> {
    const risks: any[] = this.AllRisk?.risks || this.dataSource?.data || [];
    const allRisks = [...risks].sort(
      (a: any, b: any) =>
        b.current_likelihood * b.current_impact -
        a.current_likelihood * a.current_impact
    );

    const logoBase64 = await this.getBase64FromUrl('assets/shared-image/cgiar-logo.png');

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    const themeR = 67, themeG = 98, themeB = 128;
    const logoDisplayH = 20;
    const logoDisplayW = logoDisplayH * (148 / 182);
    const programName = this.sciencePrograms?.name || this.scienceProgramsId || '';

    const drawHeader = (barH: number = 30) => {
      doc.setFillColor(themeR, themeG, themeB);
      doc.rect(0, 0, pageWidth, barH, 'F');
      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', margin, (barH - logoDisplayH) / 2, logoDisplayW, logoDisplayH);
      }
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      const titleX = margin + logoDisplayW + 5;
      const titleAvailWidth = pageWidth - margin - titleX;
      const titleLines = doc.splitTextToSize('PRMS Risk Management', titleAvailWidth) as string[];
      const lineH = 6;
      const totalH = titleLines.length * lineH;
      let titleY = (barH - totalH) / 2 + lineH;
      for (const line of titleLines) {
        doc.text(line, titleX, titleY);
        titleY += lineH;
      }
    };

    drawHeader();

    let y = 42;

    // Programme name
    doc.setTextColor(themeR, themeG, themeB);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(programName, margin, y);
    y += 9;

    // Subtitle
    const year = new Date().getFullYear();
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`All Risks – Full Details for ${year}`, margin, y);
    y += 7;

    doc.setDrawColor(themeR, themeG, themeB);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 9;

    allRisks.forEach((risk: any, index: number) => {
      const ownerName = risk.risk_owner?.user?.full_name || risk.risk_owner?.email || 'N/A';
      const deadline = risk.due_date
        ? new Date(risk.due_date).toLocaleDateString('en-GB')
        : null;

      // Page break guard
      if (y > 247) { doc.addPage(); drawHeader(); y = 38; }

      // Risk title
      doc.setTextColor(themeR, themeG, themeB);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(`${index + 1}. ${risk.title || ''}`, contentWidth);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 6 + 2;

      // Description
      if (y > 267) { doc.addPage(); drawHeader(); y = 38; }
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(risk.description || '', contentWidth);
      if (y + descLines.length * 5 > 267) { doc.addPage(); drawHeader(); y = 38; }
      doc.text(descLines, margin, y);
      y += descLines.length * 5 + 3;

      // Risk Owner
      if (y > 267) { doc.addPage(); drawHeader(); y = 38; }
      doc.setFont('helvetica', 'bold');
      doc.text('Risk Owner: ', margin, y);
      const ownerLabelW = doc.getTextWidth('Risk Owner: ');
      doc.setFont('helvetica', 'normal');
      doc.text(ownerName, margin + ownerLabelW, y);
      y += 6;

      // Due date
      if (deadline) {
        if (y > 267) { doc.addPage(); drawHeader(); y = 38; }
        doc.setFont('helvetica', 'bold');
        doc.text('Due date to reach Target Level: ', margin, y);
        const dueLabelW = doc.getTextWidth('Due date to reach Target Level: ');
        doc.setFont('helvetica', 'normal');
        doc.text(deadline, margin + dueLabelW, y);
        y += 6;
      }

      // Mitigations section
      if (risk.mitigations?.length > 0) {
        if (y > 267) { doc.addPage(); drawHeader(); y = 38; }
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(themeR, themeG, themeB);
        doc.text('Actions/Controls to Manage Risks:', margin, y);
        y += 6;

        risk.mitigations.forEach((m: any) => {
          const statusText = m.status?.title || 'N/A';
          const bullet = `\u2022  ${m.description || ''}`;
          const bulletLines = doc.splitTextToSize(bullet, contentWidth - 4);

          if (y + bulletLines.length * 5 + 6 > 267) { doc.addPage(); drawHeader(); y = 38; }

          doc.setTextColor(50, 50, 50);
          doc.setFont('helvetica', 'normal');
          doc.text(bulletLines, margin + 2, y);
          y += bulletLines.length * 5;

          // Status on the same indentation
          doc.setFont('helvetica', 'bold');
          doc.text('Status: ', margin + 4, y);
          const statusLabelW = doc.getTextWidth('Status: ');
          doc.setFont('helvetica', 'normal');
          doc.text(statusText, margin + 4 + statusLabelW, y);
          y += 6;
        });
      }

      // Divider between risks
      y += 3;
      if (y <= 267) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageWidth - margin, y);
      }
      y += 6;
    });

    // Bar chart — same conditional placement logic
    const chartSpaceNeeded = 106;
    let chartY: number;

    if (y + chartSpaceNeeded > 275) {
      doc.addPage();
      drawHeader();
      chartY = 38;
    } else {
      y += 5;
      doc.setDrawColor(themeR, themeG, themeB);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 7;
      chartY = y;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Risk Level Comparison: Current vs Target', margin, chartY);
    chartY += 8;

    // Chart uses top-5 same as technical (bar chart stays readable)
    const top5 = allRisks.slice(0, 5);
    this.drawBarChart(doc, top5, chartY, margin, themeR, themeG, themeB);

    doc.save(`Risk-Report-Full-${this.scienceProgramsId}.pdf`);
  }

  public async SaveLandscapePDF(): Promise<void> {
    const risks: any[] = this.AllRisk?.risks || this.dataSource?.data || [];
    const top5 = [...risks]
      .sort(
        (a: any, b: any) =>
          b.current_likelihood * b.current_impact -
          a.current_likelihood * a.current_impact
      )
      .slice(0, 5);

    const logoBase64 = await this.getBase64FromUrl('assets/shared-image/cgiar-logo.png');

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = 297;
    const pageH = 210;
    const margin = 6;
    const themeR = 67, themeG = 98, themeB = 128;
    const logoH = 10;
    const logoW = logoH * (148 / 182);

    const stripHtml = (text: string): string =>
      text ? text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() : '';

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
    const minDescW   = 60;
    const minActW    = 100; // enough for "Actions and Controls to Manage Risk" header

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
      if (descW < minDescW) { descW = minDescW; actW = totalW - minDescW; }
      if (actW  < minActW)  { actW  = minActW;  descW = totalW - minActW; }
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

    // ── Find the largest font size that fits all rows on one page ────────────
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
        doc.setFont('helvetica', 'bold');
        const titleLines = doc.splitTextToSize(String(risk.title || ''), colW) as string[];
        doc.setFont('helvetica', 'normal');
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

    const programName  = this.sciencePrograms?.name || '';
    const activePhase = await this.phasesService.getActivePhase();
    const activePhaseYear = activePhase?.reporting_year || new Date().getFullYear();
    cols = buildCols(activePhaseYear);

    const narrative = this.sciencePrograms?.narrative || '';
    const progId = this.id || this.sciencePrograms?.id || '';
    const progCode = this.scienceProgramsId || this.sciencePrograms?.official_code || '';
    const programLink = `${window.location.origin}/home/${progId}/${progCode}`;

    // ── Header ──────────────────────────────────────────────────────────────
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

    // ── Draw table header row ─────────────────────────────────────────────────
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

    // ── Draw data rows with merged cells ────────────────────────────────────
    let y = actualRowsStartY;
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'normal');

    layout.riskLayouts.forEach((rl, ri) => {
      const rowH = rl.riskRowH;
      const bgR = ri % 2 === 1 ? 240 : 255;
      const bgG = ri % 2 === 1 ? 244 : 255;
      const bgB = ri % 2 === 1 ? 248 : 255;

      // ── Title / Description (col 0) ──
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

      // ── Sub-rows: Actions/Controls (col 1) ──
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

    doc.save(`Risk-Report-Landscape-${progCode}.pdf`);
  }

  private drawBarChart(
    doc: jsPDF,
    top5: any[],
    startY: number,
    margin: number,
    themeR: number,
    themeG: number,
    themeB: number
  ): void {
    const leftEdge = margin + 14; // 14 mm for Y-axis labels
    const plotW = 210 - margin * 2 - 14; // 166 mm
    const plotH = 70; // mm
    const bottomY = startY + plotH;
    const maxVal = 25;
    const scaleY = plotH / maxVal; // 2.8 mm per unit

    // Y-axis gridlines + labels
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    for (let v = 0; v <= maxVal; v += 5) {
      const lineY = bottomY - v * scaleY;
      doc.line(leftEdge, lineY, leftEdge + plotW, lineY);
      doc.setTextColor(120, 120, 120);
      doc.text(String(v), leftEdge - 2, lineY + 1, { align: 'right' });
    }

    // Axes
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.4);
    doc.line(leftEdge, startY, leftEdge, bottomY);   // Y-axis
    doc.line(leftEdge, bottomY, leftEdge + plotW, bottomY); // X-axis

    // Bars
    const groupW = plotW / 5;
    const barW = 12;
    const barGap = 4;
    const innerPad = (groupW - 2 * barW - barGap) / 2;

    top5.forEach((risk: any, i: number) => {
      const currentLevel = (risk.current_likelihood || 0) * (risk.current_impact || 0);
      const targetLevel = (risk.target_likelihood || 0) * (risk.target_impact || 0);
      const groupLeft = leftEdge + i * groupW + innerPad;

      // Current bar (theme blue)
      const currentH = currentLevel * scaleY;
      doc.setFillColor(themeR, themeG, themeB);
      doc.rect(groupLeft, bottomY - currentH, barW, currentH, 'F');

      // Target bar (green)
      const targetH = targetLevel * scaleY;
      doc.setFillColor(75, 175, 120);
      doc.rect(groupLeft + barW + barGap, bottomY - targetH, barW, targetH, 'F');

      // X-axis label
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`Risk ${i + 1}`, leftEdge + i * groupW + groupW / 2, bottomY + 5, { align: 'center' });
    });

    // Legend
    const legendY = bottomY + 13;
    doc.setFillColor(themeR, themeG, themeB);
    doc.rect(margin, legendY - 3, 5, 4, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Current Risk Level', margin + 7, legendY);

    doc.setFillColor(75, 175, 120);
    doc.rect(margin + 55, legendY - 3, 5, 4, 'F');
    doc.text('Target Risk Level', margin + 63, legendY);
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

  displayedColumns: string[] = [
    'ID',
    'Risk Title',
    'Risk Category',
    'Current Risk Level',
    'Target Risk Level',
    'Risk Owner',
    'created_by',
    'due date',
  ];

  displayedColumnsPdf: string[] = [];

  user_info: any;
  id: any;
  scienceProgramsId: any;
  riskUsers: any;
  my_roles: any;
  locked: any = {};
  connection = true;
  sciencePrograms:any;
  async ngOnInit() {
    this.socket.on('locked', (data: any) => {
      this.locked = data;
      console.log('locked = >>>>>>>>', data);
    });
    this.socket.on('connect', () => {
      this.connection = true;
    });
    this.socket.on('disconnect', () => {
      this.dialog.closeAll();
      this.connection = false;
    });
    this.savePdf.subscribe((type: string) => {
      if (type === 'full') {
        this.SaveFullDetailsPDF();
      } else if (type === 'landscape') {
        this.SaveLandscapePDF();
      } else {
        this.SavePDF();
      }
    });
    this.user_info = this.userService.getLogedInUser();
    console.log(this.user_info);
    // my_roles

    const params: any = this.activatedRoute?.snapshot.params;

    this.id = +params.id;
    this.scienceProgramsId = params.initiativeId;
    this.riskUsers = await this.riskService.getRiskUsers(this.id);
    this.sciencePrograms = await this.initiativeService.getInitiative(this.id);
    this.my_risks = this.sciencePrograms.risks
    .filter(
      (d: any) =>
        d?.risk_owner && d?.risk_owner?.user?.id == this.user_info.id
    )
    .map((d: any) => d);

    this.my_roles = this.riskUsers
      .filter((d: any) => d?.user?.id == this?.user_info?.id)
      .map((d: any) => d.role);
    if (this.canEdit() && !this.showingVersion && !this.toPdf)
      this.displayedColumns.push('Actions');
    setTimeout(() => {
      if (this.my_risks?.length && !this.canEdit())
        this.displayedColumns.push('OwnerActions');
      console.log('OwnerActions', this.my_risks);
    }, 1000);

    if (
      this.showReduntent == false &&
      this.displayedColumns.includes('Redundant')
    ) {
      this.displayedColumns.pop();
    }
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  unlock(risk_id: any) {
    console.log('unlock');
    this.socket.emit('risk-unlock', risk_id);
  }
  // editRisk(data: any) {
  //   const dialogRef = this.dialog.open(NewRiskComponent, {
  //     height: '90vh',
  //     data: { taskRole: 'edit', risk: data },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     this.refresh.emit(result);
  //     this.unlock(data.id);
  //   });
  // }

  async deleteRisk(risk: any) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        // maxWidth: '400px',
        data: {
          title: 'Delete',
          message: `Are you sure you want to delete risk ${risk.title} ?`,
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult) {
          await this.riskService.deleteRisk(risk.id, this.id);
          this.refresh.emit();
          this.toastr.success('Success', `${risk.title} has been deleted`);
        }
      });
  }

  canPublish() {
    console.log(
      this.user_info.role == 'admin' || this.my_roles.includes(ROLES.LEAD)
    );
    return this.user_info.role == 'admin' || this.my_roles.includes(ROLES.LEAD);
  }
  async checkValue(id: number, value: any) {
    await this.riskService.updateRedundant(id, this.id , value);
    this.refresh.emit();
  }
  canEdit() {
    return (
      this.user_info.role == 'admin' ||
      this.my_roles?.includes(ROLES.LEAD) ||
      this.my_roles?.includes(ROLES.COORDINATOR)
    );
  }
  canEditOwner(element: any) {
    return this.my_risks.filter((d: any) => d.id == element.id).length > 0;
  }

  html: any;

  panelOpenState = false;

  generateTable(element: any) {
    const mitigationsList: any[] = [];
    element.mitigations.forEach((mitigation: any) => {
      mitigationsList.push(
        `<tr>
      <td style=" width: 55rem;padding: 1rem; border: 1px solid #b9b9b9b5;color: #0f212f;text-align: justify; font-family: Poppins;font-size: 1.3rem;font-style: normal;font-weight: 400;line-height: 114.5%;">${mitigation.description}</td>
      <td style=" width: 20rem;padding: 1rem;border: 1px solid #b9b9b9b5;color: #0f212f;text-align: center; font-family: Poppins;font-size: 1.3rem;font-style: normal;font-weight: 400;line-height: 114.5%;">${mitigation?.status?.title}</td></tr>`
      );
    });
    let html = `
   <div class="table-box">
   <div class="table-box ">
                <table class="mat-elevation-z8 table-box " style=" width: 100%; overflow: auto; margin-top: 1rem; margin-bottom: 4rem;">
                  <tr>
                    <th  style="width:55rem;padding:1rem; font-family: Poppins;font-size: 1.4rem;font-weight: 500;line-height: 130%;background-color: #436280;color: #ffffff;letter-spacing: 0em;text-align: center;font-style: normal;">Actions/Controls description</th>
                    <th style=" width: 20rem; padding: 1rem; font-family: Poppins;font-size: 1.4rem;font-weight: 500;line-height: 130%;background-color: #436280;color: #ffffff;letter-spacing: 0em;text-align: center;font-style: normal;">Status</th>
                  </tr>
                  ${mitigationsList.join('')}
                </table>
                </div>`;

    if (mitigationsList.length > 0) return html;
    else return '';
  }
}
