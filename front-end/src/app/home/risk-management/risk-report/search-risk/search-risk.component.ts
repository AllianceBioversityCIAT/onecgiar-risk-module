import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { RiskService } from 'src/app/services/risk.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-search-risk',
  templateUrl: './search-risk.component.html',
  styleUrls: ['./search-risk.component.scss'],
})
export class SearchRiskComponent {
  constructor(
    private fb: FormBuilder,
    private riskService: RiskService,
    public initiativeService: InitiativesService,
    public activatedRoute: ActivatedRoute
  ) {}
  categories: any;
  filterForm: any;
  @Input() AllRisk: any;

  @Input() program_id: number | null = null;

  @Output() filters: EventEmitter<any> = new EventEmitter<any>();

  @Output() exportPdf = new EventEmitter<string>();

  exportPDF() {
    this.exportPdf.emit();
  }

  // roles = [ROLES.COORDINATOR, ROLES.LEAD, ROLES.MEMBER];

  sort = [
    { name: 'Risk ID (lowest first)', value: 'id,ASC' },
    { name: 'Risk ID (highest first)', value: 'id,DESC' },
    { name: 'Risk Title (A to Z)', value: 'title,ASC' },
    { name: 'Risk Title (Z to A)', value: 'title,DESC' },
    { name: 'Current risk level (highest first)', value: 'current_level,DESC' },
    { name: 'Current risk level (lowest first)', value: 'current_level,ASC' },
    { name: 'Target risk level (highest first)', value: 'target_level,DESC' },
    { name: 'Target risk level (lowest first)', value: 'target_level,ASC' },
  ];
  myIni: boolean = false;
  myIniChange() {
    this.filterForm.controls['my_ini'].setValue(this.myIni);
  }

  redundant: boolean = false;
  request_assistance: boolean = false;

  redundantChange() {
    this.filterForm.controls['redundant'].setValue(this.redundant);
  }

  risksNeedHelp() {
    this.filterForm.controls['request_assistance'].setValue(
      this.request_assistance
    );
  }
  setForm() {
    this.filterForm = this.fb.group({
      title: [null],
      category: [null],
      created_by: [null],
      owner: [null],
      sort: [null],
      redundant: [false],
      request_assistance: [false],
    });
  }

  resetForm() {
    this.redundant = false;
    this.request_assistance = false;
    this.myIni = false;
    this.filterForm.reset();
    this.filterForm.markAsUntouched();
  }

  async export(id: number, official_code: string) {
    await this.initiativeService.getExportByinititave(
      id,
      official_code,
      false,
      this.filterForm.value
    );
  }
  riskUsers: any;
  riskRaiser: any;
  id: number = 0;
  scienceProgramsId: any;
  user_info: any;
  risksOwners: any;
  async ngOnInit() {
    let time: any = null;
    const ini = await this.initiativeService.getInitiative(
      this.program_id as number
    );
    this.riskRaiser = [
      ...new Map(
        ini.risks
          .map((risk: any) => risk?.created_by)
          .map((item: any) => [item['id'], item])
      ).values(),
    ];
    this.riskUsers = await this.riskService.getRiskUsers(
      this.program_id as number
    );

    this.risksOwners = ini.risks
      .filter((d: any) => {
        return d.risk_owner != null ? d.risk_owner : null;
      })
      .map((s: any) => s.risk_owner);
    this.risksOwners = [
      ...new Map(
        this.risksOwners.map((item: any) => [item['id'], item])
      ).values(),
    ];

    this.setForm();
    this.categories = await this.riskService.getInitiativeCategories(
      this.program_id as number
    );
    this.filterForm.valueChanges.subscribe(() => {
      console.log(this.filterForm.value);
      if (time) clearTimeout(time);
      time = setTimeout(() => {
        this.filters.emit(this.filterForm.value);
      }, 500);
    });

    const params: any = this.activatedRoute?.snapshot.params;

    this.id = +params.id;
    this.scienceProgramsId = params.initiativeId;

    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      this.user_info = jwt_decode(access_token);
    }
  }
}
