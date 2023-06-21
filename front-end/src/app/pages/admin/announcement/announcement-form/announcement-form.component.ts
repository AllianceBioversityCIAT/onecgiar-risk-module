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

  dataToEdit:any;
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

  async onSubmit() {
    const announcemenId = this.announcementForm.getRawValue().id;
    if(announcemenId != '' && announcemenId != null){
      if(this.announcementForm.valid){
        this.announcementService.updateAnnouncement(announcemenId ,this.announcementForm.value);
        this.onClose();
        this.toster.success('updated successfully');
      }
    }
    else{
      if(this.announcementForm.valid){
        this.announcementService.addAnnouncement(this.announcementForm.value);
        this.toster.success('Added successfully');
        this.onClose();
      }
    }
  }


  async setValue() {
    if(this.announcementId.id != '' && this.announcementId.id != null){
      this.dataToEdit = await this.announcementService.getAnnouncementById(this.announcementId.id);
      this.announcementForm.patchValue({
        id: this.dataToEdit[0].id,
        subject: this.dataToEdit[0].subject,
        description: this.dataToEdit[0].description,
      });
    }
  }

  onClose() {
    this.dialog.closeAll();
  }
}