import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';

@Component({
  selector: 'app-archived-versions',
  templateUrl: './archived-versions.component.html',
  styleUrls: ['./archived-versions.component.scss']
})
export class ArchivedVersionsComponent implements OnInit{
  constructor(
    private initiativeService: InitiativesService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private meta: Meta
  ) {}

  displayedColumns: string[] = [
    'Version',
    'Creation Date',
    'Creation By',
    'phase name',
    'Actions',
  ];

  dataSource = new MatTableDataSource<any>([]);
  archivedId: any;
  officalCode!: string;
  initiativeId: any;

  async ngOnInit() {
    const params: any = this.activatedRoute.parent?.snapshot.params;
    this.archivedId = params.id;
    this.getArchivedDataById(this.archivedId)
    this.title.setTitle('Archived submitted versions');
    this.meta.updateTag({
      name: 'description',
      content: 'Archived submitted versions',
    });
  }

  async getArchivedDataById(id: number) {
    const data = await this.initiativeService.getArchivedById(id);
    this.officalCode = data.initiative.official_code;
    this.initiativeId = data.initiative.id;
    this.dataSource = new MatTableDataSource<any>(data.init_data.version);
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
