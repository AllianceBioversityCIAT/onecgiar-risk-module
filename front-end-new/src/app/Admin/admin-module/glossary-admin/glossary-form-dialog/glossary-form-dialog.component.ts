import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Editor, Toolbar } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { AnnouncementService } from 'src/app/services/announcement.service';

@Component({
  selector: 'app-glossary-form-dialog',
  templateUrl: './glossary-form-dialog.component.html',
  styleUrls: ['./glossary-form-dialog.component.scss'],
})
export class GlossaryFormDialogComponent {
  dataToEdit: any;
  setValue: any;
  constructor(
    private dialogRef: MatDialogRef<GlossaryFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public glossaryData: { title: any; element: any },
    private toster: ToastrService,
    private fb: FormBuilder,
    private announcementService: AnnouncementService
  ) {}
  editor: Editor = new Editor();

  html: string = '';
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  glossaryForm = this.fb.group({
    id: this.fb.control({ value: '', disabled: true }),
    title: this.fb.control('', Validators.required),
    description: this.fb.control('', [
      Validators.required,
      Validators.maxLength(1500),
    ]),
    status: this.fb.control(false, Validators.required),
  });

  ngOnInit(): void {
    this.editor = new Editor();
    this.setValue();
    console.log(this.glossaryData.title);
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }

  onAddGlossary() {}
  onUpdateGlossary() {}
}
