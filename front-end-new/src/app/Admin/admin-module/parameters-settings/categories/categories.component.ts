import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiCategoryService } from 'src/app/shared-services/admin-services/Parameters-settings-Services/api-category.service';
import { UserFormDialogComponent } from '../../user-management/user-form-dialog/user-form-dialog.component';
import { CategoryFormDialogComponent } from './category-form-dialog/category-form-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private apiCategory: ApiCategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayedColumns: string[] = [
    'color',
    'id',
    'category',
    'categoryGroup',
    'description',
    'actions',
  ];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  dataSource = new MatTableDataSource(this.apiCategory.categoryData);

  openDialogCreateCategory(title: any) {
    this.dialog.open(CategoryFormDialogComponent, {
      width: '68rem',
      height: '69rem',
      data: {
        title: title,
      },
    });
  }

  onViewClick() {}

  openDialogEditCategory(title: any, element: any) {
    this.dialog.open(CategoryFormDialogComponent, {
      width: '68rem',
      height: '69rem',
      data: {
        title: title,
        element: element,
      },
    });
  }

  deleteCategoryById(id: any) {
    this.apiCategory
      .openDialogDeleteCategory('Are you sure to delete this record ?')
      .afterClosed();
  }
}
