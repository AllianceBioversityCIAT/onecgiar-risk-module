import { Component, ViewChild } from '@angular/core';
import { TeamMembersFormDialogComponent } from './team-members-form-dialog/team-members-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { RiskService } from 'src/app/services/risk.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { Meta, Title } from '@angular/platform-browser';

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
  initiativeId: any;
  constructor(
    public router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private initiativeService: InitiativesService,
    private riskService: RiskService,
    private toastr: ToastrService,
    private userService: UserService,
    private title: Title,
    private meta: Meta
  ) {}
  user_info: any;
  my_roles: any;
  riskUsers: any;
  assignedRiskOwner:any;

  id: number = 0;
  officalCode!: string;
  async ngOnInit() {
    const params: any = this.activatedRoute.parent?.snapshot.params;
    this.initiativeId = params.id;
    this.id = params.id;
    this.officalCode = params.initiativeId;
    this.loadInitiativeRoles();
    this.user_info = this.userService.getLogedInUser();
    this.riskUsers = await this.riskService.getRiskUsers(this.id);
    this.my_roles = this.riskUsers
      .filter((d: any) => d?.user?.id == this?.user_info?.id)
      .map((d: any) => d.role);
    if (this.canEdit()) this.displayedColumns.push('Actions');

    this.title.setTitle('Team members');
    this.meta.updateTag({
      name: 'description',
      content: 'Team members',
    });
  }
  async init() {}
  canEdit() {
    return (
      this.user_info.role == 'admin' ||
      this.my_roles?.includes(ROLES.LEAD) ||
      this.my_roles?.includes(ROLES.COORDINATOR)
    );
  }

  async deleteMember(role: any) {
    this.assignedRiskOwner = await this.riskService.getRisksOwner(role.initiative_id,role.user_id);
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          risks: this.assignedRiskOwner,
          title: 'Delete',
          message: 'Are you sure you want to delete user role ?',
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult) {
          await this.initiativeService.deleteInitiativeRole(
            this.initiativeId,
            role.id
          );
          this.loadInitiativeRoles();
          this.toastr.success('Success', `User role has been deleted`);
        }
      });
  }

  async openNewTeamMemberDialog() {
    const dialogRef = this.dialog.open(TeamMembersFormDialogComponent, {
      width: '68rem',
      height: 'auto',
      data: { role: 'add', member: null },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result?.role == 'add') {
        // access new data => result.formValue
        const email = result.formValue.email;
        const userRole = result.formValue.userRole;
        console.log({ email, userRole });
        // handel add memeber API service
        this.initiativeService
          .createNewInitiativeRole(this.initiativeId, {
            initiative_id: this.initiativeId,
            email: result.formValue.email,
            role: result.formValue.userRole,
            user_id: result.formValue.user_id,
          })
          .subscribe(
            (data) => {
              if (data) {
                this.toastr.success('Success', `User role has been added`);
                this.loadInitiativeRoles();
              }
            },
            (error) => {
              this.toastr.error(error.error.message);
            }
          );
      }
    });
  }

  openEditTeamMemberDialog(roleId: number, role: any) {
    const dialogRef = this.dialog.open(TeamMembersFormDialogComponent, {
      width: '68rem',
      height: 'auto',
      data: { role: 'edit', member: role },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result?.role == 'edit') {
        console.log('edit');
        // access edited data => result.formValue
        await this.initiativeService.updateInitiativeRole(
          this.initiativeId,
          roleId,
          {
            initiative_id: this.initiativeId,
            id: roleId,
            user_id: result.formValue.user_id,
            email: result.formValue.email,
            role: result.formValue.userRole,
          }
        )
        .subscribe(
          (data) => {
            if (data) {
              this.toastr.success('Success', `User role has been updated`);
              this.loadInitiativeRoles();
            }
          },
          (error) => {
            this.toastr.error(error.error.message);
          }
        );
      }
    });
  }

  displayedColumns: string[] = [
    /*'User Name',*/ 'Email',
    'User',
    'Role',
    'Creation Date',
    'Status',
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async loadInitiativeRoles() {
    var data: any = await this.initiativeService.getInitiativeRoles(
      this.initiativeId
    );
    this.dataSource = new MatTableDataSource<any>(data);
  }
}
