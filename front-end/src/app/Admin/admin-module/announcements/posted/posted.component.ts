import { Component } from '@angular/core';
import { AnnouncementsFormDialogComponent } from '../drafts/announcements-form-dialog/announcements-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { HeaderService } from 'src/app/header.service';

@Component({
  selector: 'app-posted',
  templateUrl: './posted.component.html',
  styleUrls: ['./posted.component.scss'],
})
export class PostedComponent {
  constructor(
    private dialog: MatDialog,
    private announcementService: AnnouncementService,
    private headerService: HeaderService
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  postedAnnouncements: any;

  ngOnInit(): void {
    this.getData();
  }
  //Drafts
  async getData() {
    this.postedAnnouncements =
      await this.announcementService.getAnnouncementPosted();
  }

  openDialogCreateAnnouncement(title: any) {
    this.dialog.open(AnnouncementsFormDialogComponent, {
      width: '68rem',
      height: '58.2rem',
      data: {
        title: title,
      },
    });
  }
}
