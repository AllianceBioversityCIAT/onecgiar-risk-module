import { TestBed } from '@angular/core/testing';

import { ApiRiskDetailsService } from './api-risk-details.service';

describe('ApiRiskDetailsService', () => {
  let service: ApiRiskDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiRiskDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
