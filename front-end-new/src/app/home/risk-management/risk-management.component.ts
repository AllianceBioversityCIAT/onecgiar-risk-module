import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/header.service';
import { ApiRiskManagementService } from 'src/app/shared-services/risk-management-services/api-risk-management.service';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-risk-management',
  templateUrl: './risk-management.component.html',
  styleUrls: ['./risk-management.component.scss'],
})
export class RiskManagementComponent {
  public url1: string = '';

  private refreshNeeded = new Subject<void>();

  getRefreshNeeded() {
    return this.refreshNeeded;
  }

  apiRiskReport = 'http://localhost:4200/home/risk-management/risk-report';

  public riskUrl = {
    riskManagement: '/home/risk-management',
  };

  constructor(
    private http: HttpClient,
    private apiRiskManagementService: ApiRiskManagementService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  riskManagementForm = new FormGroup({});

  ngOnInit() {
    this.url1 = this.router.url;
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
    'helpRequested',
    'action',
  ];

  onReset() {}
  onExportToExcel() {}

  // onClickView(): Observable<any> {
  //   return this.http.get(`${this.apiRiskReport}`).pipe(
  //     tap(() => {
  //       this.refreshNeeded.next();
  //     })
  //   );
  // }
}
