import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { MatPaginator } from '@angular/material/paginator';
import { Meta, Title } from '@angular/platform-browser';
import { TitlePageService } from 'src/app/title-page.service';
import jwt_decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
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
    private t: TitlePageService,
    private toaster: ToastrService
  ) {}

  dataSource = new MatTableDataSource<any>([]);
  showReduntent: boolean = false;
  titlePage: any;
  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  path: any = '';
  id: any;
  official_code: any;
  sciencePrograms: any;

  paarentRoute: any;

  user_info: any;
  request_assistance: boolean = false;
  filter: any = { request_assistance: false };
  data: any;
  async risksNeedHelp() {
    this.filter = {
      request_assistance: this.request_assistance,
    };
    this.data = await this.initiativesService
      .getInitiativeForVersion(this.id, this.filter)
      .then(
        (data) => {
          this.dataSource.data = data?.risks;
        },
        (error) => {
          this.toaster.error(error.error.message);
        }
      );
  }

  async ngOnInit() {
    this.path = window.location.pathname;
    const params: any = this.activatedRoute.snapshot.params;

    this.id = params.versionId;
    this.sciencePrograms = await this.initiativesService.getInitiativeForVersion(
      this.id,
      this.filter
    );
    this.dataSource.data = this.sciencePrograms?.risks;

    const params2: any = this.activatedRoute.parent?.parent?.snapshot.params;
    console.log(params2);
    console.log(this.sciencePrograms?.name);
    this.paarentRoute = params2;
    this.official_code = params2.initiativeId;

    this.titlePage = this.t.a;

    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      this.user_info = jwt_decode(access_token);
    }

    this.title.setTitle(`${this.sciencePrograms?.name} Version `);
    this.meta.updateTag({
      name: 'description',
      content: `${this.sciencePrograms?.name} Version  `,
    });
  }

  async export() {
    await this.initiativesService.getExportByinititave(
      this.id,
      this.official_code,
      true,
      this.filter
    );
  }
}
