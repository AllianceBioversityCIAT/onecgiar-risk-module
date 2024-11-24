import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/header.service';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { PhasesService } from 'src/app/services/phases.service';

@Component({
  selector: 'app-last-submition-phase',
  templateUrl: './last-submition-phase.component.html',
  styleUrls: ['./last-submition-phase.component.scss']
})
export class LastSubmitionPhaseComponent implements OnInit {
  constructor(public router: Router,
    public activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
    private phasesService: PhasesService,
    private initiativesService: InitiativesService,

    ){
      this.headerService.background = '#04030f';
      this.headerService.backgroundNavMain = '#0f212f';
      this.headerService.backgroundUserNavButton = '#0f212f';
    }

    columnsToDisplay: string[] = [
      'INIT-ID',
      'Science programs name',
      'Version ID',
      'Created date',
      'Created by',
      'Targets not set',
      'actions',
    ];

    dataSource: any;
    phaseId:any;
    data:any;

  async ngOnInit(): Promise<void> {
    this.phaseId = this.activatedRoute.snapshot.params['id'];
    await this.initTable()
  }


  async initTable() {
    this.data = await this.phasesService.getLastSubmitionVersionByPhase(this.phaseId);
    if(this.data.status == "Open") this.router.navigate(['/admin/phases']);

    this.dataSource = this.data.program.sort((a: any, b: any) => a.official_code.replace(/[\s~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g, '').toLowerCase().localeCompare(b.official_code.replace(/[\s~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g, '').toLowerCase()));
    const program = await this.initiativesService.getInitiativesWithFilters({});

    //append original init id to object
    program.forEach(( d : any ) => 
      this.dataSource.forEach(( x : any ) => {
        if(d.official_code == x.official_code && d.clarisa_id == x.clarisa_id) {
          return x['original_init_id'] = d.id
        }
      })
    )
  }


  filterReqAssistance(risk: any) {
    let column = '-';
    for (let item of risk) {
      if (item.request_assistance == true) {
        column = 'Yes';
        break;
      } else {
        column = 'No';
      }
    }
    return column;
  }
}
