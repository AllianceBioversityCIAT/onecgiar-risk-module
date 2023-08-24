import { TestBed } from '@angular/core/testing';

import { ApiActionsControlsService } from './api-actions-controls.service';

describe('ApiActionsControlsService', () => {
  let service: ApiActionsControlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiActionsControlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
