import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Observable,
  Subject,
  catchError,
  concat,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';
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

  people$: Observable<any[]> = new Observable();
  peopleLoading = false;
  peopleInput$ = new Subject<string>();
  private loadPeople() {
    this.people$ = concat(
      of([]), // default items
      this.peopleInput$.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        tap(() => (this.peopleLoading = true)),
        switchMap((term: string) => {
          const filter = {
            full_name: term,
            email: term,
            search: 'teamMember',
          };
          return this.usersService.getUsersForTeamMember(filter).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.peopleLoading = false))
          );
        })
      )
    );
  }
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
        if (
          controls.email.value == '' &&
          (controls.user_id.value == '' || controls.user_id.value == null)
        ) {
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

  showerror: boolean = false;
  submit() {
    this.memberForm.markAllAsTouched();
    this.memberForm.updateValueAndValidity();
    if (this.memberForm.valid) {
      this.showerror = false;
      this.dialogRef.close({
        role: this.data.role,
        formValue: this.memberForm.value,
      });
    } else {
      this.showerror = true;
    }
  }

  compareWith(v1: any, v2: any) {
    return v1?.user_id === v2?.user_id;
  }
  loading: boolean = false;
  searchValue: string = '';


  items$!: Observable<any>;
  peopleInputSearch$ = new Subject<any>();

  async ngOnInit() {
    this.loadPeople();
    this.populateMemberForm();
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
