import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/services/dashboard.service';
declare var require: any
require('highcharts/highcharts-more.js')(Highcharts);

@Component({
  selector: 'app-risk-dashboard',
  templateUrl: './risk-dashboard.component.html',
  styleUrls: ['./risk-dashboard.component.scss']
})
export class RiskDashboardComponent {
  constructor(private dashboardService: DashboardService,private route: ActivatedRoute) {}

  data: any = null;
  risk_current_chartOptions: any = null;
  risk_target_chartOptions: any = null;

  async ngOnInit(): Promise<void> {
    const params: any = this.route.parent?.snapshot.params;
    this.data = await this.dashboardService.riskDashboardData(params.id);
    this.risk_current_chartOptions = this.riskProfile(
      this.data,
      'Current'
    );
    this.risk_target_chartOptions = this.riskProfile(
      this.data,
      'Target'
    );
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
      title: {
        text: type + ' Risk profile',
      },

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
        maxPadding: 0.1,
        accessibility: {
          rangeDescription: 'Range: 1 to 5',
        },
      },
      tooltip: {
        useHTML: true,
        headerFormat: '<table>',
        pointFormat:
          '<tr><th colspan="2"><h4>{point.title}</h4></th></tr>' +
          '<tr><th>' +
          ' id:</th><td>{point.id}</td></tr>'+
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
            format: '{point.id}',
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
}
