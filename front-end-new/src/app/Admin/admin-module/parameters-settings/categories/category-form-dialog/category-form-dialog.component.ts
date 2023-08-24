import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiCategoryService } from 'src/app/shared-services/admin-services/Parameters-settings-Services/api-category.service';
@Component({
  selector: 'app-category-form-dialog',
  templateUrl: './category-form-dialog.component.html',
  styleUrls: ['./category-form-dialog.component.scss'],
})
export class CategoryFormDialogComponent implements OnInit {
  constructor(
    private apiCategory: ApiCategoryService,
    private dialogRef: MatDialogRef<CategoryFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public categoryData: { title: any; element: any }
  ) {}

  categoryFormData = new FormGroup({
    categoryName: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    categoryGroup: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {}

  onAddCategory() {}

  onUpdateCategory() {}

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
