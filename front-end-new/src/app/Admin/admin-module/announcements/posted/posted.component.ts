import { Component } from '@angular/core';
import { AnnouncementsFormDialogComponent } from '../drafts/announcements-form-dialog/announcements-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AnnouncementService } from 'src/app/services/announcement.service';

@Component({
  selector: 'app-posted',
  templateUrl: './posted.component.html',
  styleUrls: ['./posted.component.scss'],
})
export class PostedComponent {
  constructor(
    private dialog: MatDialog,
    private announcementService: AnnouncementService,

  ) {}

  postedAnnouncements: any;

  ngOnInit(): void {
    this.getData();
  }
  //Drafts
  async getData() {
    this.postedAnnouncements = await this.announcementService.getAnnouncementPosted();
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

}
