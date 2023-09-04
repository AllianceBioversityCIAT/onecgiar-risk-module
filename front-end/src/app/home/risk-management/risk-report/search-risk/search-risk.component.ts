import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { RiskService } from 'src/app/services/risk.service';

@Component({
  selector: 'app-search-risk',
  templateUrl: './search-risk.component.html',
  styleUrls: ['./search-risk.component.scss']
})
export class SearchRiskComponent {
  constructor(
    private fb: FormBuilder,
    private riskService: RiskService,
    public initiativeService: InitiativesService,
    public activatedRoute: ActivatedRoute,

  ) {}
  categories: any;
  filterForm: any;
  @Input() AllRisk: any;

  @Input() initiative_id: number | null = null;

  @Output() filters: EventEmitter<any> = new EventEmitter<any>();


  @Output() exportPdf = new EventEmitter<string>();

  exportPDF() {
    this.exportPdf.emit();
  }

  // roles = [ROLES.COORDINATOR, ROLES.LEAD, ROLES.MEMBER];

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

  redundant: boolean = false;
  redundantChange() {
    this.filterForm.controls['redundant'].setValue(this.redundant);
  }
  setForm() {
    this.filterForm = this.fb.group({
      title: [null],
      category: [null],
      created_by: [null],
      owner: [null],
      sort: [null],
      redundant: [false],
    });
  }

  resetForm() {
    this.redundant = false;
    this.myIni = false;
    this.filterForm.reset();
    this.filterForm.markAsUntouched();
  }
  // async export() {
  //   await this.initiativeService.getExport();
  // }
  async export(id: number, official_code: string) {
    await this.initiativeService.getExportByinititave(id, official_code, false);
  }
  riskUsers: any;
  riskRaiser: any;
  id: number = 0;
  initiativeId: any;

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
    this.setForm();
    this.categories = await this.riskService.getInitiativeCategories(
      this.initiative_id as number
    );
    this.filterForm.valueChanges.subscribe(() => {
      console.log(this.filterForm.value)
      if (time) clearTimeout(time);
      time = setTimeout(() => {
        this.filters.emit(this.filterForm.value);
      }, 500);
    });

    const params: any = this.activatedRoute?.snapshot.params;

    this.id = +params.id;
    this.initiativeId = params.initiativeId;
  }
}
