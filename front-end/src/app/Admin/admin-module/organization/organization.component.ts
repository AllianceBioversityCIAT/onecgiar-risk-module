import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HeaderService } from 'src/app/header.service';
import { OrganizationService } from 'src/app/services/organization.service';
import { OrganizationDialogComponent } from './organization-dialog/organization-dialog.component';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private dialog: MatDialog,
    private headerService: HeaderService,
    private title: Title,
    private meta: Meta,
    private toast: ToastrService,
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }


  columnsToDisplay: string[] = ["name", "acronym", "code", "actions"];
  filters: any = null;
  dataSource: any;
  filterForm: FormGroup = new FormGroup({});
  length!: number;
  pageSize: number = 10;
  pageIndex: number = 1;


  setForm() {
    this.filterForm.valueChanges.subscribe(() => {
      this.pageIndex = 1;
      this.filters = this.filterForm.value;
      this.initTable();
    });
  }



  ngOnInit(): void {
    this.filterForm = this.fb.group({
      name: [null],
    });
    this.initTable();
    this.setForm();

    this.title.setTitle('Organization');
    this.meta.updateTag({
      name: 'description',
      content: 'Organization',
    });
  }

  async initTable() {
    this.dataSource = await this.organizationService.getOrganizations(
      this.filters,
      this.pageIndex,
      this.pageSize
    );
    this.length = this.dataSource.length;
  }

  async pagination(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.initTable();
  }

  openDialog(item: any): void {
    const dialogRef = this.dialog.open(OrganizationDialogComponent, {
      data: { item: item },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.submitted) this.initTable();
    });
  }

  delete(id: number) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          title: 'Delete',
          message: `Are you sure you want to delete this Organization ?`,
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          await this.organizationService.deleteOrganization(id).then((data) => {
            this.toast.success('Deleted successfully');
            this.initTable();
          }, (error) => {
            this.toast.error(error.error.message);
          });
        }
      });
  }

  resetForm() {
    this.filterForm.reset();
    this.filterForm.markAsUntouched();
  }
}
