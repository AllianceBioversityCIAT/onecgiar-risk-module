import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/header.service';
import { ApiRiskManagementService } from 'src/app/shared-services/risk-management-services/api-risk-management.service';

@Component({
  selector: 'app-risk-management',
  templateUrl: './risk-management.component.html',
  styleUrls: ['./risk-management.component.scss'],
})
export class RiskManagementComponent {
  public url1: string = '';
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  public riskUrl = {
    home: '/home/risk-management',
  };

  constructor(
    private apiRiskManagementService: ApiRiskManagementService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  riskManagementForm = new FormGroup({});

  ngOnInit() {
    this.url1 = this.router.url;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  dataSource = new MatTableDataSource(
    this.apiRiskManagementService.riskManagementData
  );

  displayedColumns: string[] = [
    'iNITCode',
    'initiativeName',
    'riskCategory',
    'numOfRisks',
    'myRole',
    'status',
    'action',
  ];

  onClickView() {
    this.router.navigate(['risk-report'], { relativeTo: this.route });
  }

  onReset() {}
  onExportToExcel() {}
}
