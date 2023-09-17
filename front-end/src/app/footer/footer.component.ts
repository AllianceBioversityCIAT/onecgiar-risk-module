import { Component } from '@angular/core';
import { ContactUsDialogComponent } from './contact-us-dialog/contact-us-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  constructor(private dialog: MatDialog) {}

  openDialogContactUs() {
    this.dialog.open(ContactUsDialogComponent, {});
  }
}
