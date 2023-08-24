import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MitigationStatus } from 'src/app/shared-model/Parameters-settings-Data/mitigationStatus.model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ApiMitigationStatusService {
  mitigationStatusData: MitigationStatus[] = [
    new MitigationStatus(
      '',
      2,
      'Completed',
      'the action has been completed (could be an one-off action taken or the establishment of a control to manage risk i.e. a standing review introduced or a process has been put in place'
    ),
    new MitigationStatus('', 3, 'Delayed', 'Financial'),
    new MitigationStatus(
      '',
      4,
      'Legal',
      'an action is planned or underway, has not been completed but running behind schedule'
    ),
    new MitigationStatus(
      '',
      1,
      'Not started',
      'an action is planned or underway, has not been completed but running behind schedule'
    ),
    new MitigationStatus(
      '',
      5,
      'Ongoing and on track',
      'an action is planned or underway, has not been completed but running behind schedule'
    ),
  ];

  constructor(private http: HttpClient, private dialog: MatDialog) {}


  openDialogDeleteMitigationStatus(msg: any) {
    return this.dialog.open(DeleteConfirmDialogComponent, {
      width: '68rem',
      disableClose: true,
      data: {
        message: msg,
      },
    });
  }
}
