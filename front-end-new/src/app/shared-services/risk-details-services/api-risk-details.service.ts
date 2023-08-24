import { Injectable } from '@angular/core';
import { RiskDetails } from 'src/app/shared-model/risk-details-data/risk-details.model';

@Injectable({
  providedIn: 'root',
})
export class ApiRiskDetailsService {
  riskDetailsData: RiskDetails[] = [
    new RiskDetails(
      'INIT-01',
      'Accelerated Breeding',
      ['Legal', 'Research innovation', 'Funding', 'Operations'],
      [
        'Lorem ipsum dolor sit',
        'Science: Inappropriate use of tools and methods (4,5)',
      ],
      [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        'Breeding pipelines use sub-optimal tools and scientific methodologies resulting in poor delivery of results.',
      ],
      [25, 15, 12, 9, 8]
    ),

    new RiskDetails(
      'INIT-03',
      'Genebanks',
      ['Operations'],
      ['Lorem ipsum dolor sit'],
      [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      ],
      [9]
    ),
  ];

  constructor() {}
}
