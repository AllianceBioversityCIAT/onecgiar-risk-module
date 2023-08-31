import { Component, Inject } from '@angular/core';
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
  selector: 'app-faq-form-dialog',
  templateUrl: './faq-form-dialog.component.html',
  styleUrls: ['./faq-form-dialog.component.scss'],
})
export class FaqFormDialogComponent {
  dataToEdit: any;
  setValue: any;
  constructor(
    private dialogRef: MatDialogRef<FaqFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public faqData: { title: any; element: any },
    private toster: ToastrService,
    private fb: FormBuilder
  ) {}

  editorQuestion: Editor = new Editor();
  editorAnswer: Editor = new Editor();

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

  faqForm = this.fb.group({
    id: this.fb.control({ value: '', disabled: true }),
    question: this.fb.control('', Validators.required),
    description: this.fb.control('', [
      Validators.required,
      Validators.maxLength(1500),
    ]),
    answer: this.fb.control(false, Validators.required),
  });

  ngOnInit(): void {
    this.editorQuestion = new Editor();
    this.editorAnswer = new Editor();
    this.setValue();
    console.log(this.faqData.title);
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editorQuestion.destroy();
    this.editorAnswer.destroy();
  }

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }

  onAddFaq() {}
  onUpdateFaq() {}
}
