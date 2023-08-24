import { Component } from '@angular/core';
import { AnnouncementsFormDialogComponent } from '../drafts/announcements-form-dialog/announcements-form-dialog.component';
import { Announcement } from 'src/app/shared-model/Parameters-settings-Data/announcement.model';
import { ApiAnnouncementService } from 'src/app/shared-services/admin-services/Announcements-Services/api-announcement.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-posted',
  templateUrl: './posted.component.html',
  styleUrls: ['./posted.component.scss'],
})
export class PostedComponent {
  constructor(
    private apiAnnouncement: ApiAnnouncementService,
    private dialog: MatDialog
  ) {}

  announcements: Announcement[] = [];

  ngOnInit() {
    this.announcements = this.apiAnnouncement.announcementData;
  }

  openDialogCreateAnnouncement(title: any) {
    this.dialog.open(AnnouncementsFormDialogComponent, {
      width: '68rem',
      height: '45.2rem',
      data: {
        title: title,
      },
    });
  }

  deleteAnnouncementById(id: any) {
    this.apiAnnouncement
      .openDialogDeleteAnnouncement('Are you sure to delete this record ?')
      .afterClosed();
  }
}
