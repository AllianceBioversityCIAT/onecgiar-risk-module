import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { RiskService } from 'src/app/services/risk.service';
import { ROLES } from '../new-team-member/new-team-member.component';

@Component({
  selector: 'app-search-risks',
  templateUrl: './search-risks.component.html',
  styleUrls: ['./search-risks.component.scss'],
})
export class SearchRisksComponent {
  constructor(
    private fb: FormBuilder,
    private riskService: RiskService,
    public initiativeService: InitiativesService
  ) {}
  categories: any;
  filterForm: FormGroup = new FormGroup({});

  @Output() filters: EventEmitter<any> = new EventEmitter<any>();

  roles = [ROLES.CO_LEADER, ROLES.LEAD, ROLES.MEMBER];

  sort = [
    { name: 'Risk ID (ASC)', value: 'id,ASC' },
    { name: 'Risk ID (DESC)', value: 'id,DESC' },
    { name: 'Risk Title (DESC)', value: 'title,ASC' },
    { name: 'Risk Title (DESC)', value: 'title,DESC' },
  ];
  myIni: boolean = false;
  myIniChange() {
    this.filterForm.controls['my_ini'].setValue(this.myIni);
  }
  setForm() {
    this.filterForm = this.fb.group({
      title: [null],
      category: [null],
      created_by: [null],
      owner: [null],
      sort: [null],
    });
  }

  resetForm() {
    this.myIni = false;
    this.filterForm.reset();
    this.filterForm.markAsUntouched();
  }
  async export() {
    await this.initiativeService.getExport();
  }
  async ngOnInit() {
    let time: any = null;
    this.setForm();
    this.categories = await this.riskService.getRiskCategories();
    this.filterForm.valueChanges.subscribe(() => {
      if (time) clearTimeout(time);
      time = setTimeout(() => {
        this.filters.emit(this.filterForm.value);
      }, 500);
    });
  }
}
