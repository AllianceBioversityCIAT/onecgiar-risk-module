import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/services/dashboard.service';
import { RiskService } from 'src/app/services/risk.service';
import { ROLES } from '../team-members/team-members.component';
import { Meta, Title } from '@angular/platform-browser';

declare var require: any;
require('highcharts/highcharts-more.js')(Highcharts);

@Component({
  selector: 'app-risk-dashboard',
  templateUrl: './risk-dashboard.component.html',
  styleUrls: ['./risk-dashboard.component.scss'],
})
export class RiskDashboardComponent {
  riskApi: any = null;

  errorMessage: any = '';
  riskCategories: any;
  riskUsers: any;
  risksForUser: any;
  my_roles: any;
  newRiskForm: any;
  user_info: any;
  riskId!: number;
  sciencePrograms: any = null;
  scienceProgramsId: any;
  my_risks: any;
  officalCode: any;
  checkIfRiskExist: any;

  constructor(
    private dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute,
    private riskService: RiskService,
    private router: Router,
    private title: Title,
    private meta: Meta
  ) {}

  data: any = null;
  risk_level_chartOptions: any = null;
  // risk_base_chartOptions: any = null;

  async ngOnInit(): Promise<void> {
    const params: any = this.activatedRoute.parent?.snapshot.params;
    console.log(params);
    this.data = await this.dashboardService.riskDashboardData(params.id);
    this.risk_level_chartOptions = this.riskProfile(this.data, 'level');
    // this.risk_base_chartOptions = this.riskProfile(this.data, 'base');

    this.riskId = +params.riskId;

    const parentParams: any = this.activatedRoute.parent?.params.subscribe(
      (val) => {
        this.scienceProgramsId = +val['id'];
        this.officalCode = val['initiativeId'];
      }
    );

    //dont allow team member to create risk
    let url: any = '';
    url = this.router.url.split('/').at(-1);
    if (this.my_roles?.includes(ROLES.MEMBER) && url == 'risk-dashboard') {
      this.router.navigate([`/home/${this.scienceProgramsId}/${this.officalCode}`]);
    }
    this.title.setTitle('Risk dashboard');
    this.meta.updateTag({
      name: 'description',
      content: 'Risk dashboard',
    });
  }

  Highcharts: typeof Highcharts = Highcharts;
  getSeries(type: string) {
    if (type == 'level')
      return [
        {
          name: 'Target',
          data: this.data.map((d: any) => d.target_level),
        },
        {
          name: 'Current',
          data: this.data.map((d: any) => d.current_level),
        },
      ];
    else
      return [
        {
          name: 'Current Impact',
          data: this.data.map((d: any) => d.current_impact),
        },
        {
          name: 'Current Likelihood',
          data: this.data.map((d: any) => d.current_likelihood),
        },
        {
          name: 'Target Impact',
          data: this.data.map((d: any) => d.target_impact),
        },
        {
          name: 'Target Likelihood',
          data: this.data.map((d: any) => d.target_likelihood),
        },
      ];
  }

  riskProfile(data: any, type: string) {
    return {
      chart: {
        type: 'column',
      },
      title: {
        text: type == 'level' ? 'Risk Levels' : 'Risk Score',
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: this.data.map((d: any) => d.title),
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Value',
        },
      },
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

        headerFormat:
          '<span style="font-size:10px">{point.key}</span><table><tbody style="display: flex;flex-direction: column-reverse;">',
        pointFormat: `<tr ><td style="color:{series.color};padding:0">{series.name}: </td> 
          <td style="padding:0"><b>{point.y:.1f}</b></td></tr>`,
        footerFormat: '</tbody></table>',
        shared: true,
      },
      plotOptions: {
        column: {
          pointPadding: -0.5,
          borderWidth: 0,
          groupPadding: 0.3,
        },
      },
      colors: ['#436280', '#0F212F'],
      series: this.getSeries(type),
    };
    //  {
    //   chart: {
    //     type: 'bubble',
    //     plotBorderWidth: 1,
    //     zoomType: 'xy',
    //   },

    //   legend: {
    //     enabled: false,
    //   },
    //   credits: {
    //     enabled: false,
    //   },
    //   title: {
    //     text: type + ' Risk profile',
    //   },

    //   xAxis: {
    //     gridLineWidth: 1,
    //     title: {
    //       text: `<span class="chart-title"> ${type} impact</span>`,
    //     },
    //     labels: {
    //       format: '{value}',
    //     },

    //     accessibility: {
    //       rangeDescription: 'Range: 1 to 5',
    //     },
    //   },

    //   yAxis: {
    //     startOnTick: false,
    //     endOnTick: false,
    //     title: {
    //       text: `<span class="chart-title"> ${type} Likelihood</span>`,
    //     },
    //     labels: {
    //       format: '{value}',
    //     },
    //     maxPadding: 0.1,
    //     accessibility: {
    //       rangeDescription: 'Range: 1 to 5',
    //     },
    //   },
    //   tooltip: {
    //     borderWidth: 0,
    //     backgroundColor: 'rgba(255,255,255,0)',
    //     shadow: false,
    //     useHTML: true,
    //     headerFormat: '<table>',
    //     pointFormat:
    //       '<tr><th colspan="2"><span class="chart-bubble-title">{point.title}</span></th></tr>' +
    //       '<tr><th>' +
    //       ' id:</th><td>{point.id}</td></tr>' +
    //       '<tr><th>' +
    //       type +
    //       ' impact:</th><td>{point.x}</td></tr>' +
    //       '<tr><th>' +
    //       type +
    //       ' Likelihood:</th><td>{point.y}</td></tr>',
    //     footerFormat: '</table>',
    //     followPointer: true,
    //   },

    //   plotOptions: {
    //     series: {
    //       dataLabels: {
    //         enabled: true,
    //         format: '{point.id}',
    //       },
    //     },
    //   },
    //   series: [
    //     {
    //       data: data.map((d: any) => {
    //         return {
    //           x: +d[type == 'Target' ? 'target_impact' : 'current_impact'],
    //           y: +d[
    //             type == 'Target' ? 'target_likelihood' : 'current_likelihood'
    //           ],
    //           ...d,
    //         };
    //       }),
    //       colorByPoint: true,
    //     },
    //   ],
    // };
  }
}

function jwt_decode(access_token: string): any {
  throw new Error('Function not implemented.');
}
