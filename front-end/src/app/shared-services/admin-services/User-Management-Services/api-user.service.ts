import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/shared-model/User-Management-Data/user.model'; 
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
@Injectable({
  providedIn: 'root',
})
export class ApiUserService {
  userData: User[] = [
    new User('', 19, 'Jhon Doe', 'j.doe@cgiar.org', 'Admin'),
    new User('', 22, 'Alice Font', 'a.font@cgiar.org', 'User'),
    new User('', 18, 'Steven Lee', 's.lee@cgiar.org', 'User'),
    new User('', 6, 'Christopher Bang', 'c.bang@cgiar.org', 'User'),
  ];

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  openDialogDeleteUser(msg: any) {
    return this.dialog.open(DeleteConfirmDialogComponent, {
      width: '68rem',
      disableClose: true,
      data: {
        message: msg,
      },
    });
  }
}
