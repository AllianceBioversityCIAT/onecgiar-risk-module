import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTeamMemberComponent } from './new-team-member.component';

describe('NewTeamMemberComponent', () => {
  let component: NewTeamMemberComponent;
  let fixture: ComponentFixture<NewTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTeamMemberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
