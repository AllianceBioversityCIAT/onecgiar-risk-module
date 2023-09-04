import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMembersFormDialogComponent } from './team-members-form-dialog.component';

describe('TeamMembersFormDialogComponent', () => {
  let component: TeamMembersFormDialogComponent;
  let fixture: ComponentFixture<TeamMembersFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMembersFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamMembersFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
