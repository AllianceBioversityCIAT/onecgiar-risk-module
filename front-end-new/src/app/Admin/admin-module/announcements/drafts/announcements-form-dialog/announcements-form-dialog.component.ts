import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiAnnouncementService } from 'src/app/shared-services/admin-services/Announcements-Services/api-announcement.service';
@Component({
  selector: 'app-announcements-form-dialog',
  templateUrl: './announcements-form-dialog.component.html',
  styleUrls: ['./announcements-form-dialog.component.scss'],
})
export class AnnouncementsFormDialogComponent implements OnInit {
  constructor(
    private apiAnnouncement: ApiAnnouncementService,
    private dialogRef: MatDialogRef<AnnouncementsFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public announcementData: { title: any; element: any }
  ) {}

  announcementFormData = new FormGroup({
    subject: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {}

  onSendAnnouncement() {}

  onSaveAnnouncement() {}

  onUpdateAnnouncement() {}

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
