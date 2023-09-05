import { TestBed } from '@angular/core/testing';

import { TitlePageService } from './title-page.service';

describe('TitlePageService', () => {
  let service: TitlePageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TitlePageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
