import { TestBed } from '@angular/core/testing';

import { ApiGlossaryService } from './api-glossary.service';

describe('ApiGlossaryService', () => {
  let service: ApiGlossaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiGlossaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
