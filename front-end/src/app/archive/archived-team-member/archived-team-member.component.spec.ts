import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedTeamMemberComponent } from './archived-team-member.component';

describe('ArchivedTeamMemberComponent', () => {
  let component: ArchivedTeamMemberComponent;
  let fixture: ComponentFixture<ArchivedTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedTeamMemberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivedTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
