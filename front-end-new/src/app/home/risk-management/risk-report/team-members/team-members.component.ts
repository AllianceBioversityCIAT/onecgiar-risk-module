import { Component, ViewChild } from '@angular/core';
import { TeamMembersFormDialogComponent } from './team-members-form-dialog/team-members-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiTeamMembersService } from 'src/app/shared-services/team-members-services/api-team-members.service';
import { MatSort } from '@angular/material/sort';

export enum ROLES {
  LEAD = 'Leader',
  MEMBER = 'Team Member',
  COORDINATOR = 'Coordinator',
}

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss'],
})
export class TeamMembersComponent {
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private apiTeamMembersService: ApiTeamMembersService,
    private dialog: MatDialog
  ) {
    // this.headerService.background = 'green';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayedColumns: string[] = [
    'userName',
    'email',
    'role',
    'creationDate',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  dataSource = new MatTableDataSource(this.apiTeamMembersService.memberData);

  openDialogAddMember(title: any) {
    this.dialog.open(TeamMembersFormDialogComponent, {
      width: '68rem',
      height: '47.2rem',
      data: {
        title: title,
      },
    });
  }

  openDialogEditMember(title: any, element: any) {
    this.dialog.open(TeamMembersFormDialogComponent, {
      width: '68rem',
      height: '47.2rem',

      data: {
        title: title,
        element: element,
      },
    });
  }

  deleteMemberById(id: any) {
    this.apiTeamMembersService
      .openDialogDeleteMember('Are you sure to delete this record ?')
      .afterClosed();
  }
}
