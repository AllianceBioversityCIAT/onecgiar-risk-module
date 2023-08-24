import { TestBed } from '@angular/core/testing';

import { ApiTeamMembersService } from './api-team-members.service';

describe('ApiTeamMembersService', () => {
  let service: ApiTeamMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiTeamMembersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
