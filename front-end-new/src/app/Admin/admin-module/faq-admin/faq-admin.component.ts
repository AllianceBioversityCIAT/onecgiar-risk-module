import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiGlossaryService } from 'src/app/shared-services/glossary-services/api-glossary.service';
import { FaqFormDialogComponent } from './faq-form-dialog/faq-form-dialog.component';
import { ApiFaqService } from 'src/app/shared-services/faq-services/api-faq.service';

@Component({
  selector: 'app-faq-admin',
  templateUrl: './faq-admin.component.html',
  styleUrls: ['./faq-admin.component.scss'],
})
export class FaqAdminComponent {
  constructor(
    private apiFaqService: ApiFaqService,
    private dialog: MatDialog
  ) {}

  dataSource = new MatTableDataSource(this.apiFaqService.faqData);

  displayedColumns: string[] = ['id', 'question', 'answer', 'actions'];

  openDialogCreateFaq(title: any) {
    this.dialog.open(FaqFormDialogComponent, {
      width: '68rem',
      height: '69.2rem',
      data: {
        title: title,
      },
    });
  }

  openDialogEditFaq(title: any, element: any) {
    this.dialog.open(FaqFormDialogComponent, {
      width: '68rem',
      height: '69.2rem',

      data: {
        title: title,
        element: element,
      },
    });
  }

  deleteFaq(id: any) {
    this.apiFaqService
      .openDialogDeleteFaq('Are you sure you want to delete this record ?')

      .afterClosed();
  }
}
