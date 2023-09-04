import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { RiskService } from 'src/app/services/risk.service';

@Component({
  selector: 'app-search-init',
  templateUrl: './search-init.component.html',
  styleUrls: ['./search-init.component.scss']
})
export class SearchInitComponent {
  constructor(
    private fb: FormBuilder,
    private riskService: RiskService,
    public initiativeService: InitiativesService
  ) {}
  categories: any;
  filterForm: FormGroup = new FormGroup({});

  @Output() filters: EventEmitter<any> = new EventEmitter<any>();

  // roles = [ROLES.COORDINATOR, ROLES.LEAD, ROLES.MEMBER];

  sort = [
    { name: 'Initiative ID (ASC)', value: 'id,ASC' },
    { name: 'Initiative ID (DESC)', value: 'id,DESC' },
    { name: 'Initiative Name (ASC)', value: 'name,ASC' },
    { name: 'Initiative Name (DESC)', value: 'name,DESC' },
  ];

  status = [
    { name: 'submitted', value: '1' },
    { name: 'draft', value: '0' }
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
      status:[null]
    });
    this.filterForm.valueChanges.subscribe(() => {
      console.log(this.filterForm.value)
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
    this.categories = await this.riskService.getInitiativesCategories();
  }
}
