import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NewTeamMemberComponent } from 'src/app/components/new-team-member/new-team-member.component';

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent {

  constructor(public router: Router,
    public dialog: MatDialog) {
    
  }

  deleteMember(member: any) {
    alert()
     // handel add memeber API service
  }

  openNewTeamMemberDialog() {
    const dialogRef = this.dialog.open(NewTeamMemberComponent , {
      width: '600px',
      data: {role: 'add', member: null}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.role == 'add') {
        // access new data => result.formValue 
        const email = result.formValue.email
        const userRole = result.formValue.userRole
        console.log({email, userRole})
        // handel add memeber API service
      }
    });
  }

  openEditTeamMemberDialog(member: any) {
    const dialogRef = this.dialog.open(NewTeamMemberComponent , {
      width: '600px',
      data: {role: 'edit', member: member}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.role == 'edit') {
       // access edited data => result.formValue 
       const email = result.formValue.email
        const userRole = result.formValue.userRole
        console.log({email, userRole})
        // handel add memeber API service
      }
    });
  }


  displayedColumns: string[] = ['User Name', 'Email', 'Creation Date', 'My Role', 'Actions'];
  dataSource = new MatTableDataSource<any>([
    { 
      "User Name": "Moayad AL-Najdawi", 
      "Email": "Moayad@codeobia.com", 
      "Creation Date": "6 Mar. 2023", 
      "My Role": "Leader",
    },
    { 
      "User Name": "Moayad AL-Najdawi", 
      "Email": "Moayad@codeobia.com", 
      "Creation Date": "6 Mar. 2023", 
      "My Role": "Leader",
    },
    { 
      "User Name": "Moayad AL-Najdawi", 
      "Email": "Moayad@codeobia.com", 
      "Creation Date": "6 Mar. 2023", 
      "My Role": "Leader",
    },
    
  ]);

  openNewMemberDialog() {

  }
  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
