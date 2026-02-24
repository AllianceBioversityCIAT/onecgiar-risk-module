import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import SunburstModule from 'highcharts/modules/sunburst';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
}
