import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { RiskService } from 'src/app/services/risk.service';
import { ROLES } from '../risk-report/team-members/team-members.component';
import { PhasesService } from 'src/app/services/phases.service';

@Component({
  selector: 'app-search-init',
  templateUrl: './search-init.component.html',
  styleUrls: ['./search-init.component.scss'],
})
export class SearchInitComponent {
  constructor(
    private fb: FormBuilder,
    private riskService: RiskService,
    private phaseService: PhasesService,
    public initiativeService: InitiativesService
  ) {}
  categories: any;
  filterForm: FormGroup = new FormGroup({});
  phaseSelected: any;
  @Output() filters: EventEmitter<any> = new EventEmitter<any>();
  @Output() activePhaseSelected = new EventEmitter<boolean>();
  @Input() archived!: boolean;
  roles = [ROLES.COORDINATOR, ROLES.LEAD, ROLES.MEMBER];

  sort = [
    { name: 'Initiative ID (lowest first)', value: 'id,ASC' },
    { name: 'Initiative ID (highest first)', value: 'id,DESC' },
    { name: 'Initiative Name (A to Z)', value: 'name,ASC' },
    { name: 'Initiative Name (Z to A)', value: 'name,DESC' },
  ];

  status = [
    { name: 'Submitted', value: '1' },
    { name: 'Draft', value: '0' },
  ];
  phases: any;
  activePhase:any;
  myIni: boolean = false;
  activePhaseSelect: boolean = true;
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
      status: [null],
      phase_id: [null],
      archived: [this.archived],
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
    this.filterForm.controls['phase_id'].setValue(this.activePhase[0]?.id);
    this.selectedPhase(this.activePhase[0]?.id)
  }
  async export() {
    await this.initiativeService.getExport(this.filterForm.value);
  }
  async ngOnInit() {
    this.setForm();
    this.phases = await this.phaseService.getPhases({},1,200);
    this.activePhase = this.phases.result.filter((d: any) => d.status == 'Open')
    this.filterForm.controls['phase_id'].setValue(this.activePhase[0]?.id);
    const phase_id = this.filterForm.get('phase_id')?.value;
    this.phaseSelected = this.phases.result.filter((d: any) => d.id == phase_id)[0];
    this.categories = await this.riskService.getInitiativesCategories();
  }

  selectedPhase(phase_id: any) {
    this.phaseSelected = this.phases.result.filter((d: any) => d.id == phase_id)[0];
    this.activePhaseSelect = this.activePhase[0].id == phase_id ? true : false;
    this.activePhaseSelected.emit(this.activePhaseSelect);
  }
}
