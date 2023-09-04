import { TestBed } from '@angular/core/testing';

import { ApiAnnouncementService } from './api-announcement.service';

describe('ApiAnnouncementService', () => {
  let service: ApiAnnouncementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAnnouncementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
