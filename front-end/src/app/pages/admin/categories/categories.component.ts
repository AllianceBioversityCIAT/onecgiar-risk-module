import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmComponent, ConfirmDialogModel } from 'src/app/components/confirm/confirm.component';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryFormComponent } from './category-form/category-form.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  constructor(
    private categoriesService: CategoryService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}
  columns = [
    { title: 'ID', name: 'id' },
    { title: 'Category', name: 'title' },
    { title: 'Categorie Group', name: 'category_group_name' },
    { title: 'Category description', name: 'description' },
  ];
  actions = [
    { title: 'Update', action: 'edit', icon: 'edit' },
    { title: 'Delete', action: 'delete', icon: 'delete' },
    { title: 'Disabled catigory', action: 'disabledCatigory', icon: 'disabled_visible' },
    { title: 'Enabled catigory', action: 'enableCatigory', icon: 'visibility' }
  ];
  dataSource: any = [];
  async ngOnInit() {
     await this.init()
    console.log(this.dataSource);
  }

 async init(){
    this.dataSource = await this.categoriesService.getCategories()
  }
  add() {
    this.dialog
      .open(CategoryFormComponent, {
        maxWidth: '400px',
        data: null,
      })
      .afterClosed()
      .subscribe(async (dialogResult: any) => {
        if (dialogResult) {
         await this.categoriesService.addCategory(dialogResult);
          this.toastr.success(
            'Success',
            `Category has been created`
          );
          await this.init()
        }
      });
  }
  async action(data: any) {
    console.log(data);
    if (data?.act?.action == 'edit')
      this.dialog
        .open(CategoryFormComponent, {
          maxWidth: '400px',
          data: data,
        })
        .afterClosed()
        .subscribe(async (dialogResult: any) => {
          if (dialogResult) {
            await this.categoriesService.updateCategory(dialogResult);
            this.toastr.success(
              'Success',
              `${data?.item?.title} has been Updated`
            );
            await this.init()
          }
        });
    else if (data?.act?.action == 'delete')
      this.dialog
        .open(ConfirmComponent, {
          maxWidth: '400px',
          data: new ConfirmDialogModel(
            'Delete',
            `Are you sure you want to delete ${data?.item?.title}`
          ),
        })
        .afterClosed()
        .subscribe(async (dialogResult) => {
          if (dialogResult) {
          const result =  await this.categoriesService.deleteCategory(data?.item?.id)
          if(result)
            this.toastr.success(
              'Success',
              `${data?.item?.title} has been deleted`
            );
            else
            this.toastr.error(
              'Error',
              `${data?.item?.title} can't be deleted since it in use`
            );
            await this.init()
          }
        });
    else if(data?.act?.action ==  'disabledCatigory') {
      const result =  await this.categoriesService.disableCategory(data)
      if(result) {
        this.toastr.success(
          'Success',
          `${data?.item?.title} has been Enabled`
        );
        await this.init()
      }
    }
    else if(data?.act?.action ==  'enableCatigory') {
      const result =  await this.categoriesService.disableCategory(data)
      if(result) {
        this.toastr.success(
          'Success',
          `${data?.item?.title} has been disabled`
        );
        await this.init()
      }
    }
  }

  async export() {
    await this.categoriesService.exportCategories();
  }
}
