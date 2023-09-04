import { TestBed } from '@angular/core/testing';

import { ApiPublishedService } from './api-published.service';

describe('ApiPublishedService', () => {
  let service: ApiPublishedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPublishedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
