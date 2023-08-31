import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Category } from 'src/app/shared-model/Parameters-settings-Data/categories.model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ApiCategoryService {
  // categoryData: Category[] = [
  //   new Category('', 1, 'Cohesion', 'Strategic', 'Cohesion desc'),
  //   new Category('', 2, 'Funding', 'Financial', 'Cohesion desc'),
  //   new Category(
  //     '',
  //     3,
  //     'Legal',
  //     'Operational',
  //     'Risks arising from not adhering to legal requirements (e.g., force majeure) or ethical concerns.​'
  //   ),
  //   new Category(
  //     '',
  //     4,
  //     'Operations',
  //     'Operational',
  //     'Risks associated with internal processes (i.e., errors, breaches, damages, legacy work) and systems and external socio-political, economic, or environmental events (instability, interruptions, and disruptions), or health and safety.​editdeletevisibility'
  //   ),
  // ];

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  openDialogDeleteCategory(msg: any) {
    return this.dialog.open(DeleteConfirmDialogComponent, {
      width: '68rem',
      disableClose: true,
      data: {
        message: msg,
      },
    });
  }
}
