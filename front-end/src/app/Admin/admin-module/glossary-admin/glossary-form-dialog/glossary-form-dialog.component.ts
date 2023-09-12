import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GlossaryService } from 'src/app/services/glossary.service';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-glossary-form-dialog',
  templateUrl: './glossary-form-dialog.component.html',
  styleUrls: ['./glossary-form-dialog.component.scss'],
})
export class GlossaryFormDialogComponent implements OnInit{
  dataToEdit: any;
  constructor(   
  @Inject(MAT_DIALOG_DATA) public data:any,
  private fb: FormBuilder,
  private dialog: MatDialog,
  private toster: ToastrService,
  private GlossaryService: GlossaryService
  ){}
  ngOnInit(): void {
    this.setValue();
  }

  editor: Editor= new Editor();

  html:string = '';
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
    id:this.fb.control({value:'',disabled:true}),
    title:this.fb.control('',Validators.required),
    description:this.fb.control('', [Validators.required]),
  });


  ngOnDestroy(): void {
    this.editor.destroy();
  }

   async onSubmit() {
    const id = this.glossaryForm.getRawValue().id;
    if(id != '' && id != null){
      if(this.glossaryForm.valid){
        await this.GlossaryService.updateGlossary(id ,this.glossaryForm.value);
          this.onCloseDialog();
          this.toster.success('updated successfully');
      }
    }
    else{
      if(this.glossaryForm.valid){
        await this.GlossaryService.addGlossary(this.glossaryForm.value);
          this.onCloseDialog();
          this.toster.success('Added successfully');
      }
    }
  }


  async setValue() {
    if(this.data.id != '' && this.data.id != null){
      this.dataToEdit = await this.GlossaryService.getGlossaryById(this.data.id);
        this.glossaryForm.patchValue({
          id: this.dataToEdit.id,
          title: this.dataToEdit.title,
          description: this.dataToEdit.description,
        });
    }
  }


  //Close-Dialog
  onCloseDialog() {
    this.dialog.closeAll();
  }

}
