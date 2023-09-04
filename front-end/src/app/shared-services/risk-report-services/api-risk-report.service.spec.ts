import { TestBed } from '@angular/core/testing';

import { ApiRiskReportService } from './api-risk-report.service';

describe('ApiRiskReportService', () => {
  let service: ApiRiskReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiRiskReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
