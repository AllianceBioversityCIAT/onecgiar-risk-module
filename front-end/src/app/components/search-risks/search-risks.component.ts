import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  filterForm: any;

  @Input() initiative_id: number | null = null;

  @Output() filters: EventEmitter<any> = new EventEmitter<any>();

  roles = [ROLES.COORDINATOR, ROLES.LEAD, ROLES.MEMBER];

  sort = [
    { name: 'Risk ID (ASC)', value: 'id,ASC' },
    { name: 'Risk ID (DESC)', value: 'id,DESC' },
    { name: 'Risk Title (ASC)', value: 'title,ASC' },
    { name: 'Risk Title (DESC)', value: 'title,DESC' },
    { name: 'Current risk level (DESC)', value: 'current_level,DESC' },
    { name: 'Current risk level (ASC)', value: 'current_level,ASC' },
    { name: 'Target risk level (DESC)', value: 'target_level,DESC' },
    { name: 'Target risk level (ASC)', value: 'target_level,ASC' },
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
  riskUsers: any;
  riskRaiser: any;
  async ngOnInit() {
    let time: any = null;
    const ini = await this.initiativeService.getInitiative(
      this.initiative_id as number
    );
    this.riskRaiser = [
      ...new Map(
        ini.risks
          .map((risk: any) => risk?.created_by)
          .map((item: any) => [item['id'], item])
      ).values(),
    ];
    this.riskUsers = await this.riskService.getRiskUsers(
      this.initiative_id as number
    );
    console.log(this.riskRaiser);
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
