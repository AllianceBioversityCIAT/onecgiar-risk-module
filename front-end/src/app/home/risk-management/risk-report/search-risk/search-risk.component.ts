import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { RiskService } from 'src/app/services/risk.service';
import jwt_decode from 'jwt-decode';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

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

  exportPDF(type: 'technical' | 'full' | 'landscape') {
    this.exportPdf.emit(type);
  }

  exportWord() {
    const risks = (this.AllRisk?.risks || []).map((risk: any) => ({
      id: risk?.id ?? '-',
      title: risk?.title || '-',
      description: risk?.description || '-',
      category: risk?.category?.title || '-',
      current_likelihood: risk?.current_likelihood ?? '-',
      current_impact: risk?.current_impact ?? '-',
      current_level:
        risk?.current_likelihood != null && risk?.current_impact != null
          ? risk.current_likelihood * risk.current_impact
          : '-',
      target_likelihood: risk?.target_likelihood ?? '-',
      target_impact: risk?.target_impact ?? '-',
      target_level:
        risk?.target_likelihood != null && risk?.target_impact != null
          ? risk.target_likelihood * risk.target_impact
          : '-',
      due_date: risk?.due_date
        ? new Date(risk.due_date).toLocaleDateString()
        : '-',
      request_assistance: risk?.request_assistance ? 'Yes' : 'No',
      redundant: risk?.redundant ? 'Yes' : 'No',
      top: risk?.top && risk?.top !== 999 ? risk.top : '-',
      flagged: risk?.flag ? 'Yes' : 'No',
      risk_owner: risk?.risk_owner?.user?.full_name || risk?.risk_owner?.email || '-',
      created_by: risk?.created_by?.full_name || '-',
      mitigations:
        risk?.mitigations?.length > 0
          ? risk.mitigations.map((mitigation: any) => ({
              description: mitigation?.description || '-',
              status: mitigation?.status?.title || '-',
            }))
          : [{ description: 'No mitigation actions recorded', status: '-' }],
    }));

    const zip = this.createDocxTemplateZip();
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render({
      generated_at: new Date().toLocaleString(),
      initiative_code: this.scienceProgramsId || '-',
      total_risks: risks.length,
      risks,
    });

    const out = doc.getZip().generate({
      type: 'blob',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    saveAs(out, `Risks-${this.scienceProgramsId || 'report'}.docx`);
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

  private createDocxTemplateZip(): any {
    const zip = new PizZip();

    zip.file(
      '[Content_Types].xml',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`
    );

    zip.folder('_rels')?.file(
      '.rels',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`
    );

    zip.folder('docProps')?.file(
      'core.xml',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Risk Export</dc:title>
  <dc:creator>PRMS Risk</dc:creator>
  <cp:lastModifiedBy>PRMS Risk</cp:lastModifiedBy>
</cp:coreProperties>`
    );

    zip.folder('docProps')?.file(
      'app.xml',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>PRMS Risk</Application>
</Properties>`
    );

    zip.folder('word')?.file(
      'styles.xml',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
  </w:style>
</w:styles>`
    );

    zip.folder('word')?.folder('_rels')?.file(
      'document.xml.rels',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`
    );

    zip.folder('word')?.file(
      'document.xml',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" mc:Ignorable="w14 wp14">
  <w:body>
    <w:p><w:r><w:t>PRMS Risk - Risks Export</w:t></w:r></w:p>
    <w:p><w:r><w:t>Initiative: {initiative_code}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Total risks: {total_risks}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Generated at: {generated_at}</w:t></w:r></w:p>
    <w:p><w:r><w:t> </w:t></w:r></w:p>
    <w:p><w:r><w:t>{#risks}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Risk #{id} - {title}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Description: {description}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Category: {category}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Current likelihood/impact/level: {current_likelihood} / {current_impact} / {current_level}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Target likelihood/impact/level: {target_likelihood} / {target_impact} / {target_level}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Due date: {due_date}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Targets not set: {request_assistance}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Risk owner: {risk_owner}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Created by: {created_by}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Top rank: {top}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Flagged: {flagged}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Redundant: {redundant}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Mitigation actions:</w:t></w:r></w:p>
    <w:p><w:r><w:t>{#mitigations}</w:t></w:r></w:p>
    <w:p><w:r><w:t>- {description} (Status: {status})</w:t></w:r></w:p>
    <w:p><w:r><w:t>{/mitigations}</w:t></w:r></w:p>
    <w:p><w:r><w:t>------------------------------------------------------------</w:t></w:r></w:p>
    <w:p><w:r><w:t>{/risks}</w:t></w:r></w:p>
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`
    );

    return zip;
  }
}
