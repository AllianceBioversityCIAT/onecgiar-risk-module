import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { ApiPublishedService } from 'src/app/shared-services/published-services/api-published.service';
import { Meta, Title } from '@angular/platform-browser';
import jwt_decode from 'jwt-decode';

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

  science_programs_name: string = '';
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
  scienceProgramsId: any;
  officalCode: any;
  userRole: any;

  async ngOnInit() {
    this.path = window.location.pathname;
    const params: any = this.activatedRoute.parent?.parent?.snapshot.params;
    this.officalCode = params.initiativeId;
    const iniitave = await this.initiativeService.getInitiative(params.id);
    const iniitaves = await this.initiativeService.getInitiatives(params.id);
    this.scienceProgramsId = params.id;
    this.dataSource.paginator = this.paginator;
    this.science_programs_name = iniitave.name;
    this.dataSource.data = iniitaves;

    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      this.userRole = jwt_decode(access_token);
    }
    if (this.userRole.role == 'admin') {
      this.displayedColumns.splice(
        this.displayedColumns.length - 1,
        0,
        'Targets not set'
      );
    }

    this.title.setTitle('Submitted versions');
    this.meta.updateTag({
      name: 'description',
      content: 'Submitted versions',
    });
  }


  filterReqAssistance(risk: any) {
    let column = '-';
    for (let item of risk) {
      if (item.request_assistance == true) {
        column = 'Yes';
        break;
      } else {
        column = 'No';
      }
    }
    return column;
  }
}
