import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import SunburstModule from 'highcharts/modules/sunburst';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { ApiRiskDetailsService } from '../shared-services/risk-details-services/api-risk-details.service';
import { DashboardService } from '../services/dashboard.service';
import { HeaderService } from '../header.service';
import { Meta, Title } from '@angular/platform-browser';

HighchartsMore(Highcharts);
SunburstModule(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('dashboardContent') dashboardContent!: ElementRef;

  public riskUrl = {
    home: '/home/risk-management',
  };
  Highcharts = Highcharts;

  // Global filters (control all visuals)
  globalType: 'program' | 'project' = 'program';
  globalProgram: string[] = [];
  globalCategory: string[] = [];
  globalCenter: string[] = [];
  globalActionStatus: string[] = [];

  // Table-specific filters
  filterDueDateFrom = '';
  filterDueDateTo = '';

  // Sort
  sortField = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Global filter dropdown options
  allProgramOptions: { code: string; name: string }[] = [];
  allCategoryOptions: string[] = [];
  allCenterOptions: string[] = [];
  allActionStatusOptions: string[] = [];

  // Chart options
  risk_profile_current_chartOptions: any = null;
  risk_profile_target_chartOptions: any = null;
  status_of_action_chartOptions: any = null;
  categories_count_chartOptions: any = null;

  // Data
  allDetails: any[] = [];
  filteredDetails: any[] = [];
  details: any = null;
  reportedActions: any[] = [];
  filteredActions: any[] = [];
  displayedActions: any[] = [];
  showAllActions = false;
  displayLimit = 10;

  constructor(
    private route: ActivatedRoute,
    private apiRiskDetailsService: ApiRiskDetailsService,
    private dashboardService: DashboardService,
    private headerService: HeaderService,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background =
      'linear-gradient(to right, #0F212F, #0E1E2B)';
    this.headerService.backgroundNavMain =
      'linear-gradient(to right, #436280, #30455B)';
    this.headerService.backgroundUserNavButton =
      'linear-gradient(to right, #436280, #30455B)';
  }

  async ngOnInit() {
    await this.loadDashboard();

    this.route.queryParams.subscribe((params) => {
      const program = params['program'];
      if (program) {
        this.globalProgram = [program];
      } else {
        this.globalProgram = [];
      }
      this.applyGlobalFilters();
    });

    this.title.setTitle('Risk Dashboard');
    this.meta.updateTag({ name: 'description', content: 'Risk Dashboard' });
  }

  /** Reload from backend when type changes (Programs / Projects) */
  onTypeChange() {
    this.globalProgram = [];
    this.globalCategory = [];
    this.globalCenter = [];
    this.globalActionStatus = [];
    this.loadDashboard();
  }

  /** Load all data from backend */
  private async loadDashboard() {
    const projectFlag = this.globalType === 'project' ? 1 : 0;
    this.allDetails = await this.dashboardService.details(projectFlag);
    this.extractFilterOptions();
    this.applyGlobalFilters();
  }

  /** Extract unique values for each filter dropdown from raw data */
  private extractFilterOptions() {
    const programs: { code: string; name: string }[] = [];
    const categories = new Set<string>();
    const centers = new Set<string>();
    const statuses = new Set<string>();

    for (const p of this.allDetails) {
      if (p.official_code) {
        programs.push({ code: p.official_code, name: p.name });
      }
      for (const o of p.organizations || []) {
        if (o.acronym) centers.add(o.acronym);
      }
      for (const r of p.risks || []) {
        if (r.category?.title) categories.add(r.category.title);
        for (const m of r.mitigations || []) {
          if (m.status?.title) statuses.add(m.status.title);
        }
      }
    }

    this.allProgramOptions = programs.sort((a, b) =>
      a.code.localeCompare(b.code)
    );
    this.allCategoryOptions = [...categories].sort();
    this.allCenterOptions = [...centers].sort();
    this.allActionStatusOptions = [...statuses].sort();
  }

  /** Apply global filters to all visuals */
  applyGlobalFilters() {
    let filtered = this.allDetails;

    // Program-level filters
    if (this.globalCenter.length) {
      filtered = filtered.filter((p: any) =>
        (p.organizations || []).some(
          (o: any) => this.globalCenter.includes(o.acronym)
        )
      );
    }
    if (this.globalProgram.length) {
      filtered = filtered.filter(
        (p: any) => this.globalProgram.includes(p.official_code)
      );
    }

    // Risk & mitigation level filters — deep filter
    filtered = filtered
      .map((p: any) => {
        let risks = [...(p.risks || [])];

        if (this.globalCategory.length) {
          risks = risks.filter(
            (r: any) => this.globalCategory.includes(r.category?.title)
          );
        }

        if (this.globalActionStatus.length) {
          risks = risks
            .map((r: any) => ({
              ...r,
              mitigations: (r.mitigations || []).filter(
                (m: any) => this.globalActionStatus.includes(m.status?.title)
              ),
            }))
            .filter((r: any) => r.mitigations.length > 0);
        }

        return { ...p, risks };
      })
      .filter((p: any) => p.risks.length > 0);

    this.filteredDetails = filtered;
    this.details = filtered;

    this.rebuildCharts();
    this.rebuildReportedActions();
  }

  /** Recompute all chart options from filteredDetails */
  private rebuildCharts() {
    // Bubble charts: average scores per program
    const scoreData = this.filteredDetails
      .map((p: any) => {
        const risks = p.risks || [];
        if (!risks.length) return null;
        const avg = (arr: number[]) =>
          arr.reduce((s, v) => s + v, 0) / arr.length;
        return {
          official_code: p.official_code,
          name: p.name,
          current_impact: avg(risks.map((r: any) => +r.current_impact)),
          current_likelihood: avg(
            risks.map((r: any) => +r.current_likelihood)
          ),
          target_impact: avg(risks.map((r: any) => +r.target_impact)),
          target_likelihood: avg(
            risks.map((r: any) => +r.target_likelihood)
          ),
        };
      })
      .filter(Boolean);

    this.risk_profile_current_chartOptions = this.riskProfile(
      scoreData,
      'Current'
    );
    this.risk_profile_target_chartOptions = this.riskProfile(
      scoreData,
      'Target'
    );

    // Status of Actions and Controls to Manage Risk pie
    const statusMap: Record<string, number> = {};
    for (const p of this.filteredDetails) {
      for (const r of p.risks || []) {
        for (const m of r.mitigations || []) {
          const s = m.status?.title || 'Unknown';
          statusMap[s] = (statusMap[s] || 0) + 1;
        }
      }
    }
    this.status_of_action_chartOptions = this.buildPieChart(
      Object.entries(statusMap).map(([name, y]) => ({ name, y })),
      'Actions'
    );

    // Risk categories pie
    const catMap: Record<string, number> = {};
    for (const p of this.filteredDetails) {
      for (const r of p.risks || []) {
        const c = r.category?.title || 'Unknown';
        catMap[c] = (catMap[c] || 0) + 1;
      }
    }
    this.categories_count_chartOptions = this.buildPieChart(
      Object.entries(catMap).map(([name, y]) => ({ name, y })),
      'Usage'
    );
  }

  private buildPieChart(
    data: { name: string; y: number }[],
    seriesName: string
  ) {
    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      credits: { enabled: false },
      tooltip: {
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0)',
        shadow: false,
        useHTML: true,
        style: {
          textAlign: 'left',
          color: '#04030f',
          fontFamily: '"Poppins", sans-serif !important',
          fontSize: '1.6rem',
          fontStyle: 'normal',
          fontWeight: '400',
          backgroundColor: '#fff',
          border: '1px solid #172f8f !important',
          borderRadius: '5px',
          opacity: '1',
          zIndex: '9999 !important',
          padding: '0.8em',
          left: '0 !important',
          top: '0 !important',
        },
        headerFormat: '<table>',
        pointFormat:
          '<tr><th colspan="2"><span class="chart-bubble-title"><b class="title-tooltip">{point.name}</b></span></th></tr>' +
          '<tr><th></th><td>{series.name}: <b>{point.percentage:.1f}%</b></td></tr>',
        footerFormat: '</table>',
        followPointer: true,
      },
      accessibility: { point: { valueSuffix: '%' } },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            style: {
              textAlign: 'left',
              color: '#04030f',
              fontFamily: '"Poppins", sans-serif !important',
              fontSize: '1.6rem',
              fontStyle: 'normal',
              fontWeight: '400',
            },
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
        },
      },
      series: [
        {
          name: seriesName,
          colorByPoint: true,
          innerSize: '55%',
          data,
        },
      ],
    };
  }

  /** Flatten filteredDetails into reportedActions rows */
  private rebuildReportedActions() {
    this.reportedActions = [];
    for (const program of this.filteredDetails) {
      for (const risk of program.risks || []) {
        for (const mitigation of risk.mitigations || []) {
          this.reportedActions.push({
            risk_id: risk.id,
            official_code: program.official_code,
            risk_category: risk.category?.title || '',
            risk_category_description: risk.category?.description || '',
            centers: (program.organizations || []).map((o: any) => o.acronym),
            risk_title: risk.title,
            risk_description: risk.description,
            due_date: risk.due_date,
            action_description: mitigation.description,
            action_status: mitigation.status?.title || '',
            action_status_description: mitigation.status?.description || '',
          });
        }
      }
    }
    this.applyTableFilters();
  }

  /** Table-level filters (due dates only) */
  applyTableFilters() {
    let result = [...this.reportedActions];

    if (this.filterDueDateFrom) {
      const from = new Date(this.filterDueDateFrom);
      result = result.filter(r => r.due_date && new Date(r.due_date) >= from);
    }
    if (this.filterDueDateTo) {
      const to = new Date(this.filterDueDateTo);
      result = result.filter(r => r.due_date && new Date(r.due_date) <= to);
    }

    if (this.sortField) {
      result = this.sortArray(result, this.sortField, this.sortDirection);
    }

    this.filteredActions = result;
    this.showAllActions = false;
    this.updateDisplayedActions();
  }

  updateDisplayedActions() {
    this.displayedActions = this.showAllActions
      ? this.filteredActions
      : this.filteredActions.slice(0, this.displayLimit);
  }

  toggleShowAll() {
    this.showAllActions = !this.showAllActions;
    this.updateDisplayedActions();
  }

  sortBy(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.filteredActions = this.sortArray(
      this.filteredActions,
      field,
      this.sortDirection
    );
    this.updateDisplayedActions();
  }

  private sortArray(arr: any[], field: string, dir: 'asc' | 'desc'): any[] {
    return [...arr].sort((a, b) => {
      const valA =
        field === 'due_date'
          ? a[field]
            ? new Date(a[field]).getTime()
            : 0
          : a[field];
      const valB =
        field === 'due_date'
          ? b[field]
            ? new Date(b[field]).getTime()
            : 0
          : b[field];
      if (valA < valB) return dir === 'asc' ? -1 : 1;
      if (valA > valB) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  resetGlobalFilters() {
    this.globalProgram = [];
    this.globalCategory = [];
    this.globalCenter = [];
    this.globalActionStatus = [];
    this.applyGlobalFilters();
  }

  resetTableFilters() {
    this.filterDueDateFrom = '';
    this.filterDueDateTo = '';
    this.sortField = '';
    this.sortDirection = 'asc';
    this.applyTableFilters();
  }

  exportExcel() {
    const data = this.filteredActions.map(row => ({
      'Risk ID': row.risk_id,
      ID: row.official_code,
      Risk: row.risk_title,
      Description: row.risk_description,
      'Due date': row.due_date,
      'Actions/Controls': row.action_description,
      Status: row.action_status,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reported Actions');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf]), 'Reported-Actions-Controls.xlsx');
  }

  riskProfile(data: any, type: string) {
    return {
      chart: { type: 'bubble', plotBorderWidth: 1, zoomType: 'xy' },
      legend: { enabled: false },
      credits: { enabled: false },
      xAxis: {
        gridLineWidth: 1,
        allowDecimals: false,
        min: 1,
        max: 5,
        title: {
          text: `<span class="chart-title"> ${type} impact</span>`,
        },
        labels: { format: '{value}', style: { fontSize: '14px' } },
      },
      yAxis: {
        startOnTick: false,
        endOnTick: false,
        allowDecimals: false,
        min: 1,
        max: 5,
        title: {
          text: `<span class="chart-title"> ${type} Likelihood</span>`,
        },
        labels: { format: '{value}', style: { fontSize: '14px' } },
        accessibility: { rangeDescription: 'Range: 1 to 5' },
      },
      tooltip: {
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0)',
        shadow: false,
        useHTML: true,
        headerFormat: '<table>',
        pointFormat:
          '<tr><th colspan="2">{point.name}</th></tr>' +
          `<tr><td>${type} impact:</td><td>{point.x}</td></tr>` +
          `<tr><td>${type} likelihood:</td><td>{point.y}</td></tr>`,
        footerFormat: '</table>',
        followPointer: true,
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '<p class="text">{point.official_code}</p>',
          },
        },
        bubble: {
          color: '#436280',
        },
      },
      series: [
        {
          data: data.map((d: any) => ({
            x: +d[type === 'Target' ? 'target_impact' : 'current_impact'],
            y: +d[
              type === 'Target' ? 'target_likelihood' : 'current_likelihood'
            ],
            ...d,
          })),
        },
      ],
    };
  }

  color(level: number) {
    switch (level) {
      case 25:
        return `background-color: #1f6ca6;`;
      case 20:
        return `background-color: #357AAE;`;
      case 16:
        return `background-color: #257fc2;`;
      case 12:
        return `background-color: #3090d9;`;
      case 9:
        return `background-color: #0091ff;`;
      default:
        return `background-color: #6ab8f2;`;
    }
  }

  async exportLandscapePDF(): Promise<void> {
    const rows = this.filteredActions;
    if (!rows.length) return;

    const logoBase64 = await this.getBase64FromUrl(
      'assets/shared-image/cgiar-logo.png'
    );

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });
    const pageH = 210;
    const margin = 12;
    const themeR = 67,
      themeG = 98,
      themeB = 128;

    const cols = [
      { header: 'ID', key: 'official_code', w: 18 },
      { header: 'Risk Title', key: 'risk_title', w: 50 },
      { header: 'Description', key: 'risk_description', w: 68 },
      { header: 'Mitigation Action', key: 'action_description', w: 68 },
      { header: 'Status', key: 'action_status', w: 30 },
      { header: 'Deadline', key: 'due_date', w: 27 },
    ];

    const cellPad = 2;
    const hdrH = 8;
    const fontSize = 7.5;
    const lineH = 3.5;
    const totalColW = cols.reduce((s, c) => s + c.w, 0);
    const tableX = (297 - totalColW) / 2;
    const tableHdrY = 23;
    const programLabel = this.globalProgram.length ? this.globalProgram.join(', ') : 'All Programs';

    const drawPageHeader = () => {
      const logoH = 10;
      const logoW = logoH * (148 / 182);
      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', margin, 3, logoW, logoH);
      }
      doc.setTextColor(themeR, themeG, themeB);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('PRMS Risk', margin + logoW + 3, 10);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(programLabel, 297 / 2, 19, { align: 'center' });
    };

    const drawTableHeader = (y: number) => {
      let x = tableX;
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      for (const col of cols) {
        doc.setFillColor(themeR, themeG, themeB);
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.3);
        doc.rect(x, y, col.w, hdrH, 'FD');
        doc.setTextColor(255, 255, 255);
        doc.text(col.header, x + cellPad, y + hdrH / 2 + 1.5);
        x += col.w;
      }
    };

    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'normal');

    drawPageHeader();
    let y = tableHdrY;
    drawTableHeader(y);
    y += hdrH;

    let rowAlt = false;
    for (const row of rows) {
      const cellTexts = cols.map(col => {
        let val: string = row[col.key] ?? '';
        if (col.key === 'due_date' && val) {
          const d = new Date(val);
          val = isNaN(d.getTime())
            ? String(val)
            : d.toLocaleDateString('en-GB');
        }
        return doc.splitTextToSize(
          String(val),
          col.w - cellPad * 2
        ) as string[];
      });

      const maxLines = Math.max(...cellTexts.map(t => t.length));
      const rowH = Math.max(6, maxLines * lineH + cellPad * 2);

      if (y + rowH > pageH - 8) {
        doc.addPage();
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', 'normal');
        drawPageHeader();
        y = tableHdrY;
        drawTableHeader(y);
        y += hdrH;
        rowAlt = false;
      }

      let x = tableX;
      for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        doc.setFillColor(
          rowAlt ? 240 : 255,
          rowAlt ? 244 : 255,
          rowAlt ? 248 : 255
        );
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.2);
        doc.rect(x, y, col.w, rowH, 'FD');
        doc.setTextColor(30, 30, 30);
        let textY = y + cellPad + fontSize * 0.35;
        for (const line of cellTexts[i]) {
          doc.text(line, x + cellPad, textY);
          textY += lineH;
        }
        x += col.w;
      }
      y += rowH;
      rowAlt = !rowAlt;
    }

    doc.save('Report-Landscape.pdf');
  }

  async exportDashboardPDF(): Promise<void> {
    const el = this.dashboardContent?.nativeElement;
    if (!el) return;

    // Hide filter bars during capture
    const filterBars = el.querySelectorAll('.actions-filter-bar');
    filterBars.forEach((bar: HTMLElement) => bar.style.display = 'none');

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Restore filter bars
    filterBars.forEach((bar: HTMLElement) => bar.style.display = '');

    const imgData = canvas.toDataURL('image/png');
    const imgW = canvas.width;
    const imgH = canvas.height;

    // Fit to A4 landscape
    const pdfW = 297;
    const pdfH = 210;
    const margin = 10;
    const contentW = pdfW - margin * 2;
    const scaledH = (imgH * contentW) / imgW;

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // If content fits on one page
    if (scaledH <= pdfH - margin * 2) {
      doc.addImage(imgData, 'PNG', margin, margin, contentW, scaledH);
    } else {
      // Multi-page: slice the canvas into page-sized chunks
      const pageContentH = pdfH - margin * 2;
      const sourcePageH = (pageContentH / scaledH) * imgH;
      let srcY = 0;
      let page = 0;

      while (srcY < imgH) {
        if (page > 0) doc.addPage();
        const sliceH = Math.min(sourcePageH, imgH - srcY);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = imgW;
        sliceCanvas.height = sliceH;
        sliceCanvas.getContext('2d')!.drawImage(
          canvas, 0, srcY, imgW, sliceH, 0, 0, imgW, sliceH
        );
        const sliceImg = sliceCanvas.toDataURL('image/png');
        const renderH = (sliceH * contentW) / imgW;
        doc.addImage(sliceImg, 'PNG', margin, margin, contentW, renderH);
        srcY += sourcePageH;
        page++;
      }
    }

    doc.save('Dashboard-Report.pdf');
  }

  private getBase64FromUrl(url: string): Promise<string | null> {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d')!.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }
}
