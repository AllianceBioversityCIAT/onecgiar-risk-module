import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FaqFormDialogComponent } from './faq-form-dialog/faq-form-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { FAQService } from 'src/app/services/faq.service';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { HeaderService } from 'src/app/header.service';
@Component({
  selector: 'app-faq-admin',
  templateUrl: './faq-admin.component.html',
  styleUrls: ['./faq-admin.component.scss'],
})
export class FaqAdminComponent {
  constructor(
    private dialog: MatDialog,
    private toster: ToastrService,
    private FaqService: FAQService,
    private headerService: HeaderService
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  data: any;

  displayedColumns: string[] = ['id', 'question', 'answer', 'actions'];

  async ngOnInit() {
    await this.getData();
  }

  async getData() {
    this.data = await this.FaqService.getData();
  }

  openFormDialog(id: any, action: string) {
    const _popup = this.dialog.open(FaqFormDialogComponent, {
      width: '68rem',
      height: 'auto',
      data: {
        id: id,
        action: action,
      },
    });
    _popup.afterClosed().subscribe(async (response) => {
      await this.getData();
    });
  }

  editFAQ(id: number, action: string) {
    this.openFormDialog(id, action);
  }

  deleteFAQ(record: any) {
    const _popup = this.dialog.open(DeleteConfirmDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        title: 'Delete',
        message: `Are you sure you want to delete ${record.answer}`,
      },
    });
    _popup.afterClosed().subscribe(async (response) => {
      if (response == true) {
        await this.FaqService.deleteFaq(record.id);
        this.getData();
        this.toster.success(`Delete ${record.answer} successfully`);
      }
    });
  }
}
