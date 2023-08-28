import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiPublishedService } from 'src/app/shared-services/published-services/api-published.service';

@Component({
  selector: 'app-submitted-versions',
  templateUrl: './published-versions.component.html',
  styleUrls: ['./published-versions.component.scss'],
})
export class PublishedVersionsComponent {
  public url1: string = '';
  ngOnInit() {
    this.url1 = this.router.url;
  }

  constructor(
    private apiPublishedService: ApiPublishedService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  dataSource = new MatTableDataSource(this.apiPublishedService.publishedData);

  displayedColumns: string[] = [
    'versionId',

    'creationDate',
    'creationBy',

    'action',
  ];

  public riskUrl = {
    home: '/home/risk-management/risk-report/submitted-versions',
  };

  onExportToExcel() {}

  onClickView() {
    this.router.navigate(['accelerated-breeding-version'], {
      relativeTo: this.route,
    });
  }
}
