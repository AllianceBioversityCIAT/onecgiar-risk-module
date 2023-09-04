import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiRiskDetailsService } from '../shared-services/risk-details-services/api-risk-details.service';
import * as Highcharts from 'highcharts';
import { DashboardService } from '../services/dashboard.service';
import { HeaderService } from '../header.service';
declare var require: any;
require('highcharts/highcharts-more.js')(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public riskUrl = {
    home: '/home/risk-management',
  };

  constructor(
    private apiRiskDetailsService: ApiRiskDetailsService,
    private dashboardService: DashboardService,
    private headerService: HeaderService
  ) {
    this.headerService.background = '#0f212f';
    this.headerService.backgroundNavMain = '#436280';
    this.headerService.backgroundUserNavButton='#436280'
  }

  data: any = null;
  status: any = null;
  categoriesCount: any = null;
  risk_profile_current_chartOptions: any = null;
  risk_profile_target_chartOptions: any = null;
  avg_level_chartOptions: any = null;
  categories_count_chartOptions: any = null;
  status_of_action_chartOptions: any = null;
  action_areas_chartOptions: any = null;
  category_group_chartOptions: any = null;
  categoriesLevels: any = null;
  details: any = null;
  groups: any = null;
  action_areas: any = null;
  async ngOnInit() {
    this.data = await this.dashboardService.current();
    this.details = await this.dashboardService.details();
    this.categoriesLevels = await this.dashboardService.categoriesLevels();
    this.categoriesCount = await this.dashboardService.categoriesCount();
    this.groups = await this.dashboardService.category_groups();
    this.action_areas = await this.dashboardService.actionAreas();

    console.log(this.groups, this.action_areas);
    this.status = await this.dashboardService.status();
    this.risk_profile_target_chartOptions = this.riskProfile(
      this.data,
      'Target'
    );
    this.risk_profile_current_chartOptions = this.riskProfile(
      this.data,
      'Current'
    );

    this.avg_level_chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Average level of risk by action area',
        align: 'center',
      },
      xAxis: {
        categories: this.categoriesLevels
          .filter((d: any) => d.current_level)
          .map((d: any) => d.title),
        title: {
          text: 'Categories',
        },
        gridLineWidth: 1,
        lineWidth: 0,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Risk level',
          align: 'middle',
        },
        labels: {
          overflow: 'justify',
        },
        gridLineWidth: 0,
      },
      tooltip: {
        valueSuffix: '',
      },
      plotOptions: {
        bar: {
          borderRadius: '50%',
          dataLabels: {
            enabled: true,
          },
          groupPadding: 0.1,
        },
      },
      credits: {
        enabled: false,
      },
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
      credits: {
        enabled: false,
      },
      // title: {
      //   text: 'Status of action',
      //   align: 'center',
      // },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
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
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
        },
      },
      series: [
        {
          name: 'Usage',
          colorByPoint: true,
          data: this.status
            .filter((d: any) => d.total_actions)
            .map((d: any) => {
              return { name: d.title, y: +d.total_actions };
            }),
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
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
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

    this.action_areas_chartOptions = {
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
      //   text: 'Action Areas',
      //   align: 'center',
      // },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
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
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
        },
      },
      series: [
        {
          name: 'Usage',
          colorByPoint: true,
          data: this.action_areas.map((d: any) => {
            return { name: d.name, y: +d.total_count };
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
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
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
  }
  Highcharts: typeof Highcharts = Highcharts;

  riskProfile(data: any, type: string) {
    return {
      chart: {
        type: 'bubble',
        plotBorderWidth: 1,
        zoomType: 'xy',
      },

      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      // title: {
      //   text: type + ' Risk profile',
      // },

      xAxis: {
        gridLineWidth: 1,
        title: {
          text: type + ' impact',
        },
        labels: {
          format: '{value}',
        },
        accessibility: {
          rangeDescription: 'Range: 1 to 5',
        },
      },

      yAxis: {
        startOnTick: false,
        endOnTick: false,
        title: {
          text: type + ' liklyhood',
        },
        labels: {
          format: '{value}',
        },
        maxPadding: 0.2,
        accessibility: {
          rangeDescription: 'Range: 1 to 5',
        },
      },

      tooltip: {
        useHTML: true,
        headerFormat: '<table>',
        pointFormat:
          '<tr><th colspan="2"><h3>{point.name}</h3></th></tr>' +
          '<tr><th>' +
          type +
          ' impact:</th><td>{point.x}</td></tr>' +
          '<tr><th>' +
          type +
          ' liklyhood:</th><td>{point.y}</td></tr>',
        footerFormat: '</table>',
        followPointer: true,
      },

      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.official_code}',
          },
        },
      },
      series: [
        {
          data: data.map((d: any) => {
            return {
              x: +d[type == 'Target' ? 'target_impact' : 'current_impact'],
              y: +d[
                type == 'Target' ? 'target_likelihood' : 'current_likelihood'
              ],
              ...d,
            };
          }),
          colorByPoint: true,
        },
      ],
    };
  }

  color(level: number) {
    switch (level) {
      case 25:
        return ` background-color: #1f6ca6;`;
      case 20:
        return ` background-color: #357AAE;`;

      case 16:
        return ` background-color: #257fc2;`;
      case 12:
        return ` background-color: #3090d9;`;
      case 9:
        return ` background-color: #0091ff;`;

      default:
        return ` background-color: #6ab8f2;`;
    }
  }
}
