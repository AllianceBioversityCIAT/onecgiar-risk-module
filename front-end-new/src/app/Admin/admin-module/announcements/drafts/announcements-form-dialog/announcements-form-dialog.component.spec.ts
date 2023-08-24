import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementsFormDialogComponent } from './announcements-form-dialog.component';

describe('AnnouncementsFormDialogComponent', () => {
  let component: AnnouncementsFormDialogComponent;
  let fixture: ComponentFixture<AnnouncementsFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnouncementsFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementsFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
