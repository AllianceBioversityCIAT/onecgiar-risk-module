import { TestBed } from '@angular/core/testing';

import { MitigationStatusService } from './mitigation-status.service';

describe('MitigationStatusService', () => {
  let service: MitigationStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MitigationStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
