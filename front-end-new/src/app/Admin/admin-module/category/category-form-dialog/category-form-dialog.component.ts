import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriesGroupsService } from 'src/app/services/categories-groups.service';
import { ApiCategoryService } from 'src/app/shared-services/admin-services/Parameters-settings-Services/api-category.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-form-dialog',
  templateUrl: './category-form-dialog.component.html',
  styleUrls: ['./category-form-dialog.component.scss'],
})
export class CategoryFormDialogComponent implements OnInit {
  constructor(
    private apiCategory: ApiCategoryService,
    private dialogRef: MatDialogRef<CategoryFormDialogComponent>,
    private categoriesGroupServices: CategoriesGroupsService,
    private categoriesService: CategoryService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public categoryData: { title: any; element: any }
  ) {}
  categoryGroup: any;
  categoryFormData = new FormGroup({
    id: new FormControl(this.categoryData?.element?.id || null),
    title: new FormControl(this.categoryData?.element?.title || null, [
      Validators.required,
    ]),
    description: new FormControl(
      this.categoryData?.element?.description || null,
      [Validators.required]
    ),
    category_group_id: new FormControl(
      this.categoryData?.element?.category_group_id || null,
      [Validators.required]
    ),
  });

  async ngOnInit(): Promise<void> {
    this.categoryGroup =
      await this.categoriesGroupServices.getCategoriesGroup();
  }

  async onSubmit() {
    //Add
    if (this.categoryData.element == null) {
      if (this.categoryFormData.valid) {
        await this.categoriesService.addCategory(this.categoryFormData.value);
        this.onCloseDialog();
        this.toastr.success('Added successfully');
      }
    }
    //edit
    else {
      if (this.categoryFormData.valid) {
        await this.categoriesService.updateCategory(
          this.categoryFormData.value
        );
        this.onCloseDialog();
        this.toastr.success('Updated successfully');
      }
    }
  }

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
