import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiRiskDetailsService } from '../shared-services/risk-details-services/api-risk-details.service';
import * as Highcharts from 'highcharts';
import { DashboardService } from '../services/dashboard.service';
import { HeaderService } from '../header.service';
import { Meta, Title } from '@angular/platform-browser';
import { PhasesService } from '../services/phases.service';
declare var require: any;
import HighchartsMore from 'highcharts/highcharts-more';
import SunburstModule from 'highcharts/modules/sunburst'; 
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

  constructor(
    private phasesService: PhasesService,
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
  activePhase: any;
  organizationData: any = null;
  organizationChart: any = null;

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
  totalStatus: any = null;
  async ngOnInit() {
    this.data = await this.dashboardService.current();
    this.details = await this.dashboardService.details();
    this.categoriesLevels = await this.dashboardService.categoriesLevels();
    this.categoriesCount = await this.dashboardService.categoriesCount();
    this.groups = await this.dashboardService.category_groups();
    this.action_areas = await this.dashboardService.actionAreas();
    this.activePhase = await this.phasesService.getActivePhase();
    this.organizationData = await this.dashboardService.getOrgProgRisk(this.activePhase.id);
    this.organizationChart = this.generateOrgData(this.organizationData);

 
    this.status = await this.dashboardService.status();
    console.log(this.status)
    this.totalStatus = this.status.reduce((sum: any, item: any) => sum + parseInt(item.total_actions, 10), 0);

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
        type: 'column'
      },
         credits: {
        enabled: false,
      },
      subtitle: {
        text: 'Status of action',
        align: 'center',
      },
      xAxis: {
        categories: this.status.map((item: any) => item.title)
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Percentage (%)'
        },
        labels: {
          format: '{value}%'
        }
      },
      tooltip: {
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0)',
        shadow: false,
        useHTML: true,
        pointFormat: '<b>{point.y}%</b>' ,
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
          colorByPoint: true 
        }
      ]
    
    }
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


  generateOrgData(data: any): any {
    const flattenedData = this.flattenData(data);

    return {
      chart: { 
        height: '100%' 
      },
      title: {
        text: 'Organization-Program-Risk Sunburst Chart'
      },
      series: [{
        type: 'sunburst',
        data: flattenedData,
        name: 'Root',
        allowTraversingTree: true,
        allowDrillToNode: true,
        cursor: 'pointer',
        dataLabels: { format: '{point.name}' },
      }]
    };
  }

  flattenData(data: any): any[] {
    let result: any[] = [];
  
    data.forEach((org: any) => {
      if (org.code && org.name) {
        result.push({ id: org.code.toString(), name: org.name, parent: '' });
  
        if (org.programs && org.programs.length > 0) {
          org.programs.forEach((program: any) => {
            if (program.id && program.name) {
              result.push({ id: program.id.toString(), name: program.name, parent: org.code.toString(), value: Math.random() });
  
              if (program.risks && program.risks.length > 0) {
                program.risks.forEach((risk: any) => {
                  if (risk.id && risk.name) {
                    result.push({ id: risk.id.toString(), name: risk.name, parent: program.id.toString(), value: Math.random() });
                  }
                });
              }
            }
          });
        }
      }
    });
  
    return result;
  }
 
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
          text: `<span class="chart-title"> ${type} impact`,
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
          text: `<span class="chart-title"> ${type} Likelihood</span>`,
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
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0)',
        shadow: false,
        useHTML: true,
        headerFormat: '<table>',
        pointFormat:
          '<tr><th colspan="2"><span class="chart-bubble-title">{point.name}</span></th></tr>' +
          '<tr><th>' +
          type +
          ' impact:</th><td>{point.x}</td></tr>' +
          '<tr><th>' +
          type +
          ' likelihood:</th><td>{point.y}</td></tr>',
        footerFormat: '</table>',
        followPointer: true,
      },

      plotOptions: {
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0)',
        shadow: false,
        useHTML: true,
        series: {
          dataLabels: {
            enabled: true,
            format: '<p class ="text">{point.official_code}</p>',
          },
        },
        bubble: {
          color: '#436280',
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
