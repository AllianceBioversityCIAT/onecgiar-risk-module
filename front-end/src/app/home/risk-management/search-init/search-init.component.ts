import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { RiskService } from 'src/app/services/risk.service';
import { ROLES } from '../risk-report/team-members/team-members.component';
import { PhasesService } from 'src/app/services/phases.service';
import { OrganizationService } from 'src/app/services/organization.service';

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
    public initiativeService: InitiativesService,
    private organizationsService: OrganizationService
  ) {}
  categories: any;
  organizations: any;
  filterForm: FormGroup = new FormGroup({});
  phaseSelected: any;
  @Output() filters: EventEmitter<any> = new EventEmitter<any>();
  @Output() activePhaseSelected = new EventEmitter<boolean>();
  roles = [ROLES.COORDINATOR, ROLES.LEAD, ROLES.MEMBER];

  sort = [
    { name: 'Science Programs ID (lowest first)', value: 'id,ASC' },
    { name: 'Science Programs ID (highest first)', value: 'id,DESC' },
    { name: 'Science Programs Name (A to Z)', value: 'name,ASC' },
    { name: 'Science Programs Name (Z to A)', value: 'name,DESC' },
  ];

  status = [
    { name: 'Submitted', value: '1' },
    { name: 'Draft', value: '0' },
  ];
  phases: any;
  activePhase: any;
  myIni = true; // default to “My Programs”
  myProj = false; // “My Projects” off by default
  activePhaseSelect: boolean = true;
  myIniChange() {
    // if user checks “My Programs”, uncheck “My Projects”
    if (this.myIni) {
      this.myProj = false;
      this.filterForm.patchValue({ my_proj: false }, { emitEvent: false });
    }
    this.filterForm.patchValue({ my_ini: this.myIni });
  }

  myProjChange() {
    // if user checks “My Projects”, uncheck “My Programs”
    if (this.myProj) {
      this.myIni = false;
      this.filterForm.patchValue({ my_ini: false }, { emitEvent: false });
    }
    this.filterForm.patchValue({ my_proj: this.myProj });
  }
  setForm() {
    let time: any = null;
    this.filterForm = this.fb.group({
      initiative_id: [null],
      name: [null],
      category: [null],
      orgCodes: [null],
      created_by: [null],
      my_role: [null],
      sort: [null],
      my_ini: [this.myIni],
      my_proj: [this.myProj],
      status: [null],
      phase_id: [null],
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
    this.selectedPhase(this.activePhase[0]?.id);
  }
  async export() {
    await this.initiativeService.getExport(this.filterForm.value);
  }
  async ngOnInit() {
    this.setForm();
    this.phases = await this.phaseService.getPhases({}, 1, 200);
    this.phases.result = this.phases.result.filter(
      (phase: any) => phase?.show_in_home
    );
    this.activePhase = this.phases.result.filter(
      (d: any) => d.status == 'Open'
    );
    this.filterForm.controls['phase_id'].setValue(this.activePhase[0]?.id);
    const phase_id = this.filterForm.get('phase_id')?.value;
    this.phaseSelected = this.phases.result.filter(
      (d: any) => d.id == phase_id
    )[0];
    this.categories = await this.riskService.getInitiativesCategories();
    this.organizations = await this.organizationsService.getOrganizations(
      null,
      1,
      1000
    );
  }

  selectedPhase(phase_id: any) {
    this.phaseSelected = this.phases.result.filter(
      (d: any) => d.id == phase_id
    )[0];
    this.activePhaseSelect = this.activePhase[0].id == phase_id ? true : false;
    this.activePhaseSelected.emit(this.activePhaseSelect);
  }
}
