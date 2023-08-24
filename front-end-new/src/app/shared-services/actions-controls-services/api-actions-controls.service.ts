import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActionsControls } from 'src/app/shared-model/actions-controls-data/actions-controls.model';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ApiActionsControlsService {
  actionsControlsData: ActionsControls[] = [
    new ActionsControls(
      2,
      'Active collaboration with Market Intelligence to work towards pragmatic',
      'Delayed'
    ),
    new ActionsControls(
      2,
      'Active collaboration with Market Intelligence to work towards pragmatic',
      'Delayed'
    ),
  ];

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  openDialogDeleteActionsControls(msg: any) {
    return this.dialog.open(DeleteConfirmDialogComponent, {
      width: '68rem',
      disableClose: true,
      data: {
        message: msg,
      },
    });
  }
}
