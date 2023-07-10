import { TestBed } from '@angular/core/testing';

import { CategoriesGroupsService } from './categories-groups.service';

describe('CategoriesGroupsService', () => {
  let service: CategoriesGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
