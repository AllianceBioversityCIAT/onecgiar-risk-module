import {
  Component,
  Inject,
  ViewChild,
  OnDestroy,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { User } from 'src/app/shared-model/User-Management-Data/user.model';
import { TeamMembers } from 'src/app/shared-model/team-members-data/team-members.model';
import { ApiUserService } from 'src/app/shared-services/admin-services/User-Management-Services/api-user.service';
import { ApiTeamMembersService } from 'src/app/shared-services/team-members-services/api-team-members.service';

@Component({
  selector: 'app-team-members-form-dialog',
  templateUrl: './team-members-form-dialog.component.html',
  styleUrls: ['./team-members-form-dialog.component.scss'],
})
export class TeamMembersFormDialogComponent implements OnInit {
  @ViewChild('singleSelect', { static: true })
  singleSelect!: MatSelect;

  constructor(
    private apiTeamMembersService: ApiTeamMembersService,
    private dialogRef: MatDialogRef<TeamMembersFormDialogComponent>,
    private apiUser: ApiUserService,
    @Inject(MAT_DIALOG_DATA) public memberData: { title: any; element: any }
  ) {}

 
  membersData: TeamMembers[] = [];

  memberFormData = new FormGroup({
    email: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
  });

  onAddMember() {}

  onUpdateMember() {}

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }

  //search by email

  title = 'app-material3';

  protected userData: User[] = [];

  public emailCtrl: FormControl = new FormControl();
  public emailFilterCtrl: FormControl = new FormControl();
  public filteredEmail: ReplaySubject<any> = new ReplaySubject();

  protected _onDestroy = new Subject();

  /**
   * Write code on Method
   *
   * method logical code
   */

  /**
   * Write code on Method
   *
   * method logical code
   */
  ngAfterViewInit() {
    this.setInitialValue();
  }

  /**
   * Write code on Method
   *
   * method logical code
   */
  // ngOnDestroy() {
  //   this._onDestroy.next();
  //   this._onDestroy.complete();
  // }

  ngOnInit(): void {
    this.membersData = this.apiTeamMembersService.memberData;
    
    this.userData = this.apiUser.userData;

    this.emailCtrl.setValue(this.userData);
    this.filteredEmail.next(this.userData.slice());

    this.emailFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
  }

  /**
   * Write code on Method
   *
   * method logical code
   */

  ngOnDestroy() {
    this._onDestroy.next('');
    this._onDestroy.complete();
  }

  protected setInitialValue() {
    this.filteredEmail
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: any, b: any) =>
          a && b && a.userId === b.userId;
      });
  }

  /**
   * Write code on Method
   *
   * method logical code
   */
  protected filterBanks() {
    if (!this.userData) {
      return;
    }

    let search = this.emailFilterCtrl.value;
    if (!search) {
      this.filteredEmail.next(this.userData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredEmail.next(
      this.userData.filter(
        (searchByEmail) => searchByEmail.email.toLowerCase().indexOf(search) > -1
      )
    );
  }
}
