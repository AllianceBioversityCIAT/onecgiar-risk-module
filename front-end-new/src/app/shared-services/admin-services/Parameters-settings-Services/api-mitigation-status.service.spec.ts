import { TestBed } from '@angular/core/testing';

import { ApiMitigationStatusService } from './api-mitigation-status.service';

describe('ApiMitigationStatusService', () => {
  let service: ApiMitigationStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiMitigationStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
