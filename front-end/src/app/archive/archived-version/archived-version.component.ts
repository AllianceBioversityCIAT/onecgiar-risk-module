import { Component, OnInit } from '@angular/core';
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

  async getArchivedDataById(id: number) {
    const data = await this.initiativeService.getArchivedById(id);
    const param2: any = this.activatedRoute?.snapshot.params; //version id
    this.versionId = param2.id;
    this.officalCode = data.initiative.official_code;
    this.initiativeName = data.initiative.name;
    this.initiativeId = data.initiative.id;
    const versionData = data.init_data.version.filter((d: any) => d.id == param2.id)[0];
    this.dataSource = new MatTableDataSource<any>(versionData.risks);
  }
}
