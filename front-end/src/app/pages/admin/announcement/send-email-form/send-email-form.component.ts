import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-send-email-form',
  templateUrl: './send-email-form.component.html',
  styleUrls: ['./send-email-form.component.scss']
})
export class SendEmailFormComponent implements OnInit{

  constructor (
    private fb: FormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any ) {}

    ngOnInit(): void {
    
    }

    sendEmailForm = this.fb.group({
      id:this.fb.control(this.data.id),
      email: this.fb.control('', [Validators.required, Validators.email]),
    });

    onSubmit(){
      if(this.sendEmailForm.valid){
        console.log(this.sendEmailForm.value);
      }
    }
    onClose(){
      this.dialog.closeAll();
    }
}
