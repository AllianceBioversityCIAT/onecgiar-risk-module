import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryFormDialogComponent } from './category-form-dialog/category-form-dialog.component';
import { CategoryService } from 'src/app/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {


  constructor(
    private categoriesService: CategoryService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  dataSource: any = [];
  async ngOnInit() {
     await this.init()
    console.log(this.dataSource);
  }

  async init(){
    this.dataSource = await this.categoriesService.getCategories()
  }



  displayedColumns: string[] = [
    'color',
    'id',
    'title',
    'category_group_name',
    'description',
    'actions',
  ];




  openDialogCreateCategory(title: any, element: any) {
    this.dialog.open(CategoryFormDialogComponent, {
      width: '68rem',
      height: '69rem',
      data: {
        title: title,
        element: element,
      },
    }).afterClosed().subscribe(async res => {
      await this.init();
  });
  }

  async onViewClick(category: any) {
    const result =  await this.categoriesService.disableCategory(category)
      if(category.disabled == 1) {
        this.toastr.success(
          'Category has been Enabled'
        );
      }
      else {
        this.toastr.success(
          'Category has been disabled'
        );
      }
      await this.init()
  }

  openDialogEditCategory(title: any, element: any) {
    this.dialog.open(CategoryFormDialogComponent, {
      width: '68rem',
      height: '69rem',
      data: {
        title: title,
        element: element,
      },
    }).afterClosed().subscribe(async res => {
      await this.init();
  });
  }


  async deleteCategoryById(id: any) {
    this.dialog
    .open(DeleteConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        message : 'Are you sure you want to delete this record ?'
      }
    }).afterClosed()
    .subscribe(async (res) => {
      if(res == true) {
        const result =  await this.categoriesService.deleteCategory(id);
        if(result) {
          this.toastr.success(
            'Success deleted'
          );
        }
        else {
          this.toastr.error(
            'can not deleted'
          );
        }
      }
      await this.init();
    });
  }
  async export() {
    await this.categoriesService.exportCategories();
  }
}
