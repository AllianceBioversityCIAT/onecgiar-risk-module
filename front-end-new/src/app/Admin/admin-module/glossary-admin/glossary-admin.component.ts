import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiGlossaryService } from 'src/app/shared-services/glossary-services/api-glossary.service';
import { GlossaryFormDialogComponent } from './glossary-form-dialog/glossary-form-dialog.component';

@Component({
  selector: 'app-glossary-admin',
  templateUrl: './glossary-admin.component.html',
  styleUrls: ['./glossary-admin.component.scss'],
})
export class GlossaryAdminComponent {
  constructor(
    private apiGlossaryService: ApiGlossaryService,
    private dialog: MatDialog
  ) {}

  dataSource = new MatTableDataSource(this.apiGlossaryService.glossaryData);

  displayedColumns: string[] = ['id', 'title', 'description', 'actions'];

  openDialogCreateGlossary(title: any) {
    this.dialog.open(GlossaryFormDialogComponent, {
      width: '68rem',
      height: '59.2rem',
      data: {
        title: title,
      },
    });
  }

  openDialogEditGlossary(title: any, element: any) {
    this.dialog.open(GlossaryFormDialogComponent, {
      width: '68rem',
      height: '59.2rem',
      data: {
        title: title,
        element: element,
      },
    });
  }

  deleteGlossary(id: any) {
    this.apiGlossaryService
      .openDialogDeleteGlossary('Are you sure you want to delete this record ?')
      .afterClosed();
  }
}
