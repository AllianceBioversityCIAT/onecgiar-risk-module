import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FAQService } from 'src/app/services/faq.service';

@Component({
  selector: 'app-faq-form',
  templateUrl: './faq-form.component.html',
  styleUrls: ['./faq-form.component.scss']
})
export class FaqFormComponent  implements OnInit{
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
          this.onClose();
          this.toster.success('updated successfully');
      }
    }
    else{
      if(this.Form.valid){
        await this.FAQService.createFaq(this.Form.value);
          this.onClose();
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

  onClose() {
    this.dialog.closeAll();
  }
}
