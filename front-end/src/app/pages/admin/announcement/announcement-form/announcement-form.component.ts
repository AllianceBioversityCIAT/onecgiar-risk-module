import { Component, OnDestroy, OnInit, Inject} from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';
import { FormBuilder, Validators } from '@angular/forms';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-announcement-form',
  templateUrl: './announcement-form.component.html',
  styleUrls: ['./announcement-form.component.scss']
})
export class AnnouncementFormComponent implements OnInit, OnDestroy {
  constructor(
    private announcementService: AnnouncementService,
    @Inject(MAT_DIALOG_DATA) public announcementId:any,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toster: ToastrService,
    ){}


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


  announcementForm = this.fb.group({
    id:this.fb.control({value:'',disabled:true}),
    subject:this.fb.control('',Validators.required),
    description:this.fb.control('', [Validators.required ,Validators.maxLength(1500)]),
    status:this.fb.control(false,Validators.required),
  });

  ngOnInit(): void {
    this.editor = new Editor();
    this.setValue();
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onSubmit() {
    const announcemenId = this.announcementForm.getRawValue().id;
    if(announcemenId != '' && announcemenId != null){
      if(this.announcementForm.valid){
        this.announcementService.updateAnnouncement(announcemenId ,this.announcementForm.value).subscribe(response => {
          this.onClose();
          this.toster.success('updated successfully');
        });
      }
    }
    else{
      if(this.announcementForm.valid){
        this.announcementService.addAnnouncement(this.announcementForm.value).subscribe(res => {
          this.toster.success('Added successfully');
          this.onClose();
        });
      }
    }
  }


  setValue() {
    if(this.announcementId.id != '' && this.announcementId.id != null){
      this.announcementService.getAnnouncementById(this.announcementId.id).subscribe(vaule => {
        this.announcementForm.patchValue({
          id: vaule[0].id,
          subject: vaule[0].subject,
          description: vaule[0].description,
        });
      });
    }
  }

  onClose() {
    this.dialog.closeAll();
  }
}