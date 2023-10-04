import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FAQService } from 'src/app/services/faq.service';
import { ToastrService } from 'ngx-toastr';
import { Editor } from 'ngx-editor';
import { AsyncSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-faq-form-dialog',
  templateUrl: './faq-form-dialog.component.html',
  styleUrls: ['./faq-form-dialog.component.scss'],
})
export class FaqFormDialogComponent {
  dataToEdit: any;
  constructor(   
  @Inject(MAT_DIALOG_DATA) public data:any,
  private fb: FormBuilder,
  private dialog: MatDialog,
  private toster: ToastrService,
  private FAQService: FAQService,
  ){}
  ngOnInit(): void {
    this.setValue();
    this.setupEditor();
  }
  editor: Editor | undefined;
  settings: any;
  editorSubject: Subject<any> = new AsyncSubject();

  onEditorInit(event: any) {
    this.editorSubject.next(event.editor);
    this.editorSubject.complete();
  }


  setupEditor() {
    this.settings = {
      base_url: '/tinymce',
      selector: 'textarea',
      menubar:false,
      suffix: '.min',
      toolbar: 'undo redo | blocks fontsize  | bold italic | alignleft aligncenter alignright alignjustify  | bullist numlist outdent indent  | forecolor  |fullscreen',
      plugins: 'image code link paste fullscreen ',
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      setup: (editor: Editor) => {
        this.editor = editor;
      }
    };
  }

  Form = this.fb.group({
    id:this.fb.control({value:'',disabled:true}),
    question:this.fb.control('',Validators.required),
    answer:this.fb.control('', [Validators.required]),
  });


  async onSubmit() {
    const id = this.Form.getRawValue().id;
    if(id != '' && id != null){
      if(this.Form.valid){
        await this.FAQService.editFaq(id ,this.Form.value);
          this.onCloseDialog();
          this.toster.success('updated successfully');
      }
    }
    else{
      if(this.Form.valid){
        await this.FAQService.createFaq(this.Form.value);
          this.onCloseDialog();
          this.toster.success('Added successfully');
      }
    }
  }


  async setValue() {
    if(this.data.id != '' && this.data.id != null){
      this.dataToEdit = await this.FAQService.getFaqById(this.data.id);
        this.Form.patchValue({
          id: this.dataToEdit.id,
          question: this.dataToEdit.question,
          answer: this.dataToEdit.answer,
        });
    }
  }

  //Close-Dialog
  onCloseDialog() {
    this.dialog.closeAll();
  }

}
