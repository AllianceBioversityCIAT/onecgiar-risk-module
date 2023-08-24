import { Injectable } from '@angular/core';
import { RiskManagement } from 'src/app/shared-model/risk-management-data/risk-management.model';

@Injectable({
  providedIn: 'root',
})
export class ApiRiskManagementService {
  riskManagementData: RiskManagement[] = [
    new RiskManagement(
      'INIT-01',
      'Operational: Data Impedance (1)',
      'Partners and partnerships',
      5,
      'Leader',
      'Submitted'
    ),
    new RiskManagement(
      'INIT-01',
      'Operational: Data Impedance (1)',
      'Partners and partnerships',
      5,
      'Leader',
      'Submitted'
    ),
    new RiskManagement(
      'INIT-01',
      'Operational: Data Impedance (1)',
      'Partners and partnerships',
      5,
      'Leader',
      'Submitted'
    ),
    new RiskManagement(
      'INIT-01',
      'Operational: Data Impedance (1)',
      'Partners and partnerships',
      5,
      'Leader',
      'Submitted'
    ),
    new RiskManagement(
      'INIT-01',
      'Operational: Data Impedance (1)',
      'Partners and partnerships',
      5,
      'Leader',
      'Submitted'
    ),
  ];

  constructor() {}
}
