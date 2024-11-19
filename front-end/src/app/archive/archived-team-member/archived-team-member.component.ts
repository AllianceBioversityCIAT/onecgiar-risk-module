import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';

@Component({
  selector: 'app-archived-team-member',
  templateUrl: './archived-team-member.component.html',
  styleUrls: ['./archived-team-member.component.scss']
})
export class ArchivedTeamMemberComponent implements OnInit {
  archivedId: any;
  officalCode!: string;
  scienceProgramsId: any;
  displayedColumns: string[] = [
    'Email',
    'User',
    'Role',
    'Creation Date',
    'Status',
  ];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private initiativeService: InitiativesService,
    private title: Title,
    private meta: Meta
  ) {}

  async ngOnInit() {
    const params: any = this.activatedRoute?.snapshot.params;
    this.archivedId = params.id;
    this.getArchivedDataById(this.archivedId)
    this.title.setTitle('Archived team members');
    this.meta.updateTag({
      name: 'description',
      content: 'Archived team members',
    });
  }

  async getArchivedDataById(id: number) {
    const data = await this.initiativeService.getArchivedById(id);
    this.officalCode = data.science_programs.official_code;
    this.scienceProgramsId = data.science_programs.id;
    this.dataSource = new MatTableDataSource<any>(data.init_data.roles);
  }
}
