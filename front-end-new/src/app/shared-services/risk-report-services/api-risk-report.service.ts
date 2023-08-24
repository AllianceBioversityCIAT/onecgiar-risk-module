import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { RiskReport } from 'src/app/shared-model/risk-report-data/risk-report.model';

@Injectable({
  providedIn: 'root',
})
export class ApiRiskReportService {
  riskReportData: RiskReport[] = [
    new RiskReport(
      3,
      `#3. Failure of genebanks to supply/provide relevant germplasm and information in a form that can be queried by users due to lack of data, accessible data portals, or relevant genetic stocks, results in genebanks becoming under-utilized (WP3)`,
      'Scaling impact',
      5,
      8,
      '',

      'Monther',
      ''
    ),

    new RiskReport(
      5,
      `#3. Failure of genebanks to supply/provide relevant germplasm and information in a form that can be queried by users due to lack of data, accessible data portals, or relevant genetic stocks, results in genebanks becoming under-utilized (WP3)`,
      'Scaling impact',
      5,
      8,
      '',

      'Monther',
      ''
    ),

    new RiskReport(
      6,
      `#3. Failure of genebanks to supply/provide relevant germplasm and information in a form that can be queried by users due to lack of data, accessible data portals, or relevant genetic stocks, results in genebanks becoming under-utilized (WP3)`,
      'Scaling impact',
      5,
      8,
      '',

      'Monther',
      ''
    ),
    new RiskReport(
      3,
      `#3. Failure of genebanks to supply/provide relevant germplasm and information in a form that can be queried by users due to lack of data, accessible data portals, or relevant genetic stocks, results in genebanks becoming under-utilized (WP3)`,
      'Scaling impact',
      5,
      8,
      '',

      'Monther',
      ''
    ),

    new RiskReport(
      3,
      `#3. Failure of genebanks to supply/provide relevant germplasm and information in a form that can be queried by users due to lack of data, accessible data portals, or relevant genetic stocks, results in genebanks becoming under-utilized (WP3)`,
      'Scaling impact',
      5,
      8,
      '',

      'Monther',
      ''
    ),

    new RiskReport(
      3,
      `#3. Failure of genebanks to supply/provide relevant germplasm and information in a form that can be queried by users due to lack of data, accessible data portals, or relevant genetic stocks, results in genebanks becoming under-utilized (WP3)`,
      'Scaling impact',
      5,
      8,
      '',

      'Monther',
      ''
    ),

    new RiskReport(
      3,
      `#3. Failure of genebanks to supply/provide relevant germplasm and information in a form that can be queried by users due to lack of data, accessible data portals, or relevant genetic stocks, results in genebanks becoming under-utilized (WP3)`,
      'Scaling impact',
      5,
      8,
      '',

      'Monther',
      ''
    ),

    new RiskReport(
      3,
      `#3. Failure of genebanks to supply/provide relevant germplasm and information in a form that can be queried by users due to lack of data, accessible data portals, or relevant genetic stocks, results in genebanks becoming under-utilized (WP3)`,
      'Scaling impact',
      5,
      8,
      '',

      'Monther',
      ''
    ),
  ];

  constructor(private dialog: MatDialog) {}

  //open dialog delete book

  openDialogDeleteRiskReport(msg: any) {
    return this.dialog.open(DeleteConfirmDialogComponent, {
      width: '68rem',
      disableClose: true,
      data: {
        message: msg,
      },
    });
  }
}
