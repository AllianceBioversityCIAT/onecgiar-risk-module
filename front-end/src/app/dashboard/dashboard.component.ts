import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import SunburstModule from 'highcharts/modules/sunburst';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

import { ApiRiskDetailsService } from '../shared-services/risk-details-services/api-risk-details.service';
import { DashboardService } from '../services/dashboard.service';
import { HeaderService } from '../header.service';
import { Meta, Title } from '@angular/platform-browser';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

HighchartsMore(Highcharts);
SunburstModule(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public riskUrl = {
    home: '/home/risk-management',
  };
  Highcharts = Highcharts;

  /** false = Programs (isProject=0), true = Projects (isProject=1) */
  isProjectFilter = false;

  data: any = null;
  status: any = null;
  categoriesCount: any = null;
  risk_profile_current_chartOptions: any = null;
  risk_profile_target_chartOptions: any = null;
  avg_level_chartOptions: any = null;
  categories_count_chartOptions: any = null;
  status_of_action_chartOptions: any = null;
  category_group_chartOptions: any = null;
  categoriesLevels: any = null;
  details: any = null;
  reportedActions: any[] = [];
  filteredActions: any[] = [];
  displayedActions: any[] = [];
  showAllActions = false;
  displayLimit = 10;

  // Filters
  filterProgram = '';
  filterStatus = '';
  filterDueDateFrom = '';
  filterDueDateTo = '';

  // Sort
  sortField = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Dropdown options
  programOptions: string[] = [];
  statusOptions: string[] = [];

  groups: any = null;
  action_areas: any = null;
  totalStatus: any = null;

  constructor(
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
    // initial load (Programs)
    await this.loadDashboard();
    this.title.setTitle('Risk dashboard');
    this.meta.updateTag({ name: 'description', content: 'Risk dashboard' });
  }

  /** back to Programs (isProject=0) */
  selectPrograms() {
    if (this.isProjectFilter) {
      this.isProjectFilter = false;
      this.loadDashboard();
    }
  }

  /** switch to Projects (isProject=1) */
  selectProjects() {
    if (!this.isProjectFilter) {
      this.isProjectFilter = true;
      this.loadDashboard();
    }
  }

  /** called whenever you click “Programs” or “Projects” */
  onTypeToggle(event: MatButtonToggleChange) {
    this.isProjectFilter = event.value === 'project';
    this.loadDashboard();
  }
  /** reload _all_ dashboard data using current isProjectFilter */
  private async loadDashboard() {
    const projectFlag = this.isProjectFilter ? 1 : 0;

    // now pass that number to each service call
    this.data = await this.dashboardService.current(projectFlag);
    this.details = await this.dashboardService.details(projectFlag);

    // Flatten programs → risks → mitigations into a flat row per mitigation
    this.reportedActions = [];
    for (const program of this.details) {
      for (const risk of program.risks || []) {
        for (const mitigation of risk.mitigations || []) {
          this.reportedActions.push({
            risk_id: risk.id,
            official_code: program.official_code,
            risk_title: risk.title,
            risk_description: risk.description,
            due_date: risk.due_date,
            action_description: mitigation.description,
            action_status: mitigation.status?.title || '',
          });
        }
      }
    }

    // Extract unique filter options and apply filters
    this.programOptions = [...new Set(this.reportedActions.map(r => r.official_code))].sort();
    this.statusOptions = [...new Set(this.reportedActions.map(r => r.action_status).filter(Boolean))].sort();
    this.applyFilters();

    this.categoriesLevels = await this.dashboardService.categoriesLevels(
      projectFlag
    );
    this.categoriesCount = await this.dashboardService.categoriesCount(
      projectFlag
    );
    this.groups = await this.dashboardService.category_groups(projectFlag);
    this.action_areas = await this.dashboardService.actionAreas(projectFlag);
    this.status = await this.dashboardService.status(projectFlag);

    this.totalStatus = this.status.reduce(
      (sum: any, item: any) => sum + parseInt(item.total_actions, 10),
      0
    );

    // recreate every chart with fresh data
    this.risk_profile_target_chartOptions = this.riskProfile(
      this.data,
      'Target'
    );
    this.risk_profile_current_chartOptions = this.riskProfile(
      this.data,
      'Current'
    );

    this.avg_level_chartOptions = {
      chart: { type: 'column' },
      title: { text: 'Average level of risk by action area', align: 'center' },
      xAxis: {
        categories: this.categoriesLevels
          .filter((d: any) => d.current_level)
          .map((d: any) => d.title),
        title: { text: 'Categories' },
        gridLineWidth: 1,
        lineWidth: 0,
      },
      yAxis: {
        min: 0,
        title: { text: 'Risk level', align: 'middle' },
        labels: { overflow: 'justify' },
        gridLineWidth: 0,
      },
      tooltip: { valueSuffix: '' },
      plotOptions: {
        bar: {
          borderRadius: '50%',
          dataLabels: { enabled: true },
          groupPadding: 0.1,
        },
      },
      credits: { enabled: false },
      series: [
        {
          name: 'Current',
          colorByPoint: true,
          data: this.categoriesLevels
            .filter((d: any) => d.current_level)
            .map((d: any) => +d.current_level),
        },
        {
          name: 'Target',
          colorByPoint: true,
          data: this.categoriesLevels
            .filter((d: any) => d.target_level)
            .map((d: any) => +d.target_level),
        },
      ],
    };

    this.status_of_action_chartOptions = {
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
          '<tr><th>' +
          '</th><td>{series.name}: <b>{point.percentage:.1f}%</b></td></tr>',
        footerFormat: '</table>',
        followPointer: true,
      },
      accessibility: {
        point: { valueSuffix: '%' },
      },
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
          name: 'Actions',
          colorByPoint: true,
          innerSize: '55%',
          data: this.status.map((item: any) => ({
            name: item.title,
            y: parseInt(item.total_actions, 10),
          })),
        },
      ],
    };
    this.categories_count_chartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      credits: {
        enabled: false,
      },
      // title: {
      //   text: 'Risk Categories',
      //   align: 'center',
      // },
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
          '<tr><th>' +
          '</th><td>{series.name}: <b>{point.percentage:.1f}%</b></td></tr>',
        footerFormat: '</table>',
        followPointer: true,
      },
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
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
              backgroundColor: '#fff',
              border: '1px solid #172f8f !important',
              borderRadius: '5px',
              opacity: '1',
              zIndex: '9999 !important',
              padding: '0.8em',
              left: '0 !important',
              top: '0 !important',
            },
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
        },
      },
      series: [
        {
          name: 'Usage',
          colorByPoint: true,
          innerSize: '55%',
          data: this.categoriesCount.map((d: any) => {
            return { name: d.title, y: +d.total_count };
          }),
        },
      ],
    };

    this.category_group_chartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      credits: {
        enabled: false,
      },
      // title: {
      //   text: 'Categories groups',
      //   align: 'center',
      // },
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
          '<tr><th>' +
          '</th><td>{series.name}: <b>{point.percentage:.1f}%</b></td></tr>',
        footerFormat: '</table>',
        followPointer: true,
      },
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
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
              backgroundColor: '#fff',
              border: '1px solid #172f8f !important',
              borderRadius: '5px',
              opacity: '1',
              zIndex: '9999 !important',
              padding: '0.8em',
              left: '0 !important',
              top: '0 !important',
            },
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
        },
      },
      series: [
        {
          name: 'Usage',
          colorByPoint: true,
          innerSize: '55%',
          data: this.groups.map((d: any) => {
            return { name: d.name, y: +d.total_count };
          }),
        },
      ],
    };

    this.title.setTitle('Risk dashboard');
    this.meta.updateTag({ name: 'description', content: 'Risk dashboard' });
  }

  applyFilters() {
    let result = [...this.reportedActions];

    if (this.filterProgram) {
      result = result.filter(r => r.official_code === this.filterProgram);
    }
    if (this.filterStatus) {
      result = result.filter(r => r.action_status === this.filterStatus);
    }
    if (this.filterDueDateFrom) {
      const from = new Date(this.filterDueDateFrom);
      result = result.filter(r => r.due_date && new Date(r.due_date) >= from);
    }
    if (this.filterDueDateTo) {
      const to = new Date(this.filterDueDateTo);
      result = result.filter(r => r.due_date && new Date(r.due_date) <= to);
    }

    // Re-apply current sort
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
    this.filteredActions = this.sortArray(this.filteredActions, field, this.sortDirection);
    this.updateDisplayedActions();
  }

  private sortArray(arr: any[], field: string, dir: 'asc' | 'desc'): any[] {
    return [...arr].sort((a, b) => {
      const valA = field === 'due_date' ? (a[field] ? new Date(a[field]).getTime() : 0) : a[field];
      const valB = field === 'due_date' ? (b[field] ? new Date(b[field]).getTime() : 0) : b[field];
      if (valA < valB) return dir === 'asc' ? -1 : 1;
      if (valA > valB) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  resetFilters() {
    this.filterProgram = '';
    this.filterStatus = '';
    this.filterDueDateFrom = '';
    this.filterDueDateTo = '';
    this.sortField = '';
    this.sortDirection = 'asc';
    this.applyFilters();
  }

  exportExcel() {
    const data = this.filteredActions.map(row => ({
      'Risk id': row.risk_id,
      'ID': row.official_code,
      'Risk': row.risk_title,
      'Description': row.risk_description,
      'Due date': row.due_date,
      'Actions/Controls': row.action_description,
      'Status': row.action_status,
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
        title: {
          text: `<span class="chart-title"> ${type} impact</span>`,
        },
        labels: { format: '{value}' },
      },
      yAxis: {
        startOnTick: false,
        endOnTick: false,
        title: {
          text: `<span class="chart-title"> ${type} Likelihood</span>`,
        },
        labels: { format: '{value}' },
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

    const logoBase64 = await this.getBase64FromUrl('assets/shared-image/cgiar-logo.png');

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = 297;
    const pageH = 210;
    const margin = 12;
    const themeR = 67, themeG = 98, themeB = 128;

    const cols = [
      { header: 'ID',                 key: 'official_code',      w: 18 },
      { header: 'Risk Title',         key: 'risk_title',         w: 50 },
      { header: 'Description',        key: 'risk_description',   w: 68 },
      { header: 'Mitigation Action',  key: 'action_description', w: 68 },
      { header: 'Status',             key: 'action_status',      w: 30 },
      { header: 'Deadline',           key: 'due_date',           w: 27 },
    ];

    const cellPad     = 2;
    const hdrH        = 8;
    const fontSize    = 7.5;
    const lineH       = 3.5;
    const totalColW   = cols.reduce((s, c) => s + c.w, 0);
    const tableX      = (297 - totalColW) / 2;  // centered horizontally
    const tableHdrY   = 23;                      // below logo + title
    const programLabel = this.filterProgram || 'All Programs';

    const drawPageHeader = () => {
      const logoH = 10;
      const logoW = logoH * (148 / 182);
      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', margin, 3, logoW, logoH);
      }
      // "PRMS Risk" top-left
      doc.setTextColor(themeR, themeG, themeB);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('PRMS Risk', margin + logoW + 3, 10);
      // Program title centered above table
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

    // Set font BEFORE splitTextToSize so wrapping matches the render size
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
          val = isNaN(d.getTime()) ? String(val) : d.toLocaleDateString('en-GB');
        }
        return doc.splitTextToSize(String(val), col.w - cellPad * 2) as string[];
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
        doc.setFillColor(rowAlt ? 240 : 255, rowAlt ? 244 : 255, rowAlt ? 248 : 255);
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
