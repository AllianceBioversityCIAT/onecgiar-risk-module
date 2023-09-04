import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskReportFormComponent } from './risk-report-form.component';

describe('RiskReportFormComponent', () => {
  let component: RiskReportFormComponent;
  let fixture: ComponentFixture<RiskReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskReportFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
