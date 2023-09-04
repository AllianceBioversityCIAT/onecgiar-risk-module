import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ROLES } from 'src/app/components/new-team-member/new-team-member.component';
import { RiskService } from 'src/app/services/risk.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.scss'],
})
export class SearchUsersComponent {
  constructor(
    private fb: FormBuilder,
    private riskService: RiskService,
    public initiativeService: UserService
  ) {}
  categories: any;
  filterForm: FormGroup = new FormGroup({});

  @Output() filters: EventEmitter<any> = new EventEmitter<any>();

  roles = [ROLES.COORDINATOR, ROLES.LEAD, ROLES.MEMBER];

  sort = [
    { name: 'ID (ASC)', value: 'id,ASC' },
    { name: 'ID (DESC)', value: 'id,DESC' },
    { name: 'Name (ASC)', value: 'full_name,ASC' },
    { name: 'Name (DESC)', value: 'full_name,DESC' },
  ];
  setForm() {
    let time: any = null;
    this.filterForm = this.fb.group({
      id: [null],
      name: [null],
      email: [null],
      full_name: [null],
      role: [null],
      sort: [null],
    });
    this.filterForm.valueChanges.subscribe(() => {
      if (time) clearTimeout(time);
      time = setTimeout(() => {
        this.filters.emit(this.filterForm.value);
      }, 500);
    });
  }

  resetForm() {
    this.filterForm.reset();
    this.filterForm.markAsUntouched();
  }

  async ngOnInit() {
  
    this.setForm();
    this.categories = await this.riskService.getRiskCategories();
  
  }
}
