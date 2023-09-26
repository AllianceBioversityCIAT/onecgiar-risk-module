import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryFormDialogComponent } from './category-form-dialog/category-form-dialog.component';
import { CategoryService } from 'src/app/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { HeaderService } from 'src/app/header.service';
import { Meta, Title } from '@angular/platform-browser';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoryService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private headerService: HeaderService,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  filters: any = null;
  dataSource: any = [];
  @ViewChild(MatPaginator) paginator: any;
  filterForm: FormGroup = new FormGroup({});

  sort = [
    { name: 'ID (lowest first)', value: 'id,ASC' },
    { name: 'ID (highest first)', value: 'id,DESC' },
    { name: 'Name (lowest first)', value: 'full_name,ASC' },
    { name: 'Name (highest first)', value: 'full_name,DESC' },
  ];

  setForm() {
    this.filterForm.valueChanges.subscribe(() => {
      this.filters = this.filterForm.value;
      this.init();
    });
  }

  async ngOnInit() {
    this.filterForm = this.fb.group({
      email: [null],
      role: [null],
      sort: [null],
    });
    await this.init();
    this.setForm();
    console.log(this.dataSource);
    this.title.setTitle('Categories');
    this.meta.updateTag({
      name: 'description',
      content: 'Categories',
    });
  }

  async init() {
    this.dataSource = await this.categoriesService.getCategories();
    this.dataSource = new MatTableDataSource(this.dataSource);
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = [
    'id',
    'title',
    'category_group_name',
    'description',
    'actions',
  ];

  openDialogCreateCategory(title: any, element: any) {
    this.dialog
      .open(CategoryFormDialogComponent, {
        width: '68rem',
        height: '53rem',
        data: {
          title: title,
          element: element,
        },
      })
      .afterClosed()
      .subscribe(async (res) => {
        await this.init();
      });
  }

  async onViewClick(category: any) {
    const result = await this.categoriesService.disableCategory(category);
    if (category.disabled == 1) {
      this.toastr.success('Category has been Enabled');
    } else {
      this.toastr.success('Category has been disabled');
    }
    await this.init();
  }

  openDialogEditCategory(title: any, element: any) {
    this.dialog
      .open(CategoryFormDialogComponent, {
        width: '68rem',
        height: '53rem',
        data: {
          title: title,
          element: element,
        },
      })
      .afterClosed()
      .subscribe(async (res) => {
        await this.init();
      });
  }

  async deleteCategoryById(id: any) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          message: 'Are you sure you want to delete this record ?',
        },
      })
      .afterClosed()
      .subscribe(async (res) => {
        if (res == true) {
          const result = await this.categoriesService.deleteCategory(id);
          if (result) {
            this.toastr.success('Success deleted');
          } else {
            this.toastr.error(
              "The category can't be deleted as it has assigned risks"
            );
          }
        }
        await this.init();
      });
  }
  async export() {
    await this.categoriesService.exportCategories();
  }

  resetForm() {
    this.filterForm.reset();
    this.filterForm.markAsUntouched();
  }
}
