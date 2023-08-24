import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitRiskDialogComponent } from './submit-risk-dialog.component';

describe('SubmitRiskDialogComponent', () => {
  let component: SubmitRiskDialogComponent;
  let fixture: ComponentFixture<SubmitRiskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitRiskDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitRiskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
