import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { ApiPublishedService } from 'src/app/shared-services/published-services/api-published.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-versions-table',
  templateUrl: './versions-table.component.html',
  styleUrls: ['./versions-table.component.scss'],
})
export class VersionsTableComponent {
  constructor(
    private initiativeService: InitiativesService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private meta: Meta
  ) {}

  initiative_name: string = '';
  displayedColumns: string[] = [
    'Version',
    'Creation Date',
    'Creation By',
    'phase name',
    'Actions',
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: any;

  path: any = '';
  initiativeId: any;
  officalCode: any;
  async ngOnInit() {
    this.path = window.location.pathname;
    const params: any = this.activatedRoute.parent?.parent?.snapshot.params;
    this.officalCode = params.initiativeId;
    const iniitave = await this.initiativeService.getInitiative(params.id);
    const iniitaves = await this.initiativeService.getInitiatives(params.id);
    this.initiativeId = params.id;
    this.dataSource.paginator = this.paginator;
    this.initiative_name = iniitave.name;
    this.dataSource.data = iniitaves;

    this.title.setTitle('Submitted versions');
    this.meta.updateTag({
      name: 'description',
      content: 'Submitted versions',
    });
  }
}
