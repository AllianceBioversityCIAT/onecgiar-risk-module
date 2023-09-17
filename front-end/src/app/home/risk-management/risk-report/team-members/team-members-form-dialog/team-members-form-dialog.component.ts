import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, concat, distinctUntilChanged, of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
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
      user_id: [this.data.role == 'add' ? null : this.data.member.user],
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

  compareWith(v1:any, v2:any){
    return v1?.user_id === v2?.user_id;
  }
  loading:boolean = false;
  searchValue: string ='';
  
  async search(event: any) {
    this.searchValue = event.term;
    const filter = {
      full_name: this.searchValue,
      email: this.searchValue,
      search: 'teamMember'
    }
    this.users =  this.usersService.getUsersForTeamMember(filter);
    this.loading = true;
    this.items$.subscribe(val => {
      this.items$ = this.users;
      this.loading = false
    })
  }


  searchInput() {
    this.items$ = concat(of([]),this.peopleInputSearch$.pipe(distinctUntilChanged()));
  }

  items$!: Observable<any>;
  peopleInputSearch$ = new Subject<any>();


  async ngOnInit() {
    this.searchInput();
    this.populateMemberForm();
  }

    //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }

}
