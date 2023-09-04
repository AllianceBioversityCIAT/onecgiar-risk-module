import { TestBed } from '@angular/core/testing';

import { ApiFaqService } from './api-faq.service';

describe('ApiFaqService', () => {
  let service: ApiFaqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiFaqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
