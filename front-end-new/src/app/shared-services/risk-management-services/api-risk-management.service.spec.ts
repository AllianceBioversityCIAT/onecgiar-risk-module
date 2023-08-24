import { TestBed } from '@angular/core/testing';

import { ApiRiskManagementService } from './api-risk-management.service';

describe('ApiRiskManagementService', () => {
  let service: ApiRiskManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiRiskManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
