import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiRiskDetailsService } from '../shared-services/risk-details-services/api-risk-details.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  public riskUrl = {
    home: '/home/risk-management',
  };

  constructor(private apiRiskDetailsService: ApiRiskDetailsService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  dataSource = new MatTableDataSource(
    this.apiRiskDetailsService.riskDetailsData
  );

  displayedColumns: string[] = [
    'iNITCode',
    'initiativeName',
    'riskCategory',
    'risk',
    'riskDescription',
    'riskScore',
  ];
}
