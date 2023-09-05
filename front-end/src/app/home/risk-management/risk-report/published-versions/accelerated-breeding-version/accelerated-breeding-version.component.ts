import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { MatPaginator } from '@angular/material/paginator';
import { Meta, Title } from '@angular/platform-browser';
import { TitlePageService } from 'src/app/title-page.service';

@Component({
  selector: 'app-accelerated-breeding-version',
  templateUrl: './accelerated-breeding-version.component.html',
  styleUrls: ['./accelerated-breeding-version.component.scss'],
})
export class AcceleratedBreedingVersionComponent {
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private initiativesService: InitiativesService,
    private title: Title,
    private meta: Meta,
    private t: TitlePageService
  ) {
    this.title.setTitle('Accelerated breeding versio');
    this.meta.updateTag({
      name: 'description',
      content: 'Accelerated breeding versio',
    });
  }

  dataSource = new MatTableDataSource<any>([]);
  showReduntent: boolean = false;
  titlePage: any;
  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  path: any = '';
  id: any;
  initiative: any;

  paarentRoute: any;

  async ngOnInit() {
    this.path = window.location.pathname;
    const params: any = this.activatedRoute.snapshot.params;

    this.id = params.versionId;
    this.initiative = await this.initiativesService.getInitiativeForVersion(
      this.id
    );
    this.dataSource.data = this.initiative.risks;

    const params2 = this.activatedRoute.parent?.parent?.snapshot.params;
    console.log(params2);
    this.paarentRoute = params2;

    this.titlePage = this.t.a;
  }

  async export() {
    await this.initiativesService.getExportByinititave(
      this.id,
      this.initiative.official_code,
      true
    );
  }
}
