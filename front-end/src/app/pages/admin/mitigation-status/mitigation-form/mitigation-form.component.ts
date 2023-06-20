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


  onSubmit() {
    const id = this.mitigationForm.getRawValue().id;
    if(id != '' && id != null){
      if(this.mitigationForm.valid){
        this.mitigationStatusService.updateMitigation(id ,this.mitigationForm.value).subscribe(response => {
          this.onClose();
          this.toster.success('updated successfully');
        });
      }
    }
    else{
      if(this.mitigationForm.valid){
        this.mitigationStatusService.addMitigation(this.mitigationForm.value).subscribe(res => {
          this.toster.success('Added successfully');
          this.onClose();
        });
      }
    }
  }


  setValue() {
    if(this.data.id != '' && this.data.id != null){
      this.mitigationStatusService.getMitigationById(this.data.id).subscribe(vaule => {
        this.mitigationForm.patchValue({
          id: vaule[0].id,
          title: vaule[0].title,
          description: vaule[0].description,
        });
      });
    }
  }

  onClose() {
    this.dialog.closeAll();
  }
}
