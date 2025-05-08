import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import SunburstModule from 'highcharts/modules/sunburst';

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
      chart: { type: 'column' },
      credits: { enabled: false },
      subtitle: { text: 'Status of action', align: 'center' },
      xAxis: { categories: this.status.map((item: any) => item.title) },
      yAxis: {
        min: 0,
        title: { text: 'Percentage (%)' },
        labels: { format: '{value}%' },
      },
      tooltip: {
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0)',
        shadow: false,
        useHTML: true,
        pointFormat: '<b>{point.y}%</b>',
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
      },
      series: [
        {
          type: 'column',
          name: 'Total Actions',
          data: this.status.map((item: any) => {
            const count = parseInt(item.total_actions, 10);
            return parseFloat(((count / this.totalStatus) * 100).toFixed(1));
          }),
          colorByPoint: true,
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
          data: this.groups.map((d: any) => {
            return { name: d.name, y: +d.total_count };
          }),
        },
      ],
    };

    this.title.setTitle('Risk dashboard');
    this.meta.updateTag({ name: 'description', content: 'Risk dashboard' });
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
