import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VariableService } from 'src/app/services/variable.service';
@Component({
  selector: 'app-edit-constant-form',
  templateUrl: './edit-constant-form.component.html',
  styleUrls: ['./edit-constant-form.component.scss']
})
export class EditConstantFormComponent {
constructor(private fb: FormBuilder,
  private toster: ToastrService,
  private dialog: MatDialog,
  private variableService: VariableService,
  @Inject(MAT_DIALOG_DATA) public data: {element: any}) {}



constantForm = this.fb.group({
  id:this.fb.control(this.data.element.id),
  label:this.fb.control(this.data.element.label, [Validators.required]),
  value:this.fb.control(this.data.element.value, [Validators.required]),
});


async onSubmit() {
    if(this.constantForm.valid){
      await this.variableService.editConstantsVariable(this.constantForm.value);
        this.onCloseDialog();
        this.toster.success('updated successfully');
    }
  }



  onCloseDialog() {
    this.dialog.closeAll();
  }

}


