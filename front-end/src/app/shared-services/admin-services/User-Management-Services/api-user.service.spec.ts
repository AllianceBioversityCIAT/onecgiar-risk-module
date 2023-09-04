import { TestBed } from '@angular/core/testing';

import { ApiUserManagementService } from './api-user-management.service';

describe('ApiUserManagementService', () => {
  let service: ApiUserManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiUserManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
