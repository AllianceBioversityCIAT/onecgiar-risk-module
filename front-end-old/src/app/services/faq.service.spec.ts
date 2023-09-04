import { TestBed } from '@angular/core/testing';

import { FAQService } from './faq.service';

describe('FAQService', () => {
  let service: FAQService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FAQService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
