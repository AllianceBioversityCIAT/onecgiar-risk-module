import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDialog } from '@angular/material/dialog';
import { TeamMembers } from 'src/app/shared-model/team-members-data/team-members.model';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ApiTeamMembersService {
  memberData: TeamMembers[] = [
    new TeamMembers(
      '',
      19,
      'Jhon Doe',
      'j.doe@cgiar.org',
      'Leader',
      '10 Jun 2022 | 10:03a.m CEST'
    ),
    new TeamMembers(
      '',
      22,
      'Alice Font',
      'a.font@cgiar.org',
      'Coordinator',
      '10 Jun 2022 | 10:03a.m CEST'
    ),
    new TeamMembers(
      '',
      18,
      'Steven Lee',
      's.lee@cgiar.org',
      'Member',
      '10 Jun 2022 | 10:03a.m CEST'
    ),
    new TeamMembers(
      '',
      6,
      'Christopher Bang',
      'c.bang@cgiar.org',
      'Member',
      '10 Jun 2022 | 10:03a.m CEST'
    ),
    new TeamMembers(
      '',
      6,
      'Christopher Bang',
      'c.bang@cgiar.org',
      'Member',
      '10 Jun 2022 | 10:03a.m CEST'
    ),
    new TeamMembers(
      '',
      6,
      'Christopher Bang',
      'c.bang@cgiar.org',
      'Member',
      '10 Jun 2022 | 10:03a.m CEST'
    ),
    new TeamMembers(
      '',
      6,
      'Christopher Bang',
      'c.bang@cgiar.org',
      'Member',
      '10 Jun 2022 | 10:03a.m CEST'
    ),
    new TeamMembers(
      '',
      6,
      'Christopher Bang',
      'c.bang@cgiar.org',
      'Member',
      '10 Jun 2022 | 10:03a.m CEST'
    ),
  ];

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  openDialogDeleteMember(msg: any) {
    return this.dialog.open(DeleteConfirmDialogComponent, {
      width: '68rem',
      disableClose: true,
      data: {
        message: msg,
      },
    });
  }
}
