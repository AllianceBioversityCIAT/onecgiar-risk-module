import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { RiskService } from 'src/app/services/risk.service';
import { ROLES } from '../new-team-member/new-team-member.component';

@Component({
  selector: 'app-search-initiatives',
  templateUrl: './search-initiatives.component.html',
  styleUrls: ['./search-initiatives.component.scss'],
})
export class SearchInitiativesComponent {
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
    { name: 'Initiative ID (ASC)', value: 'id,ASC' },
    { name: 'Initiative ID (DESC)', value: 'id,DESC' },
    { name: 'Initiative Name (ASC)', value: 'official_code,ASC' },
    { name: 'Initiative Name (DESC)', value: 'official_code,DESC' },
  ];
  myIni: boolean = false;
  myIniChange() {
    this.filterForm.controls['my_ini'].setValue(this.myIni);
  }
  setForm() {
    let time: any = null;
    this.filterForm = this.fb.group({
      initiative_id: [null],
      name: [null],
      category: [null],
      created_by: [null],
      my_role: [null],
      sort: [null],
      my_ini: [false],
    });
    this.filterForm.valueChanges.subscribe(() => {
      if (time) clearTimeout(time);
      time = setTimeout(() => {
        this.filters.emit(this.filterForm.value);
      }, 500);
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
  
    this.setForm();
    this.categories = await this.riskService.getRiskCategories();
  
  }
}
