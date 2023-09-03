import {
  Component,
  Inject,
  ViewChild,
  OnDestroy,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared-model/User-Management-Data/user.model';
import { TeamMembers } from 'src/app/shared-model/team-members-data/team-members.model';
import { ApiUserService } from 'src/app/shared-services/admin-services/User-Management-Services/api-user.service';
import { ApiTeamMembersService } from 'src/app/shared-services/team-members-services/api-team-members.service';
export enum ROLES {
  LEAD = 'Leader',
  MEMBER = 'Team Member',
  COORDINATOR = 'Coordinator',
}
@Component({
  selector: 'app-team-members-form-dialog',
  templateUrl: './team-members-form-dialog.component.html',
  styleUrls: ['./team-members-form-dialog.component.scss'],
})
export class TeamMembersFormDialogComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    private dialogRef: MatDialogRef<TeamMembersFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any = {},
    private usersService: UserService
  ) {}
  ages: any[] = [
    { value: '<18', label: 'Under 18' },
    { value: '18', label: '18' },
    { value: '>18', label: 'More than 18' },
  ];

 
  confirmation: any = '';
  users: any = [];
  showConfirm(content: any) {
    console.log(content);
  }
  Roles: any[] = [
    { value: ROLES.LEAD, viewValue: ROLES.LEAD },
    { value: ROLES.MEMBER, viewValue: ROLES.MEMBER },
    { value: ROLES.COORDINATOR, viewValue: ROLES.COORDINATOR },
  ];


  private atLeastOneValidator = () => {
    return (controlGroup: any) => {
      let controls = controlGroup.controls;
      if (controls) {
        // console.log(controls);
        if (controls.email.value == '' && (controls.user_id.value == '' || controls.user_id.value == null)) {
          return {
            atLeastOneRequired: {
              text: 'At least one should be selected',
            },
          };
        }
      }
      return null;
    };
  };


  memberForm: any;
  populateMemberForm() {
    this.memberForm = this.fb.group({
      email: [
        this.data.role == 'add' ? '' : this.data.member.email,
        [Validators.email],
      ],
      userRole: [
        this.data.role == 'add' ? '' : this.data.member.role,
        Validators.required,
      ],
      user_id: [this.data.role == 'add' ? '' : this.data.member.user_id],
    });
    this.memberForm.setValidators(this.atLeastOneValidator());
  }


  showerror:boolean=false
  submit() {
    this.memberForm.markAllAsTouched();
    this.memberForm.updateValueAndValidity();
    if (this.memberForm.valid) {
      this.showerror =  false;
      this.dialogRef.close({
        role: this.data.role,
        formValue: this.memberForm.value,
      });
    }else{
      this.showerror =  true;
    }
  }
  
  bindValue: any = {
    full_name: 'full_name',
    email: 'email'
  }



  haveSameChar!: boolean;
  searchValue: string = '';
  async search(event: any) {
    this.searchValue = event.term;
    const filters = {
      full_name: this.searchValue,
      email: this.searchValue,
      search: 'teamMember'
    }
    this.users = await this.usersService.getUsersForTeamMember(filters);
    let i = this.searchValue.length;

    for(let user of this.users){
      if(this.searchValue == user.full_name.substring(0, i)) {
        this.haveSameChar = true;
      }
      else if(this.searchValue == user.email.substring(0, i)){
        this.haveSameChar = false;
      }
    }
  }


  async ngOnInit() {
    // this.users = await this.usersService.getUsers();
    // console.log(this.users);
    this.populateMemberForm();
  }

    //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }

}
