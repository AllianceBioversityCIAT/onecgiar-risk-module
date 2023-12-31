import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder , Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AnnouncementService } from 'src/app/services/announcement.service';


@Component({
  selector: 'app-announcements-form-dialog',
  templateUrl: './announcements-form-dialog.component.html',
  styleUrls: ['./announcements-form-dialog.component.scss'],
})
export class AnnouncementsFormDialogComponent implements OnInit {
  dataToEdit: any;
  constructor(
    private dialogRef: MatDialogRef<AnnouncementsFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public announcementData: { title: any; element: any },
    private toster: ToastrService,
    private fb: FormBuilder,
    private announcementService: AnnouncementService,
  ) {}


  announcementForm = this.fb.group({
    id:this.fb.control({value:'',disabled:true}),
    subject:this.fb.control('',Validators.required),
    description:this.fb.control('', [Validators.required ,Validators.maxLength(1500)]),
    status:this.fb.control(false,Validators.required),
  });

  ngOnInit(): void {
    this.setValue();
    console.log(this.announcementData.title)
  }




  async onSubmit() {
    const announcemenId = this.announcementForm.getRawValue().id;
    if(this.announcementData.title == 'Edit announcement'){
      if(this.announcementForm.valid){
        await this.announcementService.updateAnnouncement(announcemenId ,this.announcementForm.value);
        this.onCloseDialog();
        this.toster.success('updated successfully');
      }
    }
    else{
      if(this.announcementForm.valid){
        await this.announcementService.addAnnouncement(this.announcementForm.value);
        this.toster.success('Added successfully');
        this.onCloseDialog();
      }
    }
  }






  async setValue() {
    if(this.announcementData?.element?.id != '' && this.announcementData?.element?.id != null){
      this.dataToEdit = await this.announcementService.getAnnouncementById(this.announcementData?.element?.id);
      this.announcementForm.patchValue({
        id: this.dataToEdit.id,
        subject: this.dataToEdit.subject,
        description: this.dataToEdit.description,
      });
    }
  }





  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
