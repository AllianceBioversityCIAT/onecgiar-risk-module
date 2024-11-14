import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';

@Component({
  selector: 'app-archived-version',
  templateUrl: './archived-version.component.html',
  styleUrls: ['./archived-version.component.scss']
})
export class ArchivedVersionComponent {
  constructor(
    private initiativeService: InitiativesService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private meta: Meta
  ) {}
  
  dataSource = new MatTableDataSource<any>([]);
  archivedId: any;
  officalCode!: string;
  initiativeName: any;
  initiativeId: any;
  showReduntent: boolean = false;
  versionId!: number;
  versionData: any;
  async ngOnInit() {
    const params: any = this.activatedRoute.parent?.snapshot.params;
    this.archivedId = params.id;
    this.getArchivedDataById(this.archivedId)
    this.title.setTitle('Archived submitted version');
    this.meta.updateTag({
      name: 'description',
      content: 'Archived submitted version',
    });
  }

  request_assistance: boolean = false;
  async risksNeedHelp(event: MatCheckboxChange) {
    if(event.checked) {
      this.request_assistance = true;
      const filteredRisk = this.versionData.risks.filter((risk: any) => risk.request_assistance == true);
      this.dataSource = new MatTableDataSource<any>(filteredRisk);
    } else {
      this.request_assistance = false;
      this.getArchivedDataById(this.archivedId)
    }
  }

  async export() {
    const filters = {
      archivedId: this.archivedId,
      versionId: this.versionId,
      request_assistance: this.request_assistance
    }
    await this.initiativeService.exportArchivedRisks(filters);
  }

  async getArchivedDataById(id: number) {
    const data = await this.initiativeService.getArchivedById(id);
    const param2: any = this.activatedRoute?.snapshot.params; //version id
    this.versionId = param2.id;
    this.officalCode = data.initiative.official_code;
    this.initiativeName = data.initiative.name;
    this.initiativeId = data.initiative.id;
    this.versionData = data.init_data.version.filter((d: any) => d.id == param2.id)[0];
    this.dataSource = new MatTableDataSource<any>(this.versionData.risks);
  }
}
