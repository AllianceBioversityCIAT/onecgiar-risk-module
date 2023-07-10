import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, RequiredValidator, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CategoriesGroupsService } from 'src/app/services/categories-groups.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  categoryGroup: any;
  userForm: any;
  constructor(
    public dialogRef: MatDialogRef<CategoryFormComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoriesGroupServices: CategoriesGroupsService
  ) {}
  async ngOnInit() {
    this.categoryGroup = await this.categoriesGroupServices.getCategoriesGroup();
    this.userForm = this.fb.group({
      category_group_id: [this.data?.item?.category_group_id || null, Validators.required],
      title: [this.data?.item?.title || null, Validators.required],
      description: [this.data?.item?.description || null, Validators.required],
      id: [this.data?.item?.id || null],
    });
  }
  onConfirm(): void {
    // Close the dialog, return true
    if (this.userForm.valid) this.dialogRef.close(this.userForm.value);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}
