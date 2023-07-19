import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { RiskService } from 'src/app/services/risk.service';

@Component({
  selector: 'app-version-details',
  templateUrl: './version-details.component.html',
  styleUrls: ['./version-details.component.scss'],
})
export class VersionDetailsComponent {
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private initiativesService: InitiativesService
  ) {}

  dataSource = new MatTableDataSource<any>([]);
  showReduntent: boolean = false;
  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  path: any = '';
  id: any;
  initiative: any;
  async ngOnInit() {
    this.path = window.location.pathname;
    const params: any = this.activatedRoute.snapshot.params;
    this.id = params.versionId;
    this.initiative = await this.initiativesService.getInitiativeForVersion(this.id);
    this.dataSource.data = this.initiative.risks;
  }

  async export() {
    await this.initiativesService.getExportByinititave(this.id,  this.initiative.official_code);
  }
}
