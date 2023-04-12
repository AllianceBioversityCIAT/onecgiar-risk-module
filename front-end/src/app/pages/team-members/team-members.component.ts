import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NewTeamMemberComponent } from 'src/app/components/new-team-member/new-team-member.component';
import { InitiativesService } from 'src/app/services/initiatives.service';

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent {
  initiativeId: any;
  constructor(public router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private initiativeService: InitiativesService
    ) {
    
  }

  async deleteMember(roleId: number) {
    await this.initiativeService.deleteInitiativeRole(this.initiativeId, roleId);
    this.loadInitiativeRoles();
  }

  openNewTeamMemberDialog() {
    const dialogRef = this.dialog.open(NewTeamMemberComponent , {
      width: '600px',
      data: {role: 'add', member: null}
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if(result.role == 'add') {
        // access new data => result.formValue 
        const email = result.formValue.email
        const userRole = result.formValue.userRole
        console.log({email, userRole})
        // handel add memeber API service
        await this.initiativeService.createNewInitiativeRole(this.initiativeId , {
          initiative_id: this.initiativeId,
          email: result.formValue.email,
          role: result.formValue.userRole,
        })
        this.loadInitiativeRoles()
      }
    });
  }

  openEditTeamMemberDialog(roleId: number, role: any) {
    const dialogRef = this.dialog.open(NewTeamMemberComponent , {
      width: '600px',
      data: {role: 'edit', member: role}
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if(result.role == 'edit') {
        console.log("edit")
       // access edited data => result.formValue 
        await this.initiativeService.updateInitiativeRole(this.initiativeId, roleId, {
          initiative_id: this.initiativeId,
          id: roleId,
          email: result.formValue.email,
          role: result.formValue.userRole,
        })
        this.loadInitiativeRoles()
      }
    });
  }


  displayedColumns: string[] = [ /*'User Name',*/ 'Email',  'My Role', 'Creation Date', 'Actions'];
  dataSource = new MatTableDataSource<any>([]);

  
  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  async loadInitiativeRoles() {
    var data: any = await this.initiativeService.getInitiativeRoles(this.initiativeId);
    this.dataSource = new MatTableDataSource<any>(data);
  }

  
  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.initiativeId = Number(params['initiativeId']);
    });
    this.loadInitiativeRoles()
  }
}
