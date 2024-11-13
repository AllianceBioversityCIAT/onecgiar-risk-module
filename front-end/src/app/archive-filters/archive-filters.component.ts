import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RiskService } from '../services/risk.service';
import { InitiativesService } from '../services/initiatives.service';
import { ROLES } from '../home/risk-management/risk-report/team-members/team-members.component';

@Component({
  selector: 'app-archive-filters',
  templateUrl: './archive-filters.component.html',
  styleUrls: ['./archive-filters.component.scss']
})
export class ArchiveFiltersComponent {
  constructor(
    private fb: FormBuilder,
    private riskService: RiskService,
    public initiativeService: InitiativesService
  ) {}
  categories: any;
  filterForm: FormGroup = new FormGroup({});
  @Output() filters: EventEmitter<any> = new EventEmitter<any>();

  roles = [ROLES.COORDINATOR, ROLES.LEAD, ROLES.MEMBER];



  setForm() {
    let time: any = null;
    this.filterForm = this.fb.group({
      initiative_id: [null],
      name: [null],
      category: [null],
      my_role: [null],
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
    this.categories = await this.riskService.getInitiativesCategories();
  }
}
