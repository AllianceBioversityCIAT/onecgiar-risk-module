import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MitigationStatusService } from 'src/app/services/mitigation-status.service';
@Component({
  selector: 'app-mitigation-form',
  templateUrl: './mitigation-form.component.html',
  styleUrls: ['./mitigation-form.component.scss']
})
export class MitigationFormComponent implements OnInit{
  dataToEdit: any;
  constructor(   
  private mitigationStatusService: MitigationStatusService,
  @Inject(MAT_DIALOG_DATA) public data:any,
  private fb: FormBuilder,
  private dialog: MatDialog,
  private toster: ToastrService
  ){}
  ngOnInit(): void {
    this.setValue()
  }

  mitigationForm = this.fb.group({
    id:this.fb.control({value:'',disabled:true}),
    title:this.fb.control('',Validators.required),
    description:this.fb.control('', [Validators.required]),
  });


  async onSubmit() {
    const id = this.mitigationForm.getRawValue().id;
    if(id != '' && id != null){
      if(this.mitigationForm.valid){
        await this.mitigationStatusService.updateMitigationStatus(id ,this.mitigationForm.value);
          this.onClose();
          this.toster.success('updated successfully');
      }
    }
    else{
      if(this.mitigationForm.valid){
        await this.mitigationStatusService.addMitigationStatus(this.mitigationForm.value);
          this.toster.success('Added successfully');
          this.onClose();
      }
    }
  }


  async setValue() {
    if(this.data.id != '' && this.data.id != null){
      this.dataToEdit = await this.mitigationStatusService.getMitigationStatusById(this.data.id);
        this.mitigationForm.patchValue({
          id: this.dataToEdit[0].id,
          title: this.dataToEdit[0].title,
          description: this.dataToEdit[0].description,
        });
    }
  }

  onClose() {
    this.dialog.closeAll();
  }
}
