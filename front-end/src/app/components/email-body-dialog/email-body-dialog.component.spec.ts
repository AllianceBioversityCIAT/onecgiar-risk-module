import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailBodyDialogComponent } from './email-body-dialog.component';

describe('EmailBodyDialogComponent', () => {
  let component: EmailBodyDialogComponent;
  let fixture: ComponentFixture<EmailBodyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailBodyDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailBodyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
