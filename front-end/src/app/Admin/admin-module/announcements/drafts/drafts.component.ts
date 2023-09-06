import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AnnouncementsFormDialogComponent } from './announcements-form-dialog/announcements-form-dialog.component';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { HeaderService } from 'src/app/header.service';
import { Meta, Title } from '@angular/platform-browser';
import { SendTestComponent } from '../send-test/send-test.component';

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.scss'],
})
export class DraftsComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private announcementService: AnnouncementService,
    private toster: ToastrService,
    private headerService: HeaderService,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  draftsAnnouncements: any;

  ngOnInit(): void {
    this.getData();
    this.title.setTitle('Announcements |Drafts');
    this.meta.updateTag({
      name: 'description',
      content: 'Announcements |Drafts',
    });
  }
  //Drafts
  async getData() {
    this.draftsAnnouncements =
      await this.announcementService.getAnnouncementDrafts();
  }

  openDialogCreateAnnouncement(element: any, title: any) {
    this.dialog
      .open(AnnouncementsFormDialogComponent, {
        width: '68rem',
        height: '58.2rem',
        data: {
          title: title,
          element: element,
        },
      })
      .afterClosed()
      .subscribe(async (res) => {
        await this.getData();
      });
  }

  openDialogEditAnnouncement(element: any, title: any) {
    this.openDialogCreateAnnouncement(element, title);
  }

  sendAll(id: number, status: string) {
    const _popup = this.dialog.open(DeleteConfirmDialogComponent, {
      width: 'auto',
      maxHeight: 'auto',
      data: {
        id: id,
        title: 'Send to all users',
        message:
          'Are you sure you want to send this Announcement to all users in the system?',
      },
    });
    _popup.afterClosed().subscribe(async (response) => {
      if (response == true) {
        await this.announcementService.send(id);
        await this.getData();
        this.toster.success('Sent successfully');
      }
    });
  }

  sendTest(id: number) {
    const _popup = this.dialog.open(SendTestComponent, {
      width: '300px',
      maxHeight: '200px',
      data: {
        id: id,
      },
    });
    _popup.afterClosed().subscribe(async (response) => {
      if (response) {
        await this.announcementService.sendTest(id, response);
        this.getData();
        this.toster.success('Sent successfully');
      }
    });
  }

  deleteAnnouncementById(id: any) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          message: 'Are you sure you want to delete this record ?',
        },
      })
      .afterClosed()
      .subscribe(async (res) => {
        if (res == true) {
          const result = await this.announcementService.deleteAnnouncement(id);
          if (result) {
            this.toster.success('Success deleted');
          } else {
            this.toster.error('can not deleted');
          }
        }
        await this.getData();
      });
  }
}
